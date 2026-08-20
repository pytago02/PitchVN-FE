
PITCHVN
Mạng xã hội & Đặt sân bóng đá số 1 Việt Nam
TÀI LIỆU ĐẶC TẢ HỆ THỐNG

Phiên bản: 1.0.0
Ngày lập: 09/05/2025
Công nghệ: Angular · Node.js · PostgreSQL
 
MỤC LỤC
MỤC LỤC	1
1. TỔNG QUAN DỰ ÁN	1
1.1 Giới thiệu	1
1.2 Mục tiêu	1
1.3 Phạm vi hệ thống	1
1.4 Công nghệ sử dụng	1
2. THIẾT KẾ GIAO DIỆN	1
2.1 Triết lý thiết kế	1
2.2 Hệ thống màu sắc	1
2.2.1 Theme Sáng (Light Theme — mặc định)	1
2.2.2 Theme Tối (Dark Theme)	1
2.2.3 Màu hạng (dùng cả hai theme)	1
2.3 Typography	1
2.4 Layout & Grid	1
Desktop (≥ 1024px) — 3 cột	1
Tablet (768px – 1023px) — 2 cột	1
Mobile (< 768px) — 1 cột	1
2.5 Component cơ bản	1
Button	1
PostCard — Đơn vị bài đăng	1
RankBadge	1
2.6 Màn hình chính	1
3. YÊU CẦU CHỨC NĂNG	1
3.1 Admin	1
3.1.1 Quản lý người dùng	1
3.1.2 Duyệt đăng ký sân	1
3.1.3 Thống kê hệ thống	1
3.1.4 Cấu hình hệ thống	1
3.1.5 Quản lý xếp hạng & giải đấu	1
3.1.6 Báo cáo & khiếu nại	1
3.2 Chủ sân	1
3.2.1 Quản lý thông tin sân	1
3.2.2 Quản lý lịch đặt sân	1
3.2.3 Tổ chức giải đấu	1
3.2.4 Quản lý Feed (Mạng xã hội)	1
3.2.5 Thống kê & Doanh thu	1
3.3 Cầu thủ	1
3.3.1 Đăng ký & Hồ sơ cá nhân	1
3.3.2 Chỉ số cá nhân & ELO	1
3.3.3 Tìm kiếm & Đặt sân	1
3.3.4 Tìm kèo cá nhân	1
3.3.5 Nhập & Xác nhận kết quả	1
3.3.6 Mạng xã hội cá nhân	1
3.3.7 Quản lý đội bóng	1
3.4 Đội bóng	1
3.4.1 Tạo đội bóng	1
3.4.2 Quản lý thành viên	1
3.4.3 Chỉ số & ELO đội	1
3.4.4 Tìm kèo & Thi đấu	1
3.4.5 Tham gia giải đấu	1
3.4.6 Hồ sơ & Feed đội	1
4. HỆ THỐNG & TÍNH NĂNG ĐẶC BIỆT	1
4.1 Feed Mạng xã hội — 2 Tab	1
4.1.1 Tab Đang theo dõi	1
4.1.2 Tab Khám phá	1
4.1.3 Các loại bài đăng	1
4.2 Hệ thống ELO & Xếp hạng	1
4.2.1 ELO kép — Đội và Cá nhân	1
4.2.2 Công thức ELO	1
4.2.3 Ngưỡng hạng	1
4.2.4 Bảng xếp hạng toàn quốc (kiểu FIFA)	1
4.3 Bản đồ tích hợp	1
4.4 AI Hỗ trợ tìm sân	1
4.5 Thanh toán trực tuyến	1
4.6 Thông báo đa kênh	1
5. LUỒNG HOẠT ĐỘNG	1
5.1 Luồng đặt sân	1
5.2 Luồng thi đấu & tính ELO	1
5.3 Luồng đăng ký & duyệt sân	1
5.4 Luồng tổ chức giải đấu	1
5.5 Luồng Feed — Đặt sân từ bài đăng	1
6. CƠ SỞ DỮ LIỆU	1
6.1 Tổng quan schema	1
6.2 Bảng quan trọng — Feed	1
posts	1
follows	1
6.3 Audit Log	1
6.4 Index quan trọng	1
7. AUDIT LOG & LƯU VẾT LỊCH SỬ	1
7.1 Các đối tượng được theo dõi	1
7.2 Quyền truy cập log	1
7.3 Lưu trữ & Xuất	1
8. KIẾN TRÚC KỸ THUẬT	1
8.1 Tổng quan kiến trúc	1
8.2 Cấu trúc thư mục Frontend (Angular)	1
8.3 Cấu trúc thư mục Backend (Node.js)	1
8.4 Realtime — Socket.io Rooms	1
8.5 Kế hoạch triển khai	1
9. PHỤ LỤC	1
9.1 Từ viết tắt	1
9.2 Phiên bản tài liệu	1

 
1. TỔNG QUAN DỰ ÁN
1.1 Giới thiệu
PitchVN là nền tảng mạng xã hội kết hợp đặt sân bóng đá trực tuyến, được thiết kế cho thị trường Việt Nam. Hệ thống kết nối ba nhóm người dùng chính: chủ sân bóng, cầu thủ cá nhân và đội bóng phong trào.
Ngoài chức năng đặt sân truyền thống, PitchVN xây dựng hệ sinh thái bóng đá cộng đồng đầy đủ: bảng tin mạng xã hội, hệ thống xếp hạng ELO, tổ chức giải đấu, tìm kèo đối thủ và bản đồ tìm sân theo khu vực.
1.2 Mục tiêu
•	Kết nối chủ sân và người chơi bóng đá trên toàn quốc
•	Xây dựng hệ thống xếp hạng đội bóng & cầu thủ minh bạch dựa trên ELO
•	Tạo mạng xã hội chuyên biệt cho cộng đồng bóng đá phong trào
•	Số hoá quy trình đặt sân, thanh toán và quản lý giải đấu
•	Tích hợp AI hỗ trợ tìm sân và đặt lịch tự động
1.3 Phạm vi hệ thống
Hệ thống gồm 5 nhóm người dùng chính và 1 module hệ thống:
Vai trò	Mô tả	Quyền truy cập
Admin	Quản trị viên hệ thống	Toàn quyền
Chủ sân	Người sở hữu & vận hành sân bóng	Quản lý sân, lịch, giải đấu, feed
Cầu thủ	Người chơi bóng đá cá nhân	Đặt sân, thi đấu, mạng xã hội
Đội bóng	Tập thể cầu thủ có tổ chức	Thi đấu đội, giải đấu, feed đội
Hệ thống	AI, ELO, bảng xếp hạng, thông báo	Tự động hoá
1.4 Công nghệ sử dụng
Tầng	Công nghệ	Mô tả
Frontend	Angular 17+ Standalone	SPA, lazy loading, NgRx state management
Backend (Node.js)	Node.js + Express + TypeScript	RESTful API + WebSocket (Socket.io)
Backend (.NET)	C# + ASP.NET Core 8	RESTful API, Microservices
Database	PostgreSQL 16	Relational DB, JSONB audit log, PostGIS bản đồ
Cache / Queue	Redis 7 + BullMQ	Session, realtime queue, ELO background job
File Storage	Cloudinary / MinIO	Ảnh, video bài đăng và hồ sơ
Bản đồ	Mapbox GL JS	Hiển thị sân, tìm kiếm bán kính
Thanh toán	VNPay + MoMo	Cổng thanh toán nội địa
AI	OpenAI API	Chatbot tìm sân ngôn ngữ tự nhiên
DevOps	Docker + GitHub Actions + Nginx	CI/CD, containerisation
 
2. THIẾT KẾ GIAO DIỆN
2.1 Triết lý thiết kế
PitchVN lấy cảm hứng từ sân cỏ xanh và bầu không khí bóng đá năng động. Giao diện được thiết kế theo hướng hiện đại, tối giản nhưng có chiều sâu — đặt trải nghiệm người dùng lên hàng đầu với layout rõ ràng, thông tin dễ đọc và màu sắc gắn liền với bóng đá.
2.2 Hệ thống màu sắc
2.2.1 Theme Sáng (Light Theme — mặc định)
Tên màu	Hex	Sử dụng
Brand Primary	#1D9E75	Nút chính, link, icon active, accent
Brand Dark	#0F6E56	Hover state, heading phụ
Brand Light	#E1F5EE	Background tint, badge nền, infobox
Neutral 900	#0D0D0D	Text tiêu đề chính
Neutral 700	#2C2C2C	Text body
Neutral 500	#555555	Text phụ
Neutral 400	#888888	Placeholder, caption
Neutral 200	#CCCCCC	Border, divider
Neutral 100	#F0F0F0	Background input, tag
Neutral 50	#F5F5F3	Background trang
White	#FFFFFF	Card, modal, navbar
2.2.2 Theme Tối (Dark Theme)
Tên màu	Hex	Sử dụng
Brand Primary	#22C38E	Nút chính, icon active (sáng hơn 10% để dễ thấy trên nền tối)
Brand Light	#0F3D2E	Background tint trong dark mode
Surface 900	#0A0A0A	Background trang
Surface 800	#111111	Background section
Surface 700	#1A1A1A	Card, modal, navbar
Surface 600	#242424	Input, sidebar
Border	#2E2E2E	Đường kẻ phân cách
Text Primary	#F0F0F0	Text tiêu đề
Text Secondary	#AAAAAA	Text body
Text Tertiary	#666666	Caption, placeholder
2.2.3 Màu hạng (dùng cả hai theme)
Hạng	Tên hạng	Mô tả	Điều kiện	Màu nhận diện
S	Siêu đỉnh	Cầu thủ chuyên nghiệp, thi đấu giải lớn	Top 5% ELO toàn hệ thống (≥ 2000 điểm)	Vàng óng
A	Chuyên nghiệp	Kỹ thuật tốt, hiểu chiến thuật cơ bản	Tỉ lệ thắng ≥ 65% (tối thiểu 20 trận)	Xanh lá
B	Khá	Kinh nghiệm, thi đấu thường xuyên	Tỉ lệ thắng 45% – 64%	Xanh dương
C	Trung bình	Chơi cuối tuần, kỹ năng ổn định	Tỉ lệ thắng 30% – 44%	Xanh lá đậm
D	Phong trào	Chơi giải trí, kỹ thuật cơ bản	Tỉ lệ thắng 15% – 29%	Cam đỏ
E	Nghiệp dư	Mới bắt đầu, đang học kỹ năng	Tỉ lệ thắng 5% – 14%	Hồng
F	Dưỡng sinh	Chơi vui, không quan tâm kết quả	< 5% hoặc mới tạo tài khoản	Xám
2.3 Typography
Font chính: Be Vietnam Pro (Google Fonts) — thiết kế đặc biệt cho tiếng Việt, hỗ trợ đầy đủ dấu và ký tự đặc biệt.
Cấp	Size	Weight	Line Height	Ứng dụng
Display 3xl	28px	700	36px	Tên trang bìa, Hero text
Display 2xl	22px	700	32px	Tiêu đề lớn, số liệu nổi bật
Heading xl	18px	600	28px	Tiêu đề section
Heading lg	16px	600	24px	Tiêu đề card, modal
Body md	14px	400	22px	Nội dung chính
Body base	13px	400	20px	Nội dung phụ, feed
Caption sm	12px	400	18px	Nhãn, meta info
Caption xs	11px	400	16px	Badge, tag nhỏ
2.4 Layout & Grid
Desktop (≥ 1024px) — 3 cột
•	Cột trái: 220px — Sidebar điều hướng & thông tin tài khoản
•	Cột giữa: flex 1, tối đa 680px — Nội dung chính
•	Cột phải: 220px — Widget, gợi ý, bảng xếp hạng nhanh
•	Gap giữa các cột: 20px
•	Max content width: 1200px, căn giữa trang
Tablet (768px – 1023px) — 2 cột
•	Ẩn panel phải
•	Sidebar trái thu gọn thành icon menu
Mobile (< 768px) — 1 cột
•	Ẩn hoàn toàn sidebar, thay bằng Bottom Tab Bar (56px)
•	Ẩn panel phải
•	Padding ngang: 12px
2.5 Component cơ bản
Button
Variant	Mô tả	Ứng dụng
Primary	Nền xanh #1D9E75, chữ trắng, bo 8px	Hành động chính: Đặt sân, Đăng ký, Đăng bài
Secondary	Nền #F0F0F0, chữ đen, bo 8px	Hành động phụ: Huỷ, Quay lại
Ghost	Trong suốt, viền 0.5px, bo 8px	Hành động ít quan trọng
Danger	Nền #D85A30, chữ trắng	Xoá, huỷ lịch có rủi ro
Icon	Vuông 32px, chỉ có icon	Toolbar, action trong card
PostCard — Đơn vị bài đăng
•	Nền trắng, viền 0.5px rgba(0,0,0,0.08), bo góc 12px, padding 16px
•	Header: Avatar (40px) + Tên tác giả + Badge loại bài + Thời gian + Menu ...
•	Body: Nội dung text, tối đa 3 dòng khi thu gọn, có nút 'Xem thêm'
•	Media: Ảnh/video, aspect ratio 16:9, bo 8px, tối đa 4 ảnh dạng lưới 2×2
•	Action bar: Thích | Bình luận | Đặt ngay / Đăng ký | Chia sẻ
RankBadge
•	Kích thước 24×24px, bo góc 6px
•	Màu nền = màu hạng tint 15%, chữ = màu hạng, font weight 700
2.6 Màn hình chính
Màn hình	URL	Mô tả ngắn
Feed / Bảng tin	/feed	Bảng tin 2 tab: Đang theo dõi + Khám phá
Tìm sân (Map)	/tim-san	Bản đồ tìm sân theo vị trí & khung giờ
Chi tiết sân	/san/:id	Thông tin sân, lịch trống, đánh giá, đặt lịch
Đặt lịch	/san/:id/dat-lich	Chọn sân con, ngày, giờ, thanh toán
Hồ sơ cầu thủ	/cau-thu/:id	Thông tin, ELO, lịch sử trận, thành tích
Hồ sơ đội bóng	/doi/:id	Thông tin đội, thành viên, lịch sử, feed đội
Bảng xếp hạng	/xep-hang	Bảng FIFA-style cho đội và cầu thủ
Tìm kèo	/tim-keo	Tìm đối thủ theo hạng, thời gian, khu vực
Giải đấu	/giai-dau	Danh sách & chi tiết giải đấu
Chat / Tin nhắn	/tin-nhan	Nhắn tin trực tiếp và nhóm
Admin Dashboard	/admin	Quản trị toàn bộ hệ thống
Trang chủ sân (Owner)	/quan-ly	Dashboard chủ sân
 
3. YÊU CẦU CHỨC NĂNG
3.1 Admin
Vai trò: Quản trị viên hệ thống — toàn quyền kiểm soát dữ liệu và người dùng.
Truy cập: /admin — yêu cầu xác thực 2 bước bắt buộc.
3.1.1 Quản lý người dùng
•	Xem danh sách toàn bộ tài khoản (chủ sân + cầu thủ), phân trang, tìm kiếm và lọc theo trạng thái, vai trò, ngày đăng ký
•	Khoá / mở tài khoản kèm lý do bắt buộc — tự động gửi email thông báo
•	Đặt lại mật khẩu tạm thời, yêu cầu đổi mật khẩu lần đăng nhập tiếp theo
•	Xem lịch sử hoạt động từng tài khoản: đăng nhập, đặt sân, bài đăng
•	Phân quyền quản trị phụ (moderator): chỉ xét duyệt nội dung, không chỉnh sửa cấu hình
•	Xác minh danh tính chủ sân: upload CMND/CCCD + giấy phép kinh doanh
3.1.2 Duyệt đăng ký sân
•	Xem danh sách hồ sơ sân chờ duyệt với đầy đủ thông tin và ảnh
•	Duyệt hoặc từ chối kèm lý do chi tiết — tự động gửi email thông báo cho chủ sân
•	Yêu cầu bổ sung giấy tờ, đặt trạng thái 'Cần bổ sung'
•	Gỡ sân vi phạm: ẩn khỏi hệ thống nhưng giữ dữ liệu
3.1.3 Thống kê hệ thống
•	Tổng số sân, cầu thủ, đội bóng đang hoạt động
•	Số lượt đặt lịch theo ngày/tuần/tháng/năm với biểu đồ trực quan
•	Tỉ lệ đặt thành công / huỷ / không đến (no-show)
•	Phân bố đội bóng và cầu thủ theo từng hạng S→F
•	Bản đồ nhiệt (heatmap) sân bóng theo quận/huyện
•	Xuất báo cáo PDF / Excel
3.1.4 Cấu hình hệ thống
•	Điều chỉnh ngưỡng điểm ELO cho từng hạng (S≥2000, A≥1700...)
•	Thay đổi tham số K trong công thức ELO (mặc định K=32)
•	Bật/tắt các tính năng: AI chatbot, tích hợp bản đồ, thanh toán online
•	Cấu hình thông báo: kênh gửi (push/email/SMS), ngưỡng nhắc lịch
•	Mọi thay đổi cấu hình tạo audit log với giá trị cũ và giá trị mới
3.1.5 Quản lý xếp hạng & giải đấu
•	Xem phân bố ELO toàn hệ thống, phát hiện điểm bất thường
•	Can thiệp thủ công hạng đội/cầu thủ khi cần (bắt buộc nhập lý do, tạo audit log)
•	Xem và can thiệp tất cả giải đấu đang diễn ra
•	Giải quyết tranh chấp kết quả trận: xem bằng chứng 2 bên, phán quyết
3.1.6 Báo cáo & khiếu nại
•	Tiếp nhận khiếu nại từ cầu thủ/chủ sân qua ticket system
•	Phân công moderator xử lý, theo dõi trạng thái (mở / đang xử lý / đã đóng)
•	Phản hồi qua hệ thống và email
3.2 Chủ sân
Vai trò: Người sở hữu và vận hành sân bóng.
Đăng ký: email / SĐT + xác thực OTP. Hồ sơ chờ duyệt từ Admin.
Truy cập: /quan-ly (dashboard riêng sau khi được duyệt).
3.2.1 Quản lý thông tin sân
•	Thông tin cơ bản: Tên sân, mô tả, SĐT, email, Facebook, địa chỉ đầy đủ
•	Vị trí: gắn pin bản đồ (kéo thả hoặc nhập toạ độ), tự động cập nhật địa chỉ
•	Cơ sở vật chất: số lượng sân con, loại mặt sân (cỏ nhân tạo / tự nhiên / futsal), sức chứa
•	Giờ mở cửa theo từng ngày trong tuần, khung giờ đặc biệt (lễ, tết)
•	Bảng giá: theo sân con × khung giờ × loại ngày (thường / cuối tuần / lễ)
•	Hình ảnh: tối đa 20 ảnh, 1 ảnh bìa, 1 ảnh logo — nén tự động
•	Mọi thay đổi tạo lịch sử: trường nào, giá trị cũ, giá trị mới, ai sửa, lúc nào
3.2.2 Quản lý lịch đặt sân
•	Xem lịch tổng thể theo ngày/tuần dạng bảng (timeline view) cho tất cả sân con
•	Xác nhận đặt lịch (nếu yêu cầu xác nhận thủ công) hoặc bật chế độ tự động xác nhận
•	Huỷ lịch: bắt buộc nhập lý do, tự động hoàn tiền nếu khách đã thanh toán online
•	Đặt lịch hộ cho khách: ghi rõ tên người đặt hộ trong log
•	Đánh dấu khung giờ bảo trì: không nhận đặt, hiển thị 'Đang bảo trì' trên lịch
•	Lịch sử đặt: lọc theo sân con, trạng thái, khoảng thời gian, xuất Excel
•	Mọi thay đổi trạng thái đặt lịch ghi audit log kèm lý do
3.2.3 Tổ chức giải đấu
•	Tạo giải: tên, mô tả, thể thức (vòng bảng / loại trực tiếp / kết hợp)
•	Cấu hình: số đội tham dự (tối đa), yêu cầu hạng tối thiểu, phí đăng ký, giải thưởng
•	Thời gian: ngày bắt đầu, ngày kết thúc, hạn đăng ký
•	Chia bảng: tự động (random hoặc theo hạng) hoặc thủ công kéo thả
•	Tạo lịch thi đấu: gán trận vào sân con và khung giờ cụ thể
•	Nhập kết quả: tỉ số, ghi nhận bàn thắng của ai, kiến tạo, thẻ vàng/đỏ
•	Bảng xếp hạng vòng bảng tự động cập nhật sau mỗi trận
•	Bracket vòng loại trực tiếp tự động điền kết quả
•	Thay đổi kết quả sau khi nhập: bắt buộc lý do + tạo audit log riêng
3.2.4 Quản lý Feed (Mạng xã hội)
•	Tạo bài đăng: Lịch trống | Khuyến mãi | Sự kiện | Tin tức | Hình ảnh/Video
•	Bài Lịch trống: chọn sân con + khung giờ từ lịch, người xem đặt ngay từ bài
•	Bài Sự kiện: liên kết với giải đấu đã tạo, hiển thị thông tin giải inline
•	Đính kèm tối đa 10 ảnh hoặc 1 video, nén tự động
•	Chỉnh sửa bài: lưu nội dung cũ vào lịch sử, hiển thị 'Đã chỉnh sửa' kèm thời gian
•	Xoá bài: soft delete, lưu lại bản ghi xoá (admin vẫn xem được)
•	Thống kê bài đăng: lượt xem, thích, bình luận, lượt đặt từ bài
3.2.5 Thống kê & Doanh thu
•	Doanh thu theo ngày/tuần/tháng, lọc theo sân con
•	Biểu đồ lượt đặt theo khung giờ (peak hours analysis)
•	Tỉ lệ lấp đầy theo sân con, phát hiện sân ế
•	Lịch sử từng giao dịch, xuất PDF/Excel
3.3 Cầu thủ
Vai trò: Người chơi bóng đá cá nhân — đơn vị cơ bản của hệ thống.
Một cầu thủ có thể tham gia nhiều đội, thi đấu cá nhân, đặt sân và hoạt động mạng xã hội.
ELO cá nhân độc lập với ELO đội.
3.3.1 Đăng ký & Hồ sơ cá nhân
•	Đăng ký: email / SĐT + OTP, hoặc Google / Facebook OAuth
•	Thông tin hồ sơ: tên thật, nickname, ảnh đại diện, ảnh bìa, ngày sinh, mô tả
•	Vị trí thi đấu: thủ môn / hậu vệ / tiền vệ / tiền đạo / linh hoạt
•	Chân thuận: trái / phải / hai chân
•	Chế độ hồ sơ: công khai / chỉ người theo dõi / riêng tư
•	Liên kết mạng xã hội: Facebook, Zalo, Instagram
•	Mọi thay đổi thông tin hồ sơ lưu lịch sử
3.3.2 Chỉ số cá nhân & ELO
•	Điểm ELO cá nhân (khởi đầu 1000, tính riêng sau mỗi trận)
•	Hạng cá nhân (S→F) tự động cập nhật theo ELO
•	Hạng tự khai báo khi tạo tài khoản — dùng để ghép kèo ban đầu
•	Thống kê tổng: trận, thắng/hoà/thua, bàn thắng, kiến tạo, thẻ vàng/đỏ
•	Biểu đồ ELO theo thời gian, biểu đồ phong độ 10 trận gần nhất
•	Huy hiệu thành tích: Chuỗi thắng 5/10/20, Ghi 50/100 bàn, Lên hạng A, MVP liên tiếp...
3.3.3 Tìm kiếm & Đặt sân
•	Tìm sân theo: tên, quận/huyện, loại mặt sân, hình thức (5v5/7v7/11v11)
•	Lọc sân trống theo khung giờ cụ thể (ngày + giờ bắt đầu + thời lượng)
•	Lọc theo bán kính khoảng cách từ vị trí hiện tại (1km đến 20km)
•	Xem chi tiết sân: hình ảnh, bản đồ, đánh giá, bảng giá, lịch trống realtime
•	Đặt lịch: chọn sân con → ngày → khung giờ → phương thức thanh toán → xác nhận
•	Thanh toán: VNPay / MoMo / Chuyển khoản / Tiền mặt tại sân
•	Nhận xác nhận qua app notification + email
•	Xem lịch sử đặt sân cá nhân, lọc theo trạng thái
•	Đánh giá sân sau khi hoàn thành lịch đặt (rating 1–5 sao + bình luận)
3.3.4 Tìm kèo cá nhân
•	Đăng kèo tìm đối: thời gian, địa điểm ưa thích, hình thức, hạng mong muốn của đối thủ
•	Tìm kèo có sẵn với bộ lọc: hạng, thời gian, khu vực, hình thức
•	Gửi lời thách đấu đến đội / cầu thủ khác
•	Nhắn tin nhanh với đối phương trong giao diện tìm kèo
•	Xác nhận kèo → trận đấu được tạo tự động, chờ kết quả sau khi đá
•	Kèo tự hết hạn sau 48h nếu không có phản hồi
3.3.5 Nhập & Xác nhận kết quả
•	Sau trận: cầu thủ (hoặc đội trưởng) nhập tỉ số + thống kê cá nhân của từng người
•	Đối phương nhận thông báo, xem và xác nhận / từ chối kết quả
•	Nếu 2 bên đồng thuận: kết quả được chốt, hệ thống tính ELO tự động
•	Nếu mâu thuẫn: ticket tranh chấp được tạo, admin phán quyết trong 48h
•	Mọi lần chỉnh sửa kết quả sau khi xác nhận phải kèm lý do + audit log
3.3.6 Mạng xã hội cá nhân
•	Đăng bài lên feed cá nhân: chia sẻ kết quả, tìm kèo, tuyển thành viên đội
•	Theo dõi (follow) cầu thủ khác, đội bóng, sân bóng
•	Thích và bình luận bài đăng, reply bình luận (thread 1 cấp)
•	Nhắn tin trực tiếp (DM) với cầu thủ khác hoặc chủ sân
•	Lưu bài (bookmark) để xem lại
•	Chia sẻ bài ra ngoài (copy link)
3.3.7 Quản lý đội bóng
•	Xem danh sách các đội đang tham gia
•	Nhận / từ chối lời mời vào đội
•	Rời đội (không thể rời nếu là đội trưởng duy nhất — phải chuyển quyền trước)
•	Nếu là đội trưởng: có thêm quyền quản lý đội (xem mục 3.4)
•	Lịch sử tham gia/rời đội được lưu đầy đủ
3.4 Đội bóng
Đội bóng là thực thể tập thể, do cầu thủ tạo ra và làm đội trưởng.
ELO đội tính riêng độc lập với ELO cá nhân từng cầu thủ.
Mỗi cầu thủ có thể tham gia nhiều đội cùng lúc.
3.4.1 Tạo đội bóng
•	Thông tin khởi tạo: tên đội, logo (upload ảnh), màu áo chính/phụ, mô tả
•	Sân nhà: liên kết với sân bóng trong hệ thống (tuỳ chọn)
•	Hạng tự khai báo (S→F): dùng để ghép kèo trước khi đủ 10 trận thực tế
•	Mạng xã hội đội: Facebook, Zalo group
•	Mọi thay đổi thông tin đội lưu lịch sử
3.4.2 Quản lý thành viên
•	Đội trưởng mời cầu thủ qua username / SĐT, cầu thủ nhận lời mời và phản hồi
•	Mỗi thành viên có: số áo, vị trí ưa thích, vai trò (đội trưởng / phó / thành viên)
•	Đội trưởng chuyển quyền, phong phó đội trưởng, đưa thành viên ra khỏi đội
•	Giới hạn: tối đa 25 thành viên / đội
•	Lịch sử thay đổi thành viên (thêm, xoá, đổi vai trò) lưu đầy đủ, không thể xoá
3.4.3 Chỉ số & ELO đội
•	ELO đội: khởi đầu 1000, tính theo kết quả trận đấu toàn đội
•	Hạng đội thực tế tự động cập nhật sau mỗi trận
•	Thống kê: tổng trận, thắng/hoà/thua, bàn thắng/bàn thua, hiệu số, chuỗi kết quả
•	Bảng thống kê nội bộ: ai ghi nhiều bàn nhất, kiến tạo nhiều nhất trong màu áo đội
•	Biểu đồ ELO đội theo thời gian
3.4.4 Tìm kèo & Thi đấu
•	Đội trưởng / phó đăng kèo: thời gian, khu vực, hình thức, hạng đối thủ mong muốn
•	Tìm kèo có sẵn với bộ lọc chi tiết
•	Chỉ đội trưởng hoặc phó đội trưởng mới có quyền xác nhận kèo
•	Sau khi xác nhận: trận đấu được tạo, tất cả thành viên nhận thông báo
•	Đội trưởng / phó nhập kết quả trận: tỉ số + đóng góp từng cầu thủ
•	Đội đối phương xác nhận → ELO cả 2 đội và ELO cá nhân cập nhật đồng thời
3.4.5 Tham gia giải đấu
•	Đội trưởng đăng ký đội, kiểm tra điều kiện hạng tối thiểu tự động
•	Thanh toán phí đăng ký (nếu có) qua các cổng thanh toán tích hợp
•	Toàn bộ thành viên nhận thông báo lịch thi đấu, kết quả, thăng/xuống bảng
•	Xem lịch sử các giải đấu đã tham gia, kết quả và thứ hạng đạt được
3.4.6 Hồ sơ & Feed đội
•	Trang hồ sơ đội: logo, thành tích, thành viên, lịch sử trận gần đây, bài đăng
•	Người dùng khác có thể theo dõi đội để nhận tin tức
•	Đội trưởng / phó đăng bài: tuyển thành viên, tìm kèo, kết quả, highlight video
•	Bài đăng đội hiển thị trên feed của người đang theo dõi đội
•	Lịch sử chỉnh sửa bài được lưu lại
 
4. HỆ THỐNG & TÍNH NĂNG ĐẶC BIỆT
4.1 Feed Mạng xã hội — 2 Tab
PitchVN xây dựng mạng xã hội chuyên biệt cho cộng đồng bóng đá.
Feed chia 2 tab: 'Đang theo dõi' (cá nhân hoá) và 'Khám phá' (thuật toán reach_score).
4.1.1 Tab Đang theo dõi
•	Hiển thị bài từ: sân bóng, đội bóng, cầu thủ mà người dùng đã follow
•	Sắp xếp: thời gian mới nhất (chronological)
•	Người mới chưa follow ai: hiện gợi ý follow dựa trên vị trí và sở thích
4.1.2 Tab Khám phá
•	Hiển thị bài từ toàn bộ hệ thống, sắp xếp theo reach_score
•	Công thức reach_score = like×3 + comment×5 + share×4 + view×0.1 + bonus_location + bonus_type
•	Bonus location: +20% nếu bài cùng quận/huyện với người dùng
•	Bonus type: +30% nếu loại bài khớp với preferred_types của người dùng
•	Background job cập nhật reach_score mỗi 15 phút
•	Bộ lọc bổ sung: Tất cả / Lịch trống / Tìm kèo / Giải đấu / Khuyến mãi / Tin tức
•	Lọc theo khu vực: quận/huyện hoặc bán kính km từ vị trí
•	Người chưa đăng nhập: xem tab Khám phá ở chế độ đọc, không tương tác
4.1.3 Các loại bài đăng
Loại bài	Ai đăng được	Tính năng đặc biệt
Lịch trống (available_slot)	Chủ sân	Slot picker inline, đặt ngay từ bài không cần vào trang sân
Khuyến mãi (promotion)	Chủ sân	Badge 'Khuyến mãi', hiển thị thời hạn đếm ngược
Sự kiện (event)	Chủ sân	Liên kết giải đấu, thông tin giải inline, nút đăng ký
Tìm kèo (challenge)	Cầu thủ, Đội	Hiển thị hạng, hình thức, khu vực, nút thách đấu ngay
Kết quả (result)	Cầu thủ, Đội	Tỉ số nổi bật, ELO thay đổi, ảnh sau trận
Tin tức (general)	Tất cả	Bài viết thông thường, hỗ trợ text + ảnh + video
4.2 Hệ thống ELO & Xếp hạng
4.2.1 ELO kép — Đội và Cá nhân
ELO cá nhân và ELO đội được tính song song, hoàn toàn độc lập nhau. Sau mỗi trận được xác nhận hai chiều, BullMQ queue xử lý job tính ELO.
•	ELO đội: tính theo kết quả tổng thể trận (thắng/hoà/thua, hạng đối thủ)
•	ELO cá nhân: tính theo đóng góp trong trận (phút thi đấu, bàn thắng, kiến tạo, thẻ)
•	Trận giữa 2 đội có hạng chênh lệch lớn: K-factor tự động điều chỉnh
•	Trận không xếp hạng (is_ranked=false): không tính ELO
4.2.2 Công thức ELO
Expected = 1 / (1 + 10^((ELO_đối_thủ - ELO_mình) / 400))
ELO_mới = ELO_cũ + K × (Kết_quả - Expected)
Kết quả: 1 = thắng, 0.5 = hoà, 0 = thua
K mặc định = 32 (có thể điều chỉnh trong cấu hình Admin)
4.2.3 Ngưỡng hạng
Hạng	Ngưỡng ELO tối thiểu	Tên đầy đủ	Màu
S	≥ 2000	Siêu đỉnh	#EF9F27 Vàng
A	≥ 1700	Chuyên nghiệp	#1D9E75 Xanh lá
B	≥ 1450	Khá	#378ADD Xanh dương
C	≥ 1200	Trung bình	#639922 Xanh lá đậm
D	≥ 1000	Phong trào	#D85A30 Cam đỏ
E	≥ 800	Nghiệp dư	#D4537E Hồng
F	< 800	Dưỡng sinh	#888780 Xám
4.2.4 Bảng xếp hạng toàn quốc (kiểu FIFA)
•	2 bảng riêng: Bảng đội bóng và Bảng cầu thủ cá nhân
•	Cột: Hạng | Tên | Số trận | Thắng | Hoà | Thua | Bàn thắng | Bàn thua | Hiệu số | Điểm ELO
•	Lọc: theo hạng (S/A/B...), khu vực (tỉnh/thành), khoảng thời gian
•	Snapshot bảng xếp hạng lưu mỗi tuần (thứ Hai 00:00) để xem lại lịch sử
•	Mỗi đội/cầu thủ có biểu đồ thứ hạng theo tuần
4.3 Bản đồ tích hợp
•	Tích hợp Mapbox GL JS — hiển thị vị trí sân bóng trên bản đồ
•	Marker sân: màu xanh (còn chỗ) / xám (hết chỗ trong khung giờ đang chọn)
•	Lọc sân trên bản đồ: bán kính khoảng cách, khung giờ trống, loại sân
•	Popup chi tiết khi bấm vào marker: tên sân, giá, đánh giá, nút đặt ngay
•	Chỉ đường từ vị trí người dùng đến sân (tích hợp Mapbox Directions)
•	PostGIS lưu toạ độ sân — truy vấn bán kính chính xác bằng ll_to_earth()
4.4 AI Hỗ trợ tìm sân
•	Chatbot giao diện nổi (floating button) — nhận yêu cầu ngôn ngữ tự nhiên
•	Ví dụ: "Tìm sân 7 người gần tôi tối thứ Sáu, giá dưới 300k"
•	AI phân tích ý định: loại sân, thời gian, vị trí, ngân sách → gọi API tìm sân
•	Trả về danh sách sân phù hợp kèm so sánh nhanh
•	Hỗ trợ đặt lịch ngay trong giao diện chat
•	Ghi log mỗi phiên: câu hỏi, gợi ý, kết quả (đặt / chỉ xem / bỏ qua)
4.5 Thanh toán trực tuyến
•	Tích hợp: VNPay, MoMo, Chuyển khoản ngân hàng, Tiền mặt tại sân
•	Quy trình: chọn phương thức → redirect cổng thanh toán → callback → cập nhật trạng thái
•	Hoàn tiền tự động khi chủ sân huỷ lịch (trong 24h làm việc)
•	Lịch sử giao dịch đầy đủ, không thể xoá, xuất được hoá đơn PDF
•	Webhook từ cổng thanh toán — retry tự động nếu thất bại
4.6 Thông báo đa kênh
Sự kiện	Push	Email	SMS
Xác nhận đặt sân	✓	✓	✓
Nhắc lịch trước 2 giờ	✓	✓	✓
Chủ sân huỷ lịch	✓	✓	✓
Kết quả trận xác nhận	✓	✓	
Thăng / giáng hạng	✓	✓	
Lời mời vào đội	✓	✓	
Lời thách đấu mới	✓	✓	
Kèo được ghép thành công	✓	✓	
Bài đăng của sân follow	✓		
Bình luận bài của mình	✓		
Tin nhắn mới	✓		
Lịch đấu giải đấu	✓	✓	
Hồ sơ sân được duyệt	✓	✓	✓
 
5. LUỒNG HOẠT ĐỘNG
5.1 Luồng đặt sân
1.	Cầu thủ tìm sân: nhập khu vực / dùng bản đồ / nhờ AI chatbot
2.	Chọn sân → xem chi tiết, lịch trống, đánh giá, giá
3.	Chọn sân con → chọn ngày → chọn khung giờ (kiểm tra realtime còn chỗ)
4.	Xem tóm tắt đặt lịch: sân, thời gian, giá, phương thức thanh toán
5.	Chọn thanh toán: Online (VNPay/MoMo/Chuyển khoản) hoặc Tiền mặt tại sân
6.	Nếu online → redirect cổng thanh toán → callback → cập nhật trạng thái
7.	Booking được tạo với trạng thái 'pending' (nếu chủ sân xác nhận thủ công) hoặc 'confirmed' (tự động)
8.	Cả hai bên nhận thông báo xác nhận (push + email + SMS)
9.	Nhắc lịch tự động trước 2 giờ
10.	Sau khi hoàn thành: cầu thủ đánh giá sân (rating + bình luận)
5.2 Luồng thi đấu & tính ELO
11.	Đội A tạo kèo tìm đối, đăng lên feed hoặc tìm kèo có sẵn
12.	Đội B thấy kèo, gửi lời thách đấu hoặc đội A mời trực tiếp
13.	Hai bên xác nhận kèo → trận đấu được tạo (status: scheduled)
14.	(Tuỳ chọn) Liên kết với booking sân — khung giờ được đặt tự động
15.	Sau trận: đội trưởng Đội A nhập kết quả + thống kê từng cầu thủ
16.	Đội B nhận thông báo, xem kết quả → Xác nhận hoặc Từ chối
17.	Nếu đồng thuận: status → confirmed, BullMQ job tính ELO
18.	Job tính ELO đội A & B, ELO cá nhân từng cầu thủ tham gia
19.	Cập nhật hạng nếu vượt ngưỡng, ghi match_elo_logs, gửi thông báo
20.	Nếu từ chối: tạo dispute ticket, admin giải quyết trong 48h
5.3 Luồng đăng ký & duyệt sân
21.	Chủ sân đăng ký tài khoản loại 'field_owner', xác thực OTP
22.	Điền thông tin sân: tên, địa chỉ, loại sân, hình ảnh, giờ mở cửa, bảng giá
23.	Upload giấy tờ xác minh: CMND/CCCD + giấy phép kinh doanh
24.	Nộp hồ sơ → trạng thái 'pending', admin nhận thông báo
25.	Admin xem xét: Duyệt / Từ chối / Yêu cầu bổ sung
26.	Nếu duyệt: sân chuyển sang 'active', chủ sân nhận email + có thể đăng bài feed
27.	Nếu từ chối: chủ sân nhận email với lý do, có thể chỉnh sửa và nộp lại
5.4 Luồng tổ chức giải đấu
28.	Chủ sân tạo giải: điền thông tin, thể thức, điều kiện hạng, phí, thời gian
29.	Đăng bài 'Sự kiện' trên Feed để quảng bá — bài tự động liên kết với giải đấu
30.	Đội bóng xem bài đăng / trang giải đấu → đăng ký + thanh toán phí
31.	Khi đủ đội hoặc hết hạn đăng ký: chủ sân chia bảng (tự động hoặc thủ công)
32.	Tạo lịch thi đấu: gán trận vào sân con + khung giờ cụ thể
33.	Các đội nhận thông báo lịch, có thể xem bracket toàn giải
34.	Chủ sân nhập kết quả từng trận → bảng xếp hạng vòng bảng tự động cập nhật
35.	Sau vòng bảng: bracket loại trực tiếp tự động tạo từ kết quả
36.	Kết thúc giải: công bố kết quả, trao thưởng, cập nhật ELO tất cả đội tham gia
5.5 Luồng Feed — Đặt sân từ bài đăng
37.	Cầu thủ đang xem Feed, thấy bài 'Lịch trống' của sân
38.	Bài hiển thị slot picker inline với các khung giờ: xanh (trống) / xám (đã đặt)
39.	Cầu thủ bấm chọn khung giờ muốn đặt ngay trên bài
40.	Bấm nút 'Đặt ngay' → mở modal xác nhận (không rời khỏi Feed)
41.	Modal hiện: tên sân, sân con, ngày, giờ, giá, chọn thanh toán
42.	Xác nhận → thanh toán → booking được tạo → thông báo 2 bên
43.	Trạng thái slot trên bài đăng cập nhật realtime (Socket.io)
 
6. CƠ SỞ DỮ LIỆU
6.1 Tổng quan schema
PostgreSQL 16, ORM: Prisma. Tổng cộng 45 bảng chia thành 9 nhóm chức năng.
Nhóm	Số bảng	Bảng chính
Auth & Users	4	users, user_profiles, refresh_tokens, otp_codes
Cầu thủ	3	players, player_elo_logs, player_achievements
Sân bóng	6	fields, field_subs, field_prices, field_hours, field_images, field_reviews
Đặt lịch	2	bookings, booking_status_logs
Đội bóng	5	teams, team_members, team_invitations, team_elo_logs, ranking_snapshots
Trận đấu	4	matches, match_player_stats, match_result_logs, match_challenges
Giải đấu	4	tournaments, tournament_teams, tournament_matches, tournament_standings
Feed & Mạng xã hội	11	posts, post_media, post_slots, post_likes, post_comments, follows, post_interactions, user_feed_preferences, post_bookmarks, post_edit_history, comment_edit_history
Chat & Thông báo	4	conversations, conversation_members, messages, notifications
Thanh toán	1	transactions
Audit Log	1	audit_logs
TỔNG	45	
6.2 Bảng quan trọng — Feed
posts
Cột	Kiểu	Mô tả
id	UUID PK	
author_id	UUID	ID cầu thủ / đội / sân — đa hình
author_type	ENUM	player | team | field
post_type	ENUM	general | available_slot | promotion | event | challenge | result | media
content	TEXT	Nội dung bài đăng
reach_score	FLOAT	Điểm thuật toán Khám phá — cập nhật mỗi 15 phút
city/district	VARCHAR	Vị trí địa lý để lọc Feed Khám phá
lat/lng	DECIMAL	Toạ độ để tính bonus_location
view_count	INTEGER	Số lượt xem
like_count	INTEGER	Denormalized để tránh COUNT() mỗi query
comment_count	INTEGER	Denormalized
deleted_at	TIMESTAMPTZ	Soft delete — không xoá thật
follows
Bảng đa hình — một người dùng theo dõi nhiều loại đối tượng:
Cột	Kiểu	Ví dụ
follower_id	UUID	ID người dùng đang follow
following_id	UUID	ID đối tượng được follow (player/team/field)
following_type	VARCHAR	'player' | 'team' | 'field'
6.3 Audit Log
Bảng audit_logs dùng BIGSERIAL (không phải UUID) để tối ưu tốc độ ghi. Mọi INSERT không có UPDATE hay DELETE — bất biến tuyệt đối. Partition theo tháng để tránh bảng quá lớn sau khi scale.
Cột	Kiểu	Mô tả
id	BIGSERIAL PK	Auto-increment
actor_id	UUID	Người thực hiện (NULL nếu là system job)
actor_role	ENUM	admin | field_owner | player | system
action	VARCHAR(60)	CREATE | UPDATE | DELETE | LOGIN | APPROVE | CANCEL | OVERRIDE_RANK...
entity_type	VARCHAR(60)	user | field | booking | match | post | config...
entity_id	UUID	ID bản ghi bị tác động
old_data	JSONB	Dữ liệu trước thay đổi
new_data	JSONB	Dữ liệu sau thay đổi
reason	TEXT	Lý do (bắt buộc với một số action)
ip_address	INET	Địa chỉ IP người thực hiện
user_agent	TEXT	Trình duyệt / thiết bị
created_at	TIMESTAMPTZ	Thời điểm chính xác UTC
6.4 Index quan trọng
Bảng	Index	Lý do
posts	idx_posts_reach (reach_score DESC, created_at DESC) WHERE deleted_at IS NULL	Tab Khám phá
posts	idx_posts_author (author_id, author_type)	Lấy bài của 1 tác giả
posts	idx_posts_location (city, district) WHERE deleted_at IS NULL	Lọc theo khu vực
follows	idx_follows_follower (follower_id)	Tab Đang theo dõi
bookings	idx_bookings_field_sub_date (field_sub_id, date)	Kiểm tra lịch trống
fields	GIST index (ll_to_earth(lat, lng))	Tìm sân theo bán kính
audit_logs	idx_audit_entity (entity_type, entity_id)	Xem log của 1 bản ghi
 
7. AUDIT LOG & LƯU VẾT LỊCH SỬ
Module Audit Log hoạt động ngầm xuyên suốt hệ thống.
Mọi hành động tạo/sửa/xoá dữ liệu quan trọng đều sinh bản ghi bất biến.
Không ai (kể cả super admin) có thể xoá hoặc sửa log.
7.1 Các đối tượng được theo dõi
Đối tượng	Action được ghi	Ai ghi
Tài khoản (users)	Tạo, đổi thông tin, đổi mật khẩu, khoá/mở, phân quyền	Hệ thống, Admin
Thông tin sân (fields)	Tạo, sửa từng trường, duyệt, từ chối, gỡ	Chủ sân, Admin
Đặt lịch (bookings)	Tạo, xác nhận, huỷ (kèm lý do), dời lịch, đặt hộ	Cầu thủ, Chủ sân
Đội bóng (teams)	Tạo, sửa thông tin, thêm/xoá/đổi vai trò thành viên	Đội trưởng, Admin
Kết quả trận (matches)	Nhập lần đầu, mọi lần chỉnh sửa sau (kèm lý do bắt buộc)	Cầu thủ, Admin
ELO & Hạng	Thay đổi điểm sau trận, thăng/giáng hạng, can thiệp thủ công	Hệ thống, Admin
Giải đấu (tournaments)	Tạo, sửa thể thức, thay đổi kết quả trong giải	Chủ sân, Admin
Bài đăng (posts)	Tạo, sửa nội dung (lưu nội dung cũ), xoá (lưu bản ghi)	Tác giả, Admin
Cấu hình hệ thống	Mọi thay đổi tham số ELO, ngưỡng hạng, cài đặt	Admin
Giao dịch (transactions)	Tạo, thành công, thất bại, hoàn tiền	Hệ thống, Admin
7.2 Quyền truy cập log
Vai trò	Phạm vi xem log	Lọc được
Admin	Toàn bộ hệ thống	Người dùng, loại action, thời gian, entity
Chủ sân	Log liên quan sân của mình: thông tin sân, lịch đặt, bài đăng, giải đấu	Loại action, khoảng thời gian
Cầu thủ	Log cá nhân: đặt sân, hồ sơ, ELO, hạng	Loại action
Đội trưởng	Log cá nhân + log đội: thành viên, kết quả, ELO đội	Loại action, khoảng thời gian
7.3 Lưu trữ & Xuất
•	Log lưu tối thiểu 3 năm, partition theo tháng (pg_partman)
•	Admin xuất log dạng CSV hoặc JSON cho mục đích kiểm toán hoặc xử lý tranh chấp
•	Hoàn tác một hành động: tạo bản ghi log mới ghi nhận hành động hoàn tác — không xoá bản ghi cũ
 
8. KIẾN TRÚC KỸ THUẬT
8.1 Tổng quan kiến trúc
PitchVN sử dụng kiến trúc Parent Repository kết hợp Git Submodules (Multi-repo) với các service độc lập.
Tầng	Công nghệ	Vai trò
Web Client	Angular 17+ Standalone + NgRx	SPA, lazy loading route
API Server (Node.js)	Node.js + Express + TypeScript	REST API + WebSocket
API Server (.NET)	C# + ASP.NET Core 8	REST API, Microservices
Database	PostgreSQL 16 + Prisma ORM	Lưu trữ chính
Cache	Redis 7	Session, rate limit, pub/sub realtime
Job Queue	BullMQ (Redis)	ELO calc, email, push notification
File Storage	Cloudinary / MinIO	Ảnh, video
Realtime	Socket.io	Feed, chat, lịch trống, kết quả live
Map	Mapbox GL JS + PostGIS	Hiển thị sân, tìm bán kính
8.2 Cấu trúc thư mục Frontend (Angular)
pitch-vn_fe/src/app/
├── core/          — Auth guards, JWT interceptor, HTTP services
├── shared/        — Components dùng chung, pipes, directives
├── features/      — Lazy-loaded feature modules
│   ├── feed/      — Bảng tin 2 tab
│   ├── field/     — Trang sân, đặt lịch
│   ├── team/      — Hồ sơ đội bóng
│   ├── player/    — Hồ sơ cầu thủ
│   ├── ranking/   — Bảng xếp hạng
│   ├── match/     — Tìm kèo, kết quả
│   ├── tournament/— Giải đấu
│   ├── chat/      — Nhắn tin
│   ├── map/       — Bản đồ tìm sân
│   ├── notification/— Thông báo
│   ├── audit-log/ — Lịch sử thay đổi
│   └── admin/     — Dashboard quản trị
└── layout/        — Navbar, Sidebar, Footer, BottomTabBar
8.3 Cấu trúc thư mục Backend (Node.js)
pitch-vn_be/src/
├── modules/
│   ├── auth/         — JWT, OAuth, OTP
│   ├── users/        — Tài khoản người dùng
│   ├── players/      — Hồ sơ cầu thủ, ELO cá nhân
│   ├── fields/       — Sân bóng, sân con, giá
│   ├── bookings/     — Đặt lịch
│   ├── teams/        — Đội bóng, thành viên
│   ├── matches/      — Trận đấu, kèo, ELO
│   ├── tournaments/  — Giải đấu
│   ├── feed/         — Bài đăng, Feed algorithm
│   ├── notifications/— Push, email, SMS
│   ├── chat/         — Realtime messaging
│   ├── payments/     — VNPay, MoMo webhook
│   ├── map/          — Tích hợp Mapbox, PostGIS query
│   ├── ai/           — Chatbot tìm sân (OpenAI)
│   └── audit-log/    — Ghi và truy vấn audit log
└── common/
    ├── middleware/    — Auth, rate-limit
    ├── decorators/    — @AuditLog(), @Roles()
    └── filters/       — Global error handler
8.4 Realtime — Socket.io Rooms
Room	Sự kiện	Người nhận
user:{userId}	notification:new, booking:confirmed, elo:updated	Cá nhân
field:{fieldId}	slot:booked, slot:cancelled (cập nhật lịch trống)	Người xem trang sân
feed:global	post:new, post:updated	Tất cả
conversation:{id}	message:new, message:read	Thành viên cuộc trò chuyện
tournament:{id}	match:result, standing:updated	Đội đăng ký giải
ranking:weekly	snapshot:new	Tất cả
8.5 Kế hoạch triển khai
Giai đoạn	Thời gian	Nội dung
1 — Nền tảng	Tháng 1–2	Auth, quản lý sân, đặt lịch, bản đồ, audit log cơ bản
2 — Mạng xã hội	Tháng 3–4	Feed 2 tab, follow, like/comment, chat realtime, thông báo
3 — Thi đấu	Tháng 5–6	Đội bóng, tìm kèo, kết quả, ELO, bảng xếp hạng
4 — Giải đấu & TT	Tháng 7–8	Tổ chức giải đấu, VNPay/MoMo, thống kê nâng cao
5 — AI & Hoàn thiện	Tháng 9–10	AI chatbot, dashboard admin nâng cao, tối ưu hiệu năng, security audit
 
9. PHỤ LỤC
9.1 Từ viết tắt
Từ viết tắt	Ý nghĩa
ELO	Hệ thống xếp hạng do Arpad Elo phát triển — đánh giá kỹ năng tương đối
SPA	Single Page Application — ứng dụng web một trang
OTP	One Time Password — mật khẩu dùng một lần
JWT	JSON Web Token — chuẩn xác thực token
DM	Direct Message — tin nhắn trực tiếp
VNPay	Cổng thanh toán điện tử Việt Nam
MoMo	Ví điện tử MoMo
PostGIS	Extension PostgreSQL cho dữ liệu địa lý
CDN	Content Delivery Network — mạng phân phối nội dung
CCCD	Căn cước công dân
9.2 Phiên bản tài liệu
Phiên bản	Ngày	Thay đổi
1.0.0	09/05/2025	Phiên bản đầu tiên — toàn bộ yêu cầu hệ thống PitchVN

© 2025 PitchVN — Tài liệu nội bộ
