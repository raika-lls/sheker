import sqlite3

conn = sqlite3.connect("sheker.db")
cur = conn.cursor()

cur.execute("""
CREATE TABLE IF NOT EXISTS cakes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    image TEXT,
    description TEXT
)
""")

cur.execute("""
CREATE TABLE IF NOT EXISTS fillings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    price INTEGER NOT NULL,
    image TEXT,
    description TEXT
)
""")

cur.execute("""
CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    cake_code TEXT NOT NULL,
    size_cm INTEGER NOT NULL,
    candles_postcard INTEGER DEFAULT 0,
    custom_design INTEGER DEFAULT 0,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
""")

cur.execute("""
CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    filling_code TEXT NOT NULL,
    qty INTEGER NOT NULL DEFAULT 1,
    price INTEGER NOT NULL,
    FOREIGN KEY(order_id) REFERENCES orders(id)
)
""")

cur.execute("DELETE FROM cakes")
cur.execute("DELETE FROM fillings")

cakes_data = [
    ("lambet", "Торт «Ламбет»", "images/lambet.jpg", "Нежный ламбет-декор"),
    ("bento", "Бенто торт", "images/benn.jpg", "Классический бенто"),
    ("lamben", "Бенто + Ламбет", "images/lamben.jpg", "Бенто в стиле ламбет"),
    ("cupcake", "Капкейки", "images/cape.jpg", "Набор капкейков"),
]

fillings_data = [
    ("oreo", "Бенто-орео", 8900, "images/oreo.jpeg", "Орео"),
    ("cherry", "Бенто-вишня-кокос", 9900, "images/cherry.jpeg", "Вишня и кокос"),
    ("carrot", "Бенто-морковь", 8900, "images/carrot.jpeg", "Морковный"),
    ("sakura", "Бенто-сакура", 8900, "images/sakura.jpeg", "Сакура"),
    ("honey", "Бенто-медовик", 8900, "images/honey.jpeg", "Медовик"),
    ("strawberry", "Бенто-клубника с молоком", 8900, "images/strawberry.jpeg", "Клубника"),
    ("banoffee", "Бенто-баноффи", 9900, "images/banoffee.jpeg", "Баноффи"),
    ("genn", "Бенто-ген пати", 8900, "images/genn.jpeg", "Ген пати")
]
cur.execute("""
CREATE TABLE IF NOT EXISTS expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    amount INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
""")

cur.execute("DELETE FROM expenses")

expenses_data = [
    ("Ингредиенты", 15000),
    ("Коробки", 5000),
    ("Ленты и декор", 3000)
]

cur.executemany(
    "INSERT INTO expenses (name, amount) VALUES (?, ?)",
    expenses_data
)

cur.executemany("INSERT INTO cakes (code, name, image, description) VALUES (?, ?, ?, ?)", cakes_data)
cur.executemany("INSERT INTO fillings (code, name, price, image, description) VALUES (?, ?, ?, ?, ?)", fillings_data)

conn.commit()
conn.close()

print("База создана и заполнена.")