﻿using Hasaki.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace Hasaki.Areas.Admin.Proxy
{
    public interface IAuthenticationService
    {
        bool Authenticate(string username, string password);
    }
}
