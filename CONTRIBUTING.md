# Đóng góp

Cảm ơn bạn đã muốn cải thiện NguyenNgocAnhTu. Hãy mở issue trước nếu thay đổi
có ảnh hưởng đến hành vi định tuyến hoặc cần thảo luận về tương thích ứng dụng.

## Quy trình

1. Tạo một nhánh riêng cho thay đổi.
2. Chỉ sửa module, rule hoặc script liên quan; không đưa thông tin cá nhân hay
   khóa bí mật vào repository.
3. Chạy các kiểm tra trước khi tạo pull request:

   ```sh
   python3 scripts/validate.py
   node scripts/test_spotify.js
   ```

4. Mô tả rõ ứng dụng, endpoint và phiên bản proxy đã được kiểm tra.

Các module phải giữ đồng bộ phiên bản. URL script bên thứ ba cần trỏ tới commit
SHA cố định; script mới nên có xử lý an toàn khi response không phải JSON hợp lệ.

## Pull request

Pull request nên có phạm vi nhỏ, giải thích lý do thay đổi và nêu kết quả kiểm
tra. Không gửi dữ liệu người dùng, token, log chứa thông tin nhận dạng hoặc bản
quyền ứng dụng.

