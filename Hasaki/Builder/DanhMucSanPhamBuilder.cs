using Hasaki.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Hasaki.Builder
{
    public class DanhMucSanPhamBuilder
    {
        private DanhMucSanPham _danhMuc = new DanhMucSanPham();

        public DanhMucSanPhamBuilder SetTen(string ten)
        {
            _danhMuc.TenDanhMuc = ten;
            return this;
        }

        public DanhMucSanPhamBuilder SetMoTa(string moTa)
        {
            _danhMuc.MoTa = moTa;
            return this;
        }

        public DanhMucSanPhamBuilder SetID(int id)
        {
            _danhMuc.DanhMucSanPhamID = id;
            return this;
        }

        public DanhMucSanPham Build()
        {
            return _danhMuc;
        }
    }
}