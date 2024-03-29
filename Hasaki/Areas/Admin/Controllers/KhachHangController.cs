using Hasaki.Models;
using System;
using System.Linq;
using System.Net;
using System.Web.Mvc;

namespace Hasaki.Areas.Admin.Controllers
{
    public class KhachHangController : Controller
    {
        private HasakiDatabaseEntities db = new HasakiDatabaseEntities();

        public ActionResult DanhSachKH()
        {
            if (Session["Name"] != null)
            {
                var khachHangs = db.KhachHangs.ToList();
                return View(khachHangs);
            }
            return RedirectToAction("Login", "LoginRegis");
        }


        // GET: Admin/KhachHang/Details/5
        public ActionResult Details(int? id)
        {
            if (Session["Name"] != null)
            {
                if (id == null)
                {
                    return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
                }
                KhachHang khachHang = db.KhachHangs.Find(id);
                if (khachHang == null)
                {
                    return HttpNotFound();
                }
                return View(khachHang);
            }
            return RedirectToAction("Login", "LoginRegis");
        }

        // GET: Admin/KhachHang/Create
        public ActionResult Create()
        {
            if (Session["Name"] != null)
            {
                return View();
            }
            return RedirectToAction("Login", "LoginRegis");
        }

        // POST: Admin/KhachHang/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "TenKhachHang,Email,SoDienThoai,TenDangNhap,MatKhau")] KhachHang khachHang)
        {
            if (ModelState.IsValid)
            {
                db.KhachHangs.Add(khachHang);
                db.SaveChanges();
                return RedirectToAction("Index");
            }

            return View(khachHang);
        }

        // GET: Admin/KhachHang/Edit/5
        public ActionResult Edit(int? id)
        {
            if (Session["Name"] != null)
            {
                if (id == null)
                {
                    return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
                }
                KhachHang khachHang = db.KhachHangs.Find(id);
                if (khachHang == null)
                {
                    return HttpNotFound();
                }
                return View(khachHang);
            }
            return RedirectToAction("Login", "LoginRegis");
        }

        // POST: Admin/KhachHang/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "KhachHangID,TenKhachHang,Email,SoDienThoai,TenDangNhap,MatKhau")] KhachHang khachHang)
        {
            if (ModelState.IsValid)
            {
                db.Entry(khachHang).State = System.Data.Entity.EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(khachHang);
        }

        // GET: Admin/KhachHang/Delete/5
        public ActionResult Delete(int? id)
        {
            if (Session["Name"] != null)
            {

                try
                {
                    KhachHang khachHang = db.KhachHangs.Find(id);
                    db.KhachHangs.Remove(khachHang);
                    db.SaveChanges();
                }
                catch (Exception)
                {
                    return RedirectToAction("DanhSachKH");
                }
                return RedirectToAction("DanhSachKH");

            }
            return RedirectToAction("Login", "LoginRegis");
        }

        // POST: Admin/KhachHang/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(int id)
        {
            KhachHang khachHang = db.KhachHangs.Find(id);
            db.KhachHangs.Remove(khachHang);
            db.SaveChanges();
            return RedirectToAction("DanhSachKH");
        }
    }
}
