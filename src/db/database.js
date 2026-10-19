// src/db/database.js
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('recurring_bills.db');

// Khởi tạo bảng dữ liệu
export const initDB = () => {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS bills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      bill_name TEXT NOT NULL,
      category TEXT NOT NULL,
      amount REAL NOT NULL,
      status TEXT NOT NULL,
      due_date TEXT NOT NULL
    );
  `);
};

// Tự động khởi tạo bảng ngay khi nạp module db
initDB();


// Lấy toàn bộ hóa đơn
export const getAllBills = () => {
  return db.getAllSync('SELECT * FROM bills ORDER BY id DESC');
};

// Lấy các hóa đơn chưa thanh toán (Unpaid)
export const getUnpaidBills = () => {
  return db.getAllSync('SELECT * FROM bills WHERE status = ? ORDER BY id DESC', ['Unpaid']);
};

// Thêm hóa đơn mới
export const addBill = (bill_name, category, amount, status, due_date) => {
  return db.runSync(
    'INSERT INTO bills (bill_name, category, amount, status, due_date) VALUES (?, ?, ?, ?, ?)',
    [bill_name, category, parseFloat(amount), status, due_date]
  );
};

// Cập nhật hóa đơn
export const updateBill = (id, bill_name, category, amount, status, due_date) => {
  return db.runSync(
    'UPDATE bills SET bill_name = ?, category = ?, amount = ?, status = ?, due_date = ? WHERE id = ?',
    [bill_name, category, parseFloat(amount), status, due_date, id]
  );
};

// Xóa hóa đơn
export const deleteBill = (id) => {
  return db.runSync('DELETE FROM bills WHERE id = ?', [id]);
};

// Hàm tiện ích format tiền tệ VND (Ví dụ: 850000 -> 850.000 ₫)
export const formatVND = (amount) => {
  if (amount === undefined || amount === null) return '0 ₫';
  return Number(amount).toLocaleString('vi-VN') + ' ₫';
};