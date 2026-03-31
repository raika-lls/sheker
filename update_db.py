import sqlite3

conn = sqlite3.connect("sheker.db")
cur = conn.cursor()

try:
    cur.execute("ALTER TABLE orders ADD COLUMN total_price INTEGER DEFAULT 0")
    print("Поле total_price добавлено")
except Exception as e:
    print("Может поле уже есть:", e)

conn.commit()
conn.close()