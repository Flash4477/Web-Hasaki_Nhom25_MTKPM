using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Hasaki.Models
{
    public class GioHang
    {
        HasakiDatabaseEntities db = new HasakiDatabaseEntities();
        public int SanPhamID { get; set; }
        public string TenSP { get; set; }
        public int SoLuong {  get; set; }
        public double Gia {  get; set; }
        public string HinhAnh {  get; set; }
        public string ThuongHieu { get; set; }

        // Hàm tính tổng tiền
        public double TienHang()
        {
            return SoLuong * Gia;
        }
        public GioHang(int SanPhamID)
        {
            this.SanPhamID = SanPhamID;
            var sp = db.SanPhams.Single(s => s.SanPhamID == this.SanPhamID);
            var thuonghieu = db.ThuongHieux.Single(s => s.ThuongHieuID == sp.ThuongHieuID);
            this.ThuongHieu = thuonghieu.TenThuongHieu;
            this.TenSP = sp.TenSanPham;
            this.HinhAnh = sp.HinhAnh;
            this.Gia = double.Parse(sp.Gia.ToString());
            this.SoLuong = 1;
        }
    }
}