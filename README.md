# 🚀 WASM vs TypeScript Performance Demo

Demo so sánh hiệu năng giữa WebAssembly (WASM) và TypeScript với các tác vụ tính toán nặng.

## ✨ Tính năng

Demo này so sánh hiệu năng của các thuật toán được cài đặt bằng:
- **WebAssembly (Rust)** - Compiled code chạy gần như native speed
- **TypeScript/JavaScript** - Interpreted code chạy trên V8 engine

### 🧮 Các test được thực hiện:

1. **Fibonacci (n=40)** - Tính số Fibonacci thứ 40
2. **Prime Sieve (100,000)** - Tìm tất cả số nguyên tố đến 100,000
3. **Quick Sort (50,000 items)** - Sắp xếp mảng 50,000 số ngẫu nhiên
4. **Matrix Multiply (200x200)** - Nhân hai ma trận 200x200
5. **Image Blur (512x512)** - Làm mờ ảnh 512x512 pixels bằng 3x3 kernel

## 🏗️ Công nghệ sử dụng

- **Frontend**: Vue.js 3 với Composition API
- **WebAssembly**: Rust với wasm-pack
- **Build Tool**: Vite
- **Container**: Docker Compose

## 🚦 Cách chạy

### Phương pháp 1: Sử dụng Docker Compose (Khuyến nghị)

1. Clone repository:
```bash
git clone <repo-url>
cd demo-wasm
```

2. Chạy script build và start:
```bash
./start.sh
```

3. Mở browser tại: http://localhost:5173

### Phương pháp 2: Build thủ công

1. Build WASM module:
```bash
cd rust-wasm
cargo install wasm-pack
wasm-pack build --target web
cd ..
```

2. Install dependencies và start dev server:
```bash
npm install
npm run dev
```

## 📊 Kết quả mong đợi

Thông thường, WebAssembly sẽ nhanh hơn đáng kể trong các tác vụ:
- **Tính toán số học nặng** (Fibonacci, Matrix multiplication)
- **Xử lý mảng lớn** (Sorting, Prime sieve)
- **Xử lý hình ảnh** (Image blur)

Tỷ lệ cải thiện hiệu năng có thể từ **1.5x đến 10x** tùy thuộc vào:
- Độ phức tạp thuật toán
- Kích thước dữ liệu
- Kiểu tính toán (CPU-intensive vs memory-bound)

## 🏃‍♂️ Demo Commands

```bash
# Build và chạy với Docker Compose
./start.sh

# Hoặc build WASM riêng
docker-compose --profile build up rust-builder

# Chạy development server
docker-compose up app

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🌟 Tính năng Demo

- ⚡ **Real-time comparison** - So sánh hiệu năng trực tiếp
- 📈 **Interactive charts** - Biểu đồ trực quan kết quả
- 📊 **Detailed results** - Bảng kết quả chi tiết với thống kê
- 🎯 **Individual tests** - Chạy từng test riêng lẻ
- 🏁 **Batch testing** - Chạy tất cả test cùng lúc
- 📱 **Responsive design** - Giao diện responsive trên mọi thiết bị

## 🔧 Cấu trúc dự án

```
demo-wasm/
├── docker-compose.yml          # Docker Compose configuration
├── package.json               # NPM dependencies
├── vite.config.ts             # Vite configuration
├── src/
│   ├── App.vue               # Main Vue component
│   ├── main.ts              # Vue app entry point
│   ├── style.css            # Global styles
│   ├── benchmark.ts         # Performance measurement utilities
│   ├── ts-performance.ts    # TypeScript implementations
│   ├── wasm-performance.ts  # WASM wrapper
│   └── components/
│       ├── TestCard.vue     # Individual test component
│       ├── ResultsTable.vue # Results table component
│       └── PerformanceChart.vue # Performance chart component
└── rust-wasm/
    ├── Cargo.toml           # Rust dependencies
    ├── src/
    │   └── lib.rs          # Rust WASM implementations
    └── pkg/                # Generated WASM output (after build)
```

## 🧪 Kết quả thử nghiệm

Demo này sẽ giúp bạn hiểu:
- **Khi nào nên sử dụng WASM** - Các tác vụ CPU-intensive
- **Overhead của WASM** - Cost của việc gọi hàm qua boundary
- **JavaScript optimization** - V8 engine đã được tối ưu rất tốt
- **Real-world performance** - So sánh thực tế trong browser

## 🎯 Mục đích

Demo này được tạo để:
1. **Giáo dục** - Hiểu rõ sự khác biệt giữa WASM và JS
2. **Benchmark** - Đo lường hiệu năng thực tế
3. **Decision making** - Quyết định khi nào nên sử dụng WASM trong project
4. **Performance awareness** - Hiểu về tối ưu hiệu năng web

## 📝 Ghi chú

- WASM tỏa sáng với **compute-heavy tasks**
- JavaScript/TypeScript vẫn rất mạnh với **DOM manipulation** và **async operations**
- Overhead của WASM boundary calls có thể ảnh hưởng với **small operations**
- **Memory management** trong WASM cần được xem xét cẩn thận

Happy benchmarking! 🚀
