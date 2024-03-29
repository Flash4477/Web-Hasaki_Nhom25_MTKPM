using Hasaki.Builder;
using Hasaki.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using static System.Data.Entity.Infrastructure.Design.Executor;

namespace Hasaki.Areas.Admin.Controllers
{
    public class DanhMucController : Controller
    {
        HasakiDatabaseEntities db = new HasakiDatabaseEntities();
        // GET: Admin/DanhMuc
        public ActionResult DanhSachDM()
        {
            if (Session["Name"] != null)
            {
                // Lấy danh sách DanhMucSanPhams từ database
                var cate = db.DanhMucSanPhams.ToList();

                // Chuyển đổi sang DanhMucSanPhamViewModel
                var viewModelList = cate.Select(c => new DanhMucSanPhamViewModel
                {
                    DanhMucId = c.DanhMucSanPhamID,
                    TenDanhMuc = c.TenDanhMuc,
                    MoTa = c.MoTa
                }).ToList();

                // Truyền viewModelList vào view
                return View(viewModelList);
            }
            return RedirectToAction("Login", "LoginRegis");
        }

        [HttpGet]
        public ActionResult Create()
        {
            if (Session["Name"] != null)
            {
                return View(new DanhMucSanPhamViewModel());
            }
            return RedirectToAction("Login", "LoginRegis");
        }

        [HttpPost]
        public ActionResult Create(DanhMucSanPhamViewModel model)
        {
            if (Session["Name"] != null)
            {
                if (!ModelState.IsValid)
                {
                    return View(model);
                }

                var danhMucSanPham = new DanhMucSanPhamBuilder()
                                        .SetTen(model.TenDanhMuc)
                                        .SetMoTa(model.MoTa)
                                        .Build();

                db.DanhMucSanPhams.Add(danhMucSanPham);
                db.SaveChanges();

                return RedirectToAction("DanhSachDM");
            }
            return RedirectToAction("Login", "LoginRegis");
        }
        public ActionResult Delete(int id)
        {
            if (Session["Name"] != null)
            {
                try
                {
                    var cate = db.DanhMucSanPhams.Find(id);
                    db.DanhMucSanPhams.Remove(cate);
                    db.SaveChanges();
                }
                catch (Exception)
                {
                    // Dính liên kết tới các bảng khác sẽ reload lại trang không thực hiện tác vụ
                    return RedirectToAction("DanhSachDM");
                }

                return RedirectToAction("DanhSachDM");
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
                DanhMucSanPham cate = db.DanhMucSanPhams.Find(id);
                if (cate == null)
                {
                    return HttpNotFound();
                }
                return View(cate);
            }
            return RedirectToAction("Login", "LoginRegis");
        }
        [HttpGet]
        public ActionResult Edit(int id)
        {
            if (Session["Name"] != null)
            {
                var danhMucSanPham = db.DanhMucSanPhams.Find(id);
                if (danhMucSanPham == null)
                {
                    return HttpNotFound();
                }

                var model = new DanhMucSanPhamViewModel
                {
                    DanhMucId = danhMucSanPham.DanhMucSanPhamID,
                    TenDanhMuc = danhMucSanPham.TenDanhMuc,
                    MoTa = danhMucSanPham.MoTa
                };

                return View(model);
            }
            return RedirectToAction("Login", "LoginRegis");
        }
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit(DanhMucSanPham cate)
        {
            if (ModelState.IsValid)
            {
                db.Entry(cate).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("DanhSachDM");
            }
            return View(cate);
        }
    }
}