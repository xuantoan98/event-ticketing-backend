export interface EmailOptions {
  to: string;
  subject: string;
  template?: string;                  // tên template nếu muốn
  context?: { [key: string]: any };   // dữ liệu render lên template
  text?: string;                      // nội dung email dạng text (nếu không dùng teplate)
  html?: string;                      // nội dung email dạng html (nếu không dùng teplate)
}
