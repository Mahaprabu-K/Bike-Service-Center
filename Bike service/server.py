from flask import Flask, render_template, request, jsonify, session, redirect
import pyodbc

app = Flask(__name__)
app.secret_key = "mysecretkey"


def get_connection():
    return pyodbc.connect(
        "Driver={SQL Server};"
        "Server=KISHORE\\SQLEXPRESS;"
        "Database=Bikeservicedb;"
        "MARS_Connection=Yes;"
    )


@app.route('/')
def index():
    return render_template("index.html",
                           firstname=session.get('firstname'),
                           lastname=session.get('lastname'))


@app.route('/signup')
def signup():
    return render_template("signup.html")


@app.route('/signin')
def signin():
    return render_template("signin.html")


@app.route('/order')
def order():
    return render_template("order.html")


# -------------------- AUTH --------------------

@app.route('/register', methods=['POST'])
def register():
    conn = get_connection()
    cursor = conn.cursor()

    data = request.get_json()

    cursor.execute("""
        INSERT INTO Users 
        (FirstName, LastName, Phone, Whatsapp, Email, Gender, Username, Password)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        data['firstname'],
        data['lastname'],
        data['phone'],
        data['whatsapp'],
        data['email'],
        data['gender'],
        data['username'],
        data['password']
    ))

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"message": "Registered Successful"})


@app.route('/login', methods=['POST'])
def login():
    conn = get_connection()
    cursor = conn.cursor()

    data = request.get_json()

    cursor.execute(
        "SELECT FirstName, LastName FROM Users WHERE Username=? AND Password=?",
        (data['username'], data['password'])
    )

    user = cursor.fetchone()

    if user:
        session['firstname'] = user[0]
        session['lastname'] = user[1]

        cursor.close()
        conn.close()
        return jsonify({"status": "success"})
    else:
        cursor.close()
        conn.close()
        return jsonify({"status": "fail"})


@app.route('/logout')
def logout():
    session.pop('firstname', None)
    session.pop('lastname', None)
    return redirect('/')


@app.route('/user')
def get_user():
    return jsonify({
        "firstname": session.get('firstname'),
        "lastname": session.get('lastname')
    })


# -------------------- DROPDOWN APIs --------------------

@app.route('/get_vehicle')
def get_vehicle():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT DISTINCT vehicle_type FROM vehicless")
    data = [row[0] for row in cursor.fetchall()]

    cursor.close()
    conn.close()

    return jsonify(data)


@app.route('/get_brand/<vehicle>')
def get_brand(vehicle):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT DISTINCT brand FROM vehicless WHERE vehicle_type = ?",
        (vehicle,)
    )

    data = [row[0] for row in cursor.fetchall()]

    cursor.close()
    conn.close()

    return jsonify(data)


@app.route('/get_model/<vehicle>/<brand>')
def get_model(vehicle, brand):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT DISTINCT model FROM vehicless WHERE vehicle_type = ? AND brand = ?",
        (vehicle, brand)
    )

    data = [row[0] for row in cursor.fetchall()]

    cursor.close()
    conn.close()

    return jsonify(data)


@app.route('/get_fuel/<vehicle>/<brand>/<model>')
def get_fuel(vehicle, brand, model):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT DISTINCT fuel FROM vehicless WHERE vehicle_type = ? AND brand = ? AND model = ?",
        (vehicle, brand, model)
    )

    data = [row[0] for row in cursor.fetchall()]

    cursor.close()
    conn.close()

    return jsonify(data)


@app.route('/get_selected')
def get_selected():
    conn = get_connection()
    cursor = conn.cursor()

    brand = request.args.get('brand')
    model = request.args.get('model')
    fuel = request.args.get('fuel')

    cursor.execute("""
        SELECT brand, model, fuel 
        FROM vehicless
        WHERE brand=? AND model=? AND fuel=?
    """, (brand, model, fuel))

    row = cursor.fetchone()

    cursor.close()
    conn.close()

    if row:
        return jsonify({
            "brand": row[0],
            "model": row[1],
            "fuel": row[2]
        })
    else:
        return jsonify({"error": "No data found"}), 404



if __name__ == '__main__':
    app.run(debug=True)