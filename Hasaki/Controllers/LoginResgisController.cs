using Hasaki.Models;
using Microsoft.Ajax.Utilities;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net.Mail;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using System.Web;
using System.Web.Mvc;
using System.Data.Entity.Migrations;
using System.Web.UI.HtmlControls;
using System.Web.Helpers;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity;
using Microsoft.Owin.Security;

namespace Hasaki.Controllers
{
    
    public class LoginResgisController : Controller
    {
        private readonly IPasswordStrategy _passwordStrategy;

        private readonly IEmailSender _emailSender;

        public LoginResgisController(IEmailSender emailSender)
        {
            _emailSender = emailSender;
        }

        public LoginResgisController()
        {
            _passwordStrategy = new SHA256PasswordStrategy(); // Sử dụng SHA256 làm strategy mặc định
        }   

        // Thêm constructor để tiện cho việc unit test hoặc thay đổi strategy
        public LoginResgisController(IPasswordStrategy passwordStrategy)
        {
            _passwordStrategy = passwordStrategy;
        }

        public string mail = "longvu4031@gmail.com";
        public string passcode = "xlbk roap lnww uaok";
        // GET: LoginResgis
        [HttpGet]
        public ActionResult Login()
        {
            return View();
        }
        [HttpPost]
        public ActionResult Login(KhachHang kh)
        {
            var db = new HasakiDatabaseEntities();
            if (ModelState.IsValid)
            {
                if (string.IsNullOrEmpty(kh.Email))
                    ModelState.AddModelError(string.Empty, "Email không được để trống");
                if (string.IsNullOrEmpty(kh.MatKhau))
                    ModelState.AddModelError(string.Empty, "Mật khẩu không được để trống");
                if (ModelState.IsValid)
                {
                    string hashedPassword = _passwordStrategy.HashPassword(kh.MatKhau);
                    var khach = db.KhachHangs.FirstOrDefault(k => k.Email == kh.Email && k.MatKhau.ToLower() == hashedPassword);
                    if (khach != null)
                    {
                        Session["Name1"] = khach.TenKhachHang;
                        Session["IDuser"] = khach.KhachHangID;
                        Session["TaiKhoan"] = khach;
                        Session["email"] = khach.Email;

                        // Gửi email đăng nhập thành công
                        SmtpClient client = new SmtpClient("smtp.gmail.com", 587);
                        client.EnableSsl = true;
                        client.UseDefaultCredentials = false;
                        client.Credentials = new NetworkCredential(mail, passcode); // Cần thay thế mail và passcode bằng thông tin thực của bạn
                        Random random = new Random();
                        int rdn = random.Next(100000, 999999);
                        Session["rdn"] = rdn;
                        // Session["email"] = email; // Không cần thiết vì đã gán vào Session["email"] ở trên
                        MailMessage mailMessage = new MailMessage();
                        mailMessage.From = new MailAddress(mail);
                        mailMessage.To.Add(khach.Email); // Sử dụng địa chỉ email của khách hàng
                        string url = Url.Action("ChekCode", "LoginResgis", null, protocol: Request.Url.Scheme);
                        mailMessage.Body = $"Mã xác nhận của bạn là: {rdn}\nHoặc click vào link sau: {url}";
                        mailMessage.Subject = "Verify code Hasaki";
                        client.Send(mailMessage);

                        Session["CheckCodeAction"] = "Login";

                        // Chuyển hướng đến trang CheckCode
                        return RedirectToAction("ChekCode", "LoginResgis");
                    }
                    else
                    {
                        var mail = db.KhachHangs.FirstOrDefault(k => k.Email == kh.Email);
                        if (mail != null)
                        {
                            ModelState.AddModelError(string.Empty, "Sai mật khẩu");
                            return View();
                        }
                        ModelState.AddModelError(string.Empty, "Tài khoản không tồn tại");
                        return View();
                    }
                }
            }
            return RedirectToAction("Index", "Home");
        }
        [HttpGet]
        public ActionResult Regis()
        {
            return View();
        }
        [HttpPost]
        public ActionResult Regis(string email, string tenkhachhang, string matkhau1, string matkhau2)
        {
            var db = new HasakiDatabaseEntities();
            if (ModelState.IsValid)
            {
                if (string.IsNullOrEmpty(email))
                    ModelState.AddModelError(string.Empty, "Email không được để trống");
                if (string.IsNullOrEmpty(tenkhachhang))
                    ModelState.AddModelError(string.Empty, "Tên không được để trống");
                if (string.IsNullOrEmpty(matkhau1))
                    ModelState.AddModelError(string.Empty, "Mật khẩu không được để trống");
                if (string.IsNullOrEmpty(matkhau2))
                    ModelState.AddModelError(string.Empty, "Nhập lại mật khẩu");
                if (matkhau1 != matkhau2)
                    ModelState.AddModelError(string.Empty, "Mật khẩu không khớp");
                if (ModelState.IsValid)
                {
                    string hashedPassword = _passwordStrategy.HashPassword(matkhau1);
                    var khach = db.KhachHangs.FirstOrDefault(k => k.Email == email);
                    if (khach != null)
                    {
                        ModelState.AddModelError(string.Empty, "Tài khoản đã tồn tại");
                    }
                    else if (khach == null)
                    {
                        KhachHang khachhang = new KhachHang();
                        khachhang.Email = email;
                        khachhang.MatKhau = hashedPassword;
                        khachhang.TenKhachHang = tenkhachhang;
                        db.KhachHangs.Add(khachhang);
                        db.SaveChanges();
                        // Gửi email đăng ký thành công
                        // Sử dụng EmailSenderDecorator để gửi email
                        var emailDecorator = new EmailSenderDecorator(_emailSender);
                        emailDecorator.SendEmail(email, "Hasaki xin chào khách hàng mới !", $"Đăng ký thành công \n Tài khoản: {email} \n Mật khẩu: {matkhau1}");

                        ViewBag.ThongBao = "Đăng ký thành công";
                    }
                    else
                        ViewBag.ThongBao = "Lỗi";
                }
            }
            return RedirectToAction("Index", "Home");
        }
        [HttpGet]
        public ActionResult ForgotPass()
        {
            return View();
        }
        [HttpPost]
        public ActionResult ForgotPass(string email)
        {


            var db = new HasakiDatabaseEntities();
            if (string.IsNullOrEmpty(email))
                ModelState.AddModelError(string.Empty, "Vui lòng nhập email");
            if (ModelState.IsValid)
            {
                var khach = db.KhachHangs.FirstOrDefault(k => k.Email == email);
                if (khach != null)
                {
                    // Gửi email đăng ký thành công
                    SmtpClient client = new SmtpClient("smtp.gmail.com", 587);
                    client.EnableSsl = true;
                    client.UseDefaultCredentials = false;
                    client.Credentials = new NetworkCredential(mail, passcode);
                    Random random = new Random();
                    int rdn = random.Next(100000, 999999);
                    Session["rdn"] = rdn;
                    Session["email"] = email;
                    MailMessage mailMessage = new MailMessage();
                    mailMessage.From = new MailAddress(mail);
                    mailMessage.To.Add(email);
                    //mailMessage.Body = $"";
                    string url = Url.Action("SetPass", "LoginResgis", new { rdn = rdn }, protocol: Request.Url.Scheme);
                    mailMessage.Body = $"Mã xác nhận của bạn là:  {rdn} \nHoặc click vào link sau:  {url}";
                    mailMessage.Subject = "Verify code Hasaki";
                    client.Send(mailMessage);
                }
                else
                {
                    ViewBag.ThongBao = "Không tồn tại tài khoản";
                }

                Session["CheckCodeAction"] = "ForgotPass";

                return RedirectToAction("ChekCode", "LoginResgis");


            }
            return RedirectToAction("ChekCode", "LoginResgis");
        }
        [HttpGet]
        public ActionResult ChekCode()
        {
            if (Session["email"] != null)
            {
                return View();
            }
            return RedirectToAction("ForgotPass","LoginResgis");

        }

        //[HttpPost]
        //public ActionResult ChekCode(int code)
        //{
        //    if (Session["email"] != null)
        //    {
        //        int rdn = int.Parse(Session["rdn"].ToString());
        //        if (code != rdn)
        //        {
        //            ViewBag.ThongBao = "Sai mã";
        //            return View();
        //        }
        //        Session["check"] = 1;
        //        return RedirectToAction("SetPass", "LoginResgis");
        //    }
        //    Session["check"] = null;
        //    return RedirectToAction("ForgotPass", "LoginResgis");
        //}

        // sửa
        [HttpPost]
        public ActionResult ChekCode(int code)
        {
            if (Session["email"] != null)
            {
                int rdn = int.Parse(Session["rdn"].ToString());
                if (code != rdn)
                {
                    ViewBag.ThongBao = "Sai mã";
                    return View();
                }
                Session["check"] = 1;

                // Lấy giá trị của action từ session
                string action = Session["CheckCodeAction"] as string;

                if (action == "Login")
                {
                    // Nếu action là "Login", chuyển hướng đến trang Index
                    return RedirectToAction("Index", "Home");
                }
                else if (action == "ForgotPass")
                {
                    // Nếu action là "ForgotPass", chuyển hướng đến trang SetPass
                    return RedirectToAction("SetPass", "LoginResgis");
                }
            }

            Session["check"] = null;
            return RedirectToAction("ForgotPass", "LoginResgis");
        }


        [HttpGet]
        public ActionResult SetPass(int? rdn)
        {
            if (rdn != null || (Session["email"] != null && Session["check"] != null))
            {
                return View();
            }
            return RedirectToAction("ForgotPass", "LoginResgis");
        }

        [HttpPost]
        public ActionResult SetPass(string matkhau1, string matkhau2, int? rdn)
        {
            if ((rdn != null || (Session["email"] != null) && Session["check"] != null))
            {
                if (matkhau1 != matkhau2)
                {
                    ModelState.AddModelError(string.Empty, "Mật khẩu không hợp lệ");
                }
                else
                {
                    var db = new HasakiDatabaseEntities();
                    string email = Session["email"] as string;
                    var sha256 = SHA256.Create();
                    byte[] bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(matkhau1));

                    var sb = new StringBuilder();
                    for (int i = 0; i < bytes.Length; i++)
                    {
                        sb.Append(bytes[i].ToString("x2"));
                    }
                    string matkhau = sb.ToString();
                    var khach = db.KhachHangs.FirstOrDefault(k => k.Email == email);
                    khach.MatKhau = matkhau;
                    db.KhachHangs.AddOrUpdate(khach);
                    db.SaveChanges();
                }
                return RedirectToAction("Finish","LoginResgis");
            }
            ViewBag.ThongBao = "Hệ thống đang gặp lỗi. Hãy sử dụng mã xác thực của bạn";
            return View();
        }

      
        // sửa
        [HttpGet]
        public ActionResult Logout()
        {
            // Xóa các session hoặc thông tin người dùng khác khỏi phiên đăng nhập
            Session.Clear();
            Session.Abandon();
            // Điều hướng người dùng đến trang chủ hoặc trang đăng nhập
            return RedirectToAction("Index", "Home");
        }
        //public ActionResult LoginWithGoogle(string returnUrl)
        //{
        //    // Yêu cầu OWIN middleware chuyển hướng người dùng đến Google để xác thực
        //    return new ChallengeResult("Google", Url.Action("GoogleLoginCallback", "LoginResgis", new { ReturnUrl = returnUrl }));
        //}

        //internal class ChallengeResult : HttpUnauthorizedResult
        //{
        //    public ChallengeResult(string provider, string redirectUri)
        //    {
        //        LoginProvider = provider;
        //        RedirectUri = redirectUri;
        //    }

        //    public string LoginProvider { get; set; }
        //    public string RedirectUri { get; set; }

        //    public override void ExecuteResult(ControllerContext context)
        //    {
        //        var properties = new AuthenticationProperties { RedirectUri = RedirectUri };
        //        context.HttpContext.GetOwinContext().Authentication.Challenge(properties, LoginProvider);
        //    }
        //}
        //[AllowAnonymous]
        //public async Task<ActionResult> GoogleLoginCallback(string returnUrl)
        //{
        //    var authenticateResult = await HttpContext.GetOwinContext().Authentication.AuthenticateAsync(DefaultAuthenticationTypes.ExternalCookie);

        //    if (authenticateResult != null && authenticateResult.Identity != null)
        //    {
        //        var identity = authenticateResult.Identity;
        //        var emailClaim = identity.FindFirst(ClaimTypes.Email);
        //        var email = emailClaim?.Value;

        //        var db = new HasakiDatabaseEntities();
        //        var user = db.KhachHangs.FirstOrDefault(u => u.Email == email);
        //        if (user != null)
        //        {
        //            Session["Name1"] = user.TenKhachHang;
        //            Session["IDuser"] = user.KhachHangID;
        //            Session["TaiKhoan"] = user;
        //            Session["email"] = user.Email;
        //        }
        //        if (user != null)
        //        {
        //            var claims = new List<Claim>
        //    {
        //        new Claim(ClaimTypes.Name, user.TenKhachHang),
        //        new Claim(ClaimTypes.Email, user.Email),
        //    };

        //            identity = new ClaimsIdentity(claims, DefaultAuthenticationTypes.ApplicationCookie);
        //            HttpContext.GetOwinContext().Authentication.SignIn(new AuthenticationProperties() { IsPersistent = false }, identity);
        //            return RedirectToAction("Index", "Home");
        //        }
        //        else
        //        {
        //            // Nếu không tồn tại, chuyển hướng đến trang đăng ký với email
        //            return RedirectToAction("Regis", "LoginResgis", new { email = email });
        //        }
        //    }

        //    // Nếu không xác thực được, quay trở lại trang đăng nhập
        //    return RedirectToAction("Login", "LoginResgis");
        //}


        //private ActionResult RedirectToLocal(string returnUrl)
        //{
        //    if (Url.IsLocalUrl(returnUrl))
        //    {
        //        return Redirect(returnUrl);
        //    }
        //    else
        //    {
        //        return RedirectToAction("https://localhost:44365/");
        //    }
        //}


        public ActionResult Finish() { return View(); }

        public ActionResult UserPatial()
        {
            return PartialView();
        }
    }
}