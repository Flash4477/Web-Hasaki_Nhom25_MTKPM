using Hasaki.Models;

namespace Hasaki.Data
{
    internal class SanPhamFactory : ISanPhamFactory
    {
        public SanPham CreateSanPham()
        {
            return new SanPham();
        }
    }
}