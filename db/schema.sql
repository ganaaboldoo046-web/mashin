-- Products (상품) 테이블
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  price TEXT NOT NULL,
  priceKRW INTEGER,
  year TEXT,
  mileage TEXT,
  fuel TEXT,
  description TEXT,
  categoryId INTEGER,
  status TEXT DEFAULT 'active',
  images TEXT, -- 이미지 URL 배열 (JSON 문자열)
  options TEXT, -- 차량 옵션 ID 배열 (JSON 문자열)
  isFeatured BOOLEAN DEFAULT 0,
  engine TEXT,
  transmission TEXT,
  drive TEXT,
  color TEXT,
  interiorColor TEXT,
  doors TEXT,
  created_at INTEGER DEFAULT (strftime('%s', 'now'))
);

-- Categories (카테고리) 테이블
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  icon TEXT,
  image TEXT,
  count INTEGER DEFAULT 0,
  sort_order INTEGER DEFAULT 0
);

-- Banners (배너) 테이블
CREATE TABLE IF NOT EXISTS banners (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  subtitle TEXT,
  image TEXT,
  bg TEXT,
  active BOOLEAN DEFAULT 1
);

-- Users (사용자) 테이블
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT,
  phone TEXT,
  avatar TEXT,
  created_at INTEGER DEFAULT (strftime('%s', 'now'))
);

-- OAuth users (Google sign-in customers)
CREATE TABLE IF NOT EXISTS oauth_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  provider TEXT NOT NULL,
  provider_sub TEXT NOT NULL,
  email TEXT NOT NULL,
  name TEXT,
  avatar TEXT,
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  last_login_at INTEGER DEFAULT (strftime('%s', 'now')),
  UNIQUE(provider, provider_sub)
);

-- Reservations (예약) 테이블
CREATE TABLE IF NOT EXISTS reservations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL,
  product_name TEXT NOT NULL,
  user_id TEXT, -- 로그인한 사용자 ID (email 등)
  user_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  facebook_id TEXT,
  status TEXT DEFAULT 'pending', -- pending, confirmed, completed, cancelled
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  status_updated_at INTEGER,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Settings (설정 - 환율 등) 테이블
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at INTEGER DEFAULT (strftime('%s', 'now'))
);

INSERT OR IGNORE INTO settings (key, value) VALUES ('exchange_rate', '2.5');

-- Reviews (후기) 테이블
CREATE TABLE IF NOT EXISTS reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  car_model TEXT,
  comment TEXT NOT NULL,
  rating INTEGER DEFAULT 5,
  gender TEXT DEFAULT 'male',
  created_at INTEGER DEFAULT (strftime('%s', 'now'))
);
