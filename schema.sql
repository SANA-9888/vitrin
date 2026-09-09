PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL DEFAULT 'محصول جدید',
  description TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'عمومی',
  price INTEGER NOT NULL DEFAULT 0 CHECK(price >= 0),
  stock INTEGER NOT NULL DEFAULT 0 CHECK(stock >= 0),
  specs TEXT NOT NULL DEFAULT '{}',
  photo TEXT,
  active INTEGER NOT NULL DEFAULT 0 CHECK(active IN (0, 1)),
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE INDEX IF NOT EXISTS idx_products_active_created
ON products(active, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_products_category
ON products(category);

CREATE TABLE IF NOT EXISTS posts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL DEFAULT 'نوشته جدید',
  body TEXT NOT NULL DEFAULT '',
  active INTEGER NOT NULL DEFAULT 0 CHECK(active IN (0, 1)),
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  client_key TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  shipping INTEGER NOT NULL DEFAULT 0,
  total INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'new'
    CHECK(status IN ('new', 'confirmed', 'sent', 'cancelled')),
  notified INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id TEXT NOT NULL REFERENCES orders(id),
  product_id TEXT NOT NULL REFERENCES products(id),
  title TEXT NOT NULL,
  unit_price INTEGER NOT NULL CHECK(unit_price >= 0),
  quantity INTEGER NOT NULL CHECK(quantity BETWEEN 1 AND 99)
);

CREATE INDEX IF NOT EXISTS idx_orders_created
ON orders(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_items_order
ON order_items(order_id);

CREATE TABLE IF NOT EXISTS sessions (
  admin_id TEXT PRIMARY KEY,
  payload TEXT NOT NULL,
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS telegram_updates (
  id INTEGER PRIMARY KEY,
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS rate_limits (
  key TEXT PRIMARY KEY,
  n INTEGER NOT NULL DEFAULT 1,
  expires INTEGER NOT NULL
);

-- جلوگیری از ثبت سفارش برای محصول غیرفعال، ناموجود
-- یا محصولی که قیمت آن هم‌زمان تغییر کرده است.
CREATE TRIGGER IF NOT EXISTS check_order_item
BEFORE INSERT ON order_items
BEGIN
  SELECT CASE WHEN NOT EXISTS (
    SELECT 1 FROM products
    WHERE id = NEW.product_id
      AND active = 1
      AND stock >= NEW.quantity
      AND price = NEW.unit_price
  )
  THEN RAISE(ABORT, 'ITEM_CHANGED')
  END;
END;

CREATE TRIGGER IF NOT EXISTS consume_stock
AFTER INSERT ON order_items
BEGIN
  UPDATE products
  SET stock = stock - NEW.quantity,
      updated_at = unixepoch()
  WHERE id = NEW.product_id;

  UPDATE orders
  SET total = total + NEW.unit_price * NEW.quantity
  WHERE id = NEW.order_id;
END;

CREATE TRIGGER IF NOT EXISTS restore_cancelled_stock
AFTER UPDATE OF status ON orders
WHEN NEW.status = 'cancelled' AND OLD.status != 'cancelled'
BEGIN
  UPDATE products
  SET stock = stock + (
    SELECT quantity FROM order_items
    WHERE order_id = NEW.id
      AND product_id = products.id
  ),
  updated_at = unixepoch()
  WHERE id IN (
    SELECT product_id FROM order_items WHERE order_id = NEW.id
  );
END;