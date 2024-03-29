--Lệnh Xóa Mạnh nếu db bị lỗi
USE master;
ALTER DATABASE HasakiDatabase SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
DROP DATABASE HasakiDatabase;

-- Tạo cơ sở dữ liệu
CREATE DATABASE HasakiDatabase;

USE HasakiDatabase;

CREATE TABLE DanhMucSanPham (
    DanhMucSanPhamID INT IDENTITY(1,1) PRIMARY KEY,
    TenDanhMuc NVARCHAR(255),
    MoTa NVARCHAR(MAX)
);

CREATE TABLE ThuongHieu (
    ThuongHieuID INT IDENTITY(1,1) PRIMARY KEY,
    TenThuongHieu NVARCHAR(255),
    MoTa NVARCHAR(MAX)
);

CREATE TABLE KhachHang (
    KhachHangID INT IDENTITY(1,1) PRIMARY KEY,
    TenKhachHang NVARCHAR(255),
    Email VARCHAR(255),
    SoDienThoai VARCHAR(20),
    TenDangNhap VARCHAR(50),
    MatKhau VARCHAR(255)
);

CREATE TABLE SanPham (
    SanPhamID INT IDENTITY(1,1) PRIMARY KEY,
    TenSanPham NVARCHAR(255),
    HinhAnh VARCHAR(255),
    MoTa NVARCHAR(MAX),
    Gia FLOAT,
    DungTich NVARCHAR(255),
    ThuongHieu NVARCHAR(255),
    XuatXu NVARCHAR(255),
    LoaiDaPhuHop NVARCHAR(255),
    DoPH FLOAT,
    CongDung NVARCHAR(MAX),
    ThanhPhanChinh NVARCHAR(MAX),
    CachSuDung NVARCHAR(MAX),
    LuuY NVARCHAR(MAX),
    ThuongHieuID INT,
    FOREIGN KEY (ThuongHieuID) REFERENCES ThuongHieu(ThuongHieuID)
);


CREATE TABLE SanPhamDanhMuc (
    SanPhamID INT,
    DanhMucSanPhamID INT,
    PRIMARY KEY (SanPhamID, DanhMucSanPhamID),
    FOREIGN KEY (SanPhamID) REFERENCES SanPham(SanPhamID),
    FOREIGN KEY (DanhMucSanPhamID) REFERENCES DanhMucSanPham(DanhMucSanPhamID)
);

CREATE TABLE DichVu (
    DichVuID INT IDENTITY(1,1) PRIMARY KEY,
    TenDichVu NVARCHAR(255),
    MoTa NVARCHAR(MAX),
    Gia FLOAT
);

CREATE TABLE PhieuQuaTang (
    PhieuQuaTangID INT IDENTITY(1,1) PRIMARY KEY,
    KhachHangID INT,
    MaGiamGia NVARCHAR(20)
);

CREATE TABLE DonHang (
    DonHangID INT PRIMARY KEY IDENTITY(1,1),
    KhachHangID INT,
    NgayDatHang DATE,
    TongTien FLOAT,
	ThanhToan NVARCHAR(50),
	GiaTien FLOAT,
	DaGiao NVARCHAR(100)
    FOREIGN KEY (KhachHangID) REFERENCES KhachHang(KhachHangID)
);

CREATE TABLE ChiTietDonHang (
    DonHangID INT,
    SanPhamID INT,
    SoLuong INT,
	DonGia FLOAT,
    FOREIGN KEY (DonHangID) REFERENCES DonHang(DonHangID),
    FOREIGN KEY (SanPhamID) REFERENCES SanPham(SanPhamID),
	PRIMARY KEY(DonHangID, SanPhamID)
);

CREATE TABLE NhanVien (
    NhanVienID INT IDENTITY(1,1) PRIMARY KEY,
    TenNhanVien NVARCHAR(255),
    VaiTro NVARCHAR(50),
    TenDangNhap VARCHAR(50),
    MatKhau VARCHAR(255)
);




-- Chèn dữ liệu vào bảng DanhMucSanPham
INSERT INTO DanhMucSanPham (TenDanhMuc, MoTa)
VALUES
(N'Chăm sóc da', N'Các sản phẩm chăm sóc da mặt và body chính hãng từ các thương hiệu uy tín trên thế giới'),
(N'Chăm sóc tóc', N'Các sản phẩm chăm sóc tóc chính hãng từ các thương hiệu uy tín trên thế giới'),
(N'Trang điểm', N'Các sản phẩm trang điểm chính hãng từ các thương hiệu uy tín trên thế giới'),
(N'Nước hoa', N'Các sản phẩm nước hoa chính hãng từ các thương hiệu uy tín trên thế giới'),
(N'Thực phẩm chức năng', N'Các sản phẩm thực phẩm chức năng chính hãng từ các thương hiệu uy tín trên thế giới');

-- Chèn dữ liệu vào bảng ThuongHieu
INSERT INTO ThuongHieu (TenThuongHieu, MoTa)
VALUES
(N'La Roche-Posay', N'La Roche-Posay là thương hiệu dược mỹ phẩm hàng đầu thế giới, chuyên về các sản phẩm chăm sóc da dành cho da nhạy cảm và da mụn.'),
(N'CeraVe', N'CeraVe là thương hiệu dược mỹ phẩm hàng đầu thế giới, chuyên về các sản phẩm chăm sóc da dành cho da khô và da nhạy cảm.'),
(N'Innisfree', N'Innisfree là thương hiệu mỹ phẩm thiên nhiên hàng đầu Hàn Quốc, chuyên về các sản phẩm chăm sóc da và trang điểm được chiết xuất từ các thành phần tự nhiên.'),
(N'Mamonde', N'Mamonde là thương hiệu mỹ phẩm thiên nhiên hàng đầu Hàn Quốc, chuyên về các sản phẩm chăm sóc da và trang điểm được chiết xuất từ các thành phần tự nhiên.'),
(N'Hada Labo', N'Hada Labo là thương hiệu mỹ phẩm Nhật Bản, chuyên về các sản phẩm chăm sóc da dành cho da khô và da nhạy cảm');

INSERT INTO SanPham (TenSanPham, HinhAnh, MoTa, Gia, DungTich, ThuongHieu, XuatXu, LoaiDaPhuHop, DoPH, CongDung, ThanhPhanChinh, CachSuDung, LuuY, ThuongHieuID)
VALUES
(N'Kem chống nắng Anessa Perfect UV Sunscreen Skincare Milk SPF50+ PA++++', 'https://media.hcdn.vn/catalog/product/p/r/promotions-auto-sua-chong-nang-anessa-duong-da-kiem-dau-bao-ve-hoan-hao-60ml_zTdSvgzbqDJS52AD_img_358x358_843626_fit_center.png', N'Kem chống nắng hóa học Anessa Perfect UV Sunscreen Skincare Milk SPF50+ PA++++ là sản phẩm chống nắng phổ rộng, bảo vệ da khỏi tác hại của tia UVA, UVB, tia hồng ngoại và ô nhiễm môi trường, đồng thời chống oxy hóa, ngăn ngừa lão hóa da và duy trì độ ẩm cho da.', 750000, '60ml', N'Anessa', N'Nhật Bản', N'Mọi loại da', 5.5, N'Chống nắng phổ rộng, bảo vệ da khỏi tác hại của tia UVA, UVB, tia hồng ngoại và ô nhiễm môi trường.', N'Tinosorb S, Uvinul A Plus, Titanium Dioxide', N'Lấy một lượng kem vừa đủ ra lòng bàn tay, thoa đều lên mặt và cổ trước khi ra ngoài 20 phút.', N'Bảo quản nơi khô ráo, thoáng mát, tránh ánh nắng trực tiếp.', 2),
(N'Kem chống nắng hóa học Klairs Midday UV Protection Cream SPF50+ PA++++', 'https://th.bing.com/th/id/OIP.50N1Xah48fu8LC4tEn6I5AHaHa?pid=ImgDet&rs=1', N'Kem chống nắng hóa học Klairs Midday UV Protection Cream SPF50+ PA++++ là sản phẩm chống nắng phổ rộng, bảo vệ da khỏi tác hại của tia UVA, UVB, tia hồng ngoại và ô nhiễm môi trường, đồng thời cung cấp độ ẩm, giúp da mềm mịn.', 650000, '50ml', N'Klairs', N'Hàn Quốc', N'Da khô, da nhạy cảm', 5.5, N'Chống nắng phổ rộng, bảo vệ da khỏi tác hại của tia UVA, UVB, tia hồng ngoại và ô nhiễm môi trường.', N'Tinosorb S, Uvinul A Plus, Titanium Dioxide', N'Lấy một lượng kem vừa đủ ra lòng bàn tay, thoa đều lên da mặt sau khi rửa mặt và toner.', N'Bảo quản nơi khô ráo, thoáng mát, tránh ánh nắng trực tiếp.', 3),
(N'Serum trị mụn Acnes Scar Care Serum', 'https://media.hcdn.vn/catalog/product/p/r/promotions-auto-tinh-chat-acnes-vitamin-c-lam-mo-seo-vet-tham-15ml_U2TEJ6Yf6k7Jcqo4_img_358x358_843626_fit_center.png', N'Serum trị mụn Acnes Scar Care Serum là sản phẩm giúp giảm mụn, giảm thâm mụn và kích thích tái tạo da, giúp da sáng mịn.', 350000, '30ml', N'Acnes', N'Việt Nam', N'Da mụn, da thâm mụn', 5.5, N'Giảm mụn, giảm thâm mụn và kích thích tái tạo da, giúp da sáng mịn.', N'Niacinamide, Tranexamic Acid', N'Lấy một lượng serum vừa đủ ra lòng bàn tay, thoa đều lên da mặt sau khi rửa mặt và toner.', N'Tránh tiếp xúc với mắt. Nếu sản phẩm dính vào mắt, hãy rửa sạch ngay với nước.', 4);

INSERT INTO SanPham (TenSanPham, HinhAnh, MoTa, Gia, DungTich, ThuongHieu, XuatXu, LoaiDaPhuHop, DoPH, CongDung, ThanhPhanChinh, CachSuDung, LuuY, ThuongHieuID)
VALUES
(N'Nước tẩy trang L''Oréal', 'https://file.hstatic.net/1000296801/file/nuoc-tay-trang-loreal_a00b410651c949e49471763875483a04_1024x1024.jpg', N'Nước tẩy trang L''Oréal là dòng sản phẩm tẩy trang dạng nước của thương hiệu L''Oreal Paris, có công nghệ Micellar dịu nhẹ, giúp làm sạch da và loại bỏ lớp trang điểm chỉ trong một bước.', 750000, '400ml', N'L''Oréal', N'Pháp', N'Mọi loại da', 5.5, N'Làm sạch da, loại bỏ lớp trang điểm.', N'Nước khoáng, chiết xuất hoa hồng, glycerin, hyaluronic acid', N'Nhẹ nhàng lau lên mặt, mắt và môi theo chuyển động tròn, không cần rửa lại với nước.', N'Sử dụng để tẩy trang nhanh khi bận rộn hoặc ở những nơi thiếu nước.', 2);


-- Chèn dữ liệu vào bảng SanPhamDanhMuc
INSERT INTO SanPhamDanhMuc (SanPhamID, DanhMucSanPhamID)
VALUES
(1, 1),
(2, 1),
(3, 2),
(1, 2),
(2, 3),
(3, 3),
(1, 4),
(3, 4),
(2, 5);

-- Chèn dữ liệu vào bảng DichVu
INSERT INTO DichVu (TenDichVu, MoTa, Gia)
VALUES
( N'Tẩy trang', N'Dịch vụ tẩy trang chuyên nghiệp giúp loại bỏ hoàn toàn bụi bẩn, dầu thừa và lớp trang điểm trên da, mang lại làn da sạch sẽ và thông thoáng.', 200000),
(N'Đắp mặt nạ', N'Dịch vụ đắp mặt nạ chuyên nghiệp giúp cung cấp dưỡng chất và phục hồi làn da, mang lại làn da tươi trẻ và rạng rỡ.', 300000),
(N'Massage mặt', N'Dịch vụ massage mặt chuyên nghiệp giúp thư giãn cơ mặt, giảm căng thẳng và cải thiện tuần hoàn máu, mang lại làn da tươi trẻ và rạng rỡ.', 400000);

-- Chèn dữ liệu vào bảng PhieuQuaTang
INSERT INTO PhieuQuaTang (KhachHangID, MaGiamGia)
VALUES
(1, 'HASAKI2023'),
(2, 'HASAKI2023'),
(3, 'HASAKI2023');

-- Chèn dữ liệu vào bảng KhachHang
INSERT INTO KhachHang (TenKhachHang, Email, SoDienThoai, TenDangNhap, MatKhau)
VALUES
(N'Nguyễn Văn A', 'nguyenvana@email.com', '1234567890', 'nguyenvana', '15E2B0D3C33891EBB0F1EF609EC419420C20E320CE94C65FBC8C3312448EB225'),
(N'Trần Thị B', 'tranthib@email.com', '0987654321', 'tranthib', '15E2B0D3C33891EBB0F1EF609EC419420C20E320CE94C65FBC8C3312448EB225'),
(N'Lê Văn C', 'levanc@email.com', '1111111111', 'levanc', '15E2B0D3C33891EBB0F1EF609EC419420C20E320CE94C65FBC8C3312448EB225');


-- Chèn dữ liệu vào bảng DonHang
INSERT INTO DonHang (KhachHangID, NgayDatHang, TongTien)
VALUES
(1, '2023-08-08', 1000000),
(2, '2023-08-09', 2000000),
(3, '2023-08-10', 3000000);

-- Chèn dữ liệu vào bảng ChiTietDonHang
INSERT INTO ChiTietDonHang (DonHangID, SanPhamID, SoLuong, DonGia)
VALUES
(1, 3, 2,675000),
(1, 2, 1,650000),
(2, 3, 3,300000),
(2, 2, 1,300000),
(3, 2, 1,200000),
(3, 3, 2,400000);

INSERT INTO NhanVien (TenNhanVien, VaiTro, TenDangNhap, MatKhau)
VALUES
('Nguyễn Văn A', 'Quản lý', 'nvana', '123456'),
('Trần Thị B', 'Nhân viên bán hàng', 'ttbb', '123456'),
('Lê Quang C', 'Nhân viên giao hàng', 'lqc', '123456');
