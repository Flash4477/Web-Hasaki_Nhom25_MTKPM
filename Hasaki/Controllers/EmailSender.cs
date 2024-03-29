using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Web;

namespace Hasaki.Controllers
{
    public class EmailSender : IEmailSender
    {
        public void SendEmail(string to, string subject, string body)
        {
            // Logic để gửi email
            SmtpClient client = new SmtpClient("smtp.gmail.com", 587);
            client.EnableSsl = true;
            client.UseDefaultCredentials = false;
            client.Credentials = new System.Net.NetworkCredential("longvu4031@gmail.com", "xlbk roap lnww uaok");

            MailMessage mailMessage = new MailMessage();
            mailMessage.From = new MailAddress("longvu4031@gmail.com");
            mailMessage.To.Add(to);
            mailMessage.Body = body;
            mailMessage.Subject = subject;

            client.Send(mailMessage);
        }
    }


    public class EmailSenderDecorator : IEmailSender
    {
        private readonly IEmailSender _emailSender;

        public EmailSenderDecorator(IEmailSender emailSender)
        {
            _emailSender = emailSender;
        }

        public void SendEmail(string to, string subject, string body)
        {
            // Có thể thực hiện các thao tác bổ sung trước khi gửi email ở đây

            // Gọi phương thức SendEmail của IEmailSender gốc
            _emailSender.SendEmail(to, subject, body);

            // Có thể thực hiện các thao tác bổ sung sau khi gửi email ở đây
        }
    }
}