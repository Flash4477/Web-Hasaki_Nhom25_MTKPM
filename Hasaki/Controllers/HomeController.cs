using Hasaki.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Web;
using System.Web.Mvc;

namespace Hasaki.Controllers
{
    public class HomeController : Controller
    {
        HasakiDatabaseEntities db = new HasakiDatabaseEntities();
        private List<SanPham> SanPhamMoi(int soluong)
        {
            return db.SanPhams.OrderByDescending(sp => sp.SanPhamID).Take(soluong).ToList();
        }
        public ActionResult Index(string SearchString = "")
        {
            if (SearchString != "")
            {
                var sp = db.SanPhams.Where(x => x.TenSanPham.ToUpper().Contains(SearchString.ToUpper()));
                return View(sp.ToList());
            }
            else
            {
                var products = SanPhamMoi(4);
                return View(products);
            }
        }
        public ActionResult DanhMucPartial()
        {
            var dsDanhMuc = db.DanhMucSanPhams.ToList();
            return PartialView(dsDanhMuc);
        }
        public ActionResult SPTheoDanhMuc(int id)
        {
            var sps = db.SanPhams.Where(sp => sp.DanhMucSanPhams.Any(dm => dm.DanhMucSanPhamID == id)).ToList();
            return View("Index",sps);
        }
        public ActionResult ChiTietSP(int id)
        {
            var sps = db.SanPhams.FirstOrDefault(sp => sp.SanPhamID == id);
            return View(sps);
        }

        public ActionResult TimDonHang(int iddonhang, string emailkh)
        {
            var kh = db.KhachHangs.Where(c => c.Email == emailkh).FirstOrDefault();
            if (kh != null)
            {
                var idkh = kh.KhachHangID;
                var dh = db.DonHangs.Where(d => d.DonHangID == iddonhang && d.KhachHangID == idkh).FirstOrDefault();
                int idDH = dh.DonHangID;
                
                // Lấy ra danh sách id các sản phẩm có trong đơn hàng đó
                var dssp = db.ChiTietDonHangs.Where(sp => sp.DonHangID == idDH).ToList();

                List<TimDonHang> timDonHangs = new List<TimDonHang>();
                foreach (var d in dssp)
                {
                    TimDonHang sp = new TimDonHang(idDH, d.SanPhamID);
                    timDonHangs.Add(sp);
                }
                ViewBag.TrangThai = dh.DaGiao;
                ViewBag.PTThanhToan = dh.ThanhToan;
                ViewBag.DonHang = timDonHangs.ToArray();
                return View(kh);
            }
            return View();
        }
    }
}