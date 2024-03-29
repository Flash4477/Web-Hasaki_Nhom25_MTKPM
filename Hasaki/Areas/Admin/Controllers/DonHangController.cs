using Hasaki.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;

namespace Hasaki.Areas.Admin.Controllers
{
    public class DonHangController : Controller
    {
        HasakiDatabaseEntities db = new HasakiDatabaseEntities();
        // GET: Admin/DonHang
        public ActionResult DanhSachDH()
        {
            if (Session["Name"] != null)
            {
                var dh = db.DonHangs.ToList();
                return View(dh);
            }
            return RedirectToAction("Login", "LoginRegis");
        }
        public ActionResult Delete(int id)
        {
            if (Session["Name"] != null)
            {

                try
                {
                    var ctdh = db.ChiTietDonHangs.Where(d => d.DonHangID == id);
                    db.ChiTietDonHangs.RemoveRange(ctdh);

                    var dh = db.DonHangs.Find(id);
                    db.DonHangs.Remove(dh);
                    db.SaveChanges();
                }
                catch (Exception)
                {
                    return RedirectToAction("DanhSachDH");
                }

                return RedirectToAction("DanhSachDH");
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
                var ctdh = db.ChiTietDonHangs.Where(p => p.DonHangID == id);
                if (ctdh == null)
                {
                    return HttpNotFound();
                }
                return View(ctdh);
            }
            return RedirectToAction("Login", "LoginRegis");
        }
    }
}