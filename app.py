from flask import Flask, render_template, request, jsonify, redirect, url_for, send_from_directory
import sqlite3
import os

app = Flask(__name__, template_folder=".", static_folder=".")
@app.route('/<path:filename>')
def serve_root_file(filename):
    return send_from_directory(os.getcwd(), filename)
DB_NAME = "sheker.db"


def get_db_connection():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    return conn


@app.route("/")
def index():
    conn = get_db_connection()
    cakes = conn.execute("SELECT * FROM cakes").fetchall()
    conn.close()
    return render_template("index.html", cakes=cakes)


@app.route("/fillings")
def fillings():
    conn = get_db_connection()
    fillings = conn.execute("SELECT * FROM fillings").fetchall()
    conn.close()
    cake_code = request.args.get("cake", "bento")
    return render_template("projectNA3.html", fillings=fillings, cake_code=cake_code)


@app.route("/api/fillings")
def api_fillings():
    conn = get_db_connection()
    fillings = conn.execute("SELECT * FROM fillings").fetchall()
    conn.close()
    return jsonify([dict(row) for row in fillings])


@app.route("/api/orders", methods=["POST"])
def create_order():
    data = request.get_json()

    customer_name = data.get("customer_name")
    phone = data.get("phone")
    cake_code = data.get("cake_code")
    size_cm = data.get("size_cm")
    candles_postcard = 1 if data.get("candles_postcard") else 0
    custom_design = 1 if data.get("custom_design") else 0
    comment = data.get("comment", "")
    total_price = data.get("total_price", 0)
    items = data.get("items", [])

    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("""
        INSERT INTO orders (
            customer_name,
            phone,
            cake_code,
            size_cm,
            candles_postcard,
            custom_design,
            comment,
            total_price
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        customer_name,
        phone,
        cake_code,
        size_cm,
        candles_postcard,
        custom_design,
        comment,
        total_price
    ))

    order_id = cur.lastrowid

    for item in items:
        cur.execute("""
            INSERT INTO order_items (order_id, filling_code, qty, price)
            VALUES (?, ?, ?, ?)
        """, (
            order_id,
            item["filling_code"],
            item["qty"],
            item["price"]
        ))

    conn.commit()
    conn.close()

    return jsonify({"success": True, "order_id": order_id})

@app.route("/finance")
def finance():
    conn = get_db_connection()

    income_row = conn.execute("""
        SELECT COALESCE(SUM(total_price), 0) AS total_income
        FROM orders
    """).fetchone()

    expense_row = conn.execute("""
        SELECT COALESCE(SUM(amount), 0) AS total_expense
        FROM expenses
    """).fetchone()

    expenses = conn.execute("""
        SELECT * FROM expenses
        ORDER BY created_at DESC
    """).fetchall()

    orders = conn.execute("""
        SELECT * FROM orders
        ORDER BY created_at DESC
    """).fetchall()

    conn.close()

    total_income = income_row["total_income"]
    total_expense = expense_row["total_expense"]
    profit = total_income - total_expense

    return render_template(
        "finance.html",
        total_income=total_income,
        total_expense=total_expense,
        profit=profit,
        expenses=expenses,
        orders=orders
    )
if __name__ == "__main__":
    app.run(debug=True)