using Hasaki.Data;
using Hasaki.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Migrations;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;

namespace Hasaki.Areas.Admin.Controllers
{
    public class SanPhamController : Controller
    {
        HasakiDatabaseEntities db = new HasakiDatabaseEntities();
        // GET: Admin/SanPham


        //Sử dụng Factory Pattern vào thêm SanPham
        private readonly ISanPhamFactory _sanPhamFactory;

        public SanPhamController(ISanPhamFactory sanPhamFactory)
        {
            _sanPhamFactory = sanPhamFactory;
        }

        public ActionResult DanhSachSP()
        {
            if (Session["Name"] != null)
            {
                var dssp = db.SanPhams.ToList();
                return View(dssp);
            }
            return RedirectToAction("Login", "LoginRegis");
        }

        [HttpGet]
        public ActionResult ThemSP()
        {
            if (Session["Name"] != null)
            {
                ViewBag.ThuongHieuID = new SelectList(db.ThuongHieux, "ThuongHieuID", "TenThuongHieu");
                var sanPham = _sanPhamFactory.CreateSanPham();
                return View(sanPham); //Thêm đối tượng vào View qua Factory Pattern
            }
            return RedirectToAction("Login", "LoginRegis");
        }

        [HttpPost]
        public ActionResult ThemSP(SanPham sp)
        {
            if (Session["Name"] != null)
            {
                if (!ModelState.IsValid)
                {
                    return View(sp);
                }

                db.SanPhams.Add(sp);
                db.SaveChanges();

                return RedirectToAction("DanhSachSP");
            }
            return RedirectToAction("Login", "LoginRegis");
        }
        public ActionResult Delete(int id)
        {
            if (Session["Name"] != null)
            {
                try
                {
                    var product = db.SanPhams.Find(id);
                    db.SanPhams.Remove(product);
                    db.SaveChanges();
                }
                catch (Exception)
                {
                    return RedirectToAction("DanhSachSP");
                }

                return RedirectToAction("DanhSachSP");
            }
            return RedirectToAction("Login", "LoginRegis");
        }
        public ActionResult Details(int? id)
        {
            if (Session["Name"] != null)
            {
                if (id == null)
                {
                    return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
                }
                SanPham sp = db.SanPhams.Find(id);
                if (sp == null)
                {
                    return HttpNotFound();
                }
                return View(sp);
            }
            return RedirectToAction("Login", "LoginRegis");
        }
        [HttpGet]
        public ActionResult Edit(int id)
        {
            if (Session["Name"] != null)
            {
                ViewBag.ThuongHieuID = new SelectList(db.ThuongHieux, "ThuongHieuID", "TenThuongHieu");
                var product = db.SanPhams.Find(id);
                if (product == null)
                {
                    // Xử lý trường hợp không tìm thấy sản phẩm
                    return HttpNotFound();
                }

                return View(product);
            }
            return RedirectToAction("Login", "LoginRegis");
        }
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit(SanPham sanPham)
        {
            if (ModelState.IsValid)
            {
                db.Entry(sanPham).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("DanhSachSP");
            }
            return View(sanPham);
        }
    }
}