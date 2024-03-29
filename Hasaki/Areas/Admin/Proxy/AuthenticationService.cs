using Hasaki.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.ApplicationServices;
using System.Web.Mvc;

namespace Hasaki.Areas.Admin.Proxy
{
    public class AuthenticationService : IAuthenticationService
    {
        private HasakiDatabaseEntities db = new HasakiDatabaseEntities();

        public bool Authenticate(string username, string password)
        {
            var nhanvien = db.NhanViens.FirstOrDefault(k => k.TenDangNhap == username && k.MatKhau.ToLower() == password.ToLower());
            return nhanvien != null;
        }
    }
}