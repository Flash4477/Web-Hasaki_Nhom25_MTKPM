using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Hasaki.Models
{
    public class TimDonHang
    {
        HasakiDatabaseEntities db = new HasakiDatabaseEntities();
        public int SanPhamID { get; set; }
        public int DonHangID { get; set; }
        public string TenSP { get; set; }
        public int SoLuong { get; set; }
        public double Gia { get; set; }
        public string HinhAnh { get; set; }

        // Hàm tính tổng tiền
        public double TienHang()
        {
            return SoLuong * Gia;
        }
        public TimDonHang(int DonHangID, int SanPhamID)
        {
            this.SanPhamID = SanPhamID;
            this.DonHangID = DonHangID;
            var sp = db.SanPhams.Single(s => s.SanPhamID == this.SanPhamID);
            this.TenSP = sp.TenSanPham;
            this.HinhAnh = sp.HinhAnh;
            this.Gia = double.Parse(sp.Gia.ToString());
            var spdh = db.ChiTietDonHangs.Where(s => s.DonHangID == this.DonHangID && s.SanPhamID == this.SanPhamID).FirstOrDefault();
            this.SoLuong = (int)spdh.SoLuong;
        }
    }
}