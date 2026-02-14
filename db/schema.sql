-- Products (상품) 테이블
CREATE TABLE products (
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
  isFeatured BOOLEAN DEFAULT 0,
  created_at INTEGER DEFAULT (strftime('%s', 'now'))
);

-- Categories (카테고리) 테이블
CREATE TABLE categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  icon TEXT,
  image TEXT,
  count INTEGER DEFAULT 0
);

-- Banners (배너) 테이블
CREATE TABLE banners (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  subtitle TEXT,
  image TEXT,
  bg TEXT,
  active BOOLEAN DEFAULT 1
);

-- Users (사용자) 테이블
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT,
  phone TEXT,
  avatar TEXT,
  created_at INTEGER DEFAULT (strftime('%s', 'now'))
);
