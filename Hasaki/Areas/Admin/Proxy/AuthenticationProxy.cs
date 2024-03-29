using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.ApplicationServices;
using WebGrease.Activities;

namespace Hasaki.Areas.Admin.Proxy
{
    public class AuthenticationProxy : IAuthenticationService
    {
        private AuthenticationService authService = new AuthenticationService();

        public bool Authenticate(string username, string password)
        {
            if (string.IsNullOrEmpty(username) || string.IsNullOrEmpty(password))
            {
                return false;
            }
            return authService.Authenticate(username, password);
        }
    }
}