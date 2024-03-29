using Hasaki.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Net;
using System.Web;
using System.Web.Helpers;
using System.Web.Mvc;

namespace Hasaki.Controllers
{
    public class GioHangController : Controller
    {
        HasakiDatabaseEntities db = new HasakiDatabaseEntities();
        // GET: GioHang
        public ActionResult Index()
        {
            List<GioHang> gioHangs = LayGioHang();
            if(gioHangs == null || gioHangs.Count == 0)
                return RedirectToAction("Index","Home");
            ViewBag.TongSL = TongSL();
            ViewBag.TongTien = TongTien();
            return View(gioHangs);
        }

        public ActionResult TongSLPartial()
        {
            Session["TongSL"] = TongSL();
            return PartialView();
        }

        public List<GioHang> LayGioHang()
        {
            List<GioHang> gioHangs = Session["GioHang"] as List<GioHang>;
            if (gioHangs == null)
            {
                gioHangs = new List<GioHang>();
                Session["GioHang"] = gioHangs;
            }
            return gioHangs;
        }

        public ActionResult ThemVaoGioHang(int id, int Quantity)
        {
            List<GioHang> gioHangs = LayGioHang();
            GioHang sp = gioHangs.FirstOrDefault(s => s.SanPhamID == id);
            if (sp == null)
            {
                sp = new GioHang(id);
                gioHangs.Add(sp);
            }
            else
            {
                sp.SoLuong += Quantity;
            }
            return RedirectToAction("ChiTietSP", "Home", new {id = id});
        }
        
        private int TongSL()
        {
            int TongSL = 0;
            List<GioHang> gioHangs = LayGioHang();
            if (gioHangs != null)
            {
                TongSL = gioHangs.Sum(sp => sp.SoLuong);
            }
            return TongSL;
        }

        public double TongTien()
        {
            double tongTien = 0;
            List<GioHang> gioHangs = LayGioHang();
            if (gioHangs != null)
                tongTien = gioHangs.Sum(s => s.TienHang());
            return tongTien;
        }

        public ActionResult XoaSP(int id)
        {
            List<GioHang> gioHang = LayGioHang();
            var sanpham = gioHang.FirstOrDefault(s => s.SanPhamID == id);
            if (sanpham != null)
            {
                gioHang.RemoveAll(s => s.SanPhamID == id);
                return RedirectToAction("Index");
            }
            if (gioHang.Count == 0)
            {
                return RedirectToAction("Index", "Home");
            }
            return RedirectToAction("Index");
        }
        public ActionResult CapNhatSL(int id, int Quantity)
        {
            List<GioHang> gioHang = LayGioHang();
            var sp = gioHang.FirstOrDefault(s => s.SanPhamID == id);
            if (sp != null)
            {
                sp.SoLuong = Quantity;
            }
            // Lưu lại danh sách giỏ hàng mới vào session
            Session["GioHang"] = gioHang;
            return RedirectToAction("Index");
        }
        public ActionResult DatHang()
        {
            KhachHang kh = Session["TaiKhoan"] as KhachHang;
            List<GioHang> giohang = LayGioHang();
            DonHang donhang = new DonHang();
            donhang.KhachHangID = kh.KhachHangID;
            donhang.NgayDatHang = DateTime.Now;
            donhang.TongTien = (float)TongTien();
            donhang.DaGiao = "Đang xử lý";
            donhang.ThanhToan = "Thanh toán khi nhận hàng";
            
            db.DonHangs.Add(donhang);
            db.SaveChanges();
            var idDonhangmoi = donhang.DonHangID;
            foreach (var sp in giohang)
            {
                ChiTietDonHang ctdh = new ChiTietDonHang();
                ctdh.DonHangID = donhang.DonHangID;
                ctdh.SanPhamID = sp.SanPhamID;
                ctdh.SoLuong = sp.SoLuong;
                ctdh.DonGia = sp.Gia;
                db.ChiTietDonHangs.Add(ctdh);
            }
            db.SaveChanges();
            Session["GioHang"] = null;
            // Gửi email đăng ký thành công
            SmtpClient client = new SmtpClient("smtp.gmail.com", 587);
            client.EnableSsl = true;
            client.UseDefaultCredentials = false;
            client.Credentials = new NetworkCredential(mail, passcode);
            MailMessage mailMessage = new MailMessage();
            mailMessage.From = new MailAddress(mail);
            mailMessage.To.Add(Session["email"].ToString());
            mailMessage.Subject = "Hasaki";
            mailMessage.IsBodyHtml = true; // Cho phép sử dụng HTML trong nội dung email
            mailMessage.Body = $"<h1>Đơn hàng của bạn đang được xử lý</h1><p>Mã đơn hàng của bạn là: <strong>{idDonhangmoi}</strong></p>";
            client.Send(mailMessage);
            return RedirectToAction("TimDonHang", "Home", new { iddonhang = idDonhangmoi, emailkh = kh.Email });

        }
        public string mail = "longvu4031@gmail.com";
        public string passcode = "xlbk roap lnww uaok";
        public ActionResult DatHangThanhCong()
        {
            return View();
        }
    }
}