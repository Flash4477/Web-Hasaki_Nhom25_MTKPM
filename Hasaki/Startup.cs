using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.Owin;
using Owin;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.Google;
using Microsoft.AspNet.Identity;

[assembly: OwinStartup(typeof(Hasaki.Startup))]
namespace Hasaki
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            app.UseCookieAuthentication(new CookieAuthenticationOptions
            {
                AuthenticationType = DefaultAuthenticationTypes.ApplicationCookie,
                LoginPath = new PathString("/LoginResgis/Login")
            });

            app.UseExternalSignInCookie(DefaultAuthenticationTypes.ExternalCookie);

            app.UseGoogleAuthentication(new GoogleOAuth2AuthenticationOptions()
            {
                ClientId = "261077702296-91e9roeg4oq2k8tgnam74am2hl2b9f1q.apps.googleusercontent.com",
                ClientSecret = "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",
                //CallbackPath = new PathString("/LoginResgis/LoginWithGoogle")
            });
        }

    }
}