from flask import Flask, render_template, request, jsonify, session, redirect
import pyodbc

app = Flask(__name__)
app.secret_key = "mysecretkey"


def get_connection():
    return pyodbc.connect(
        "Driver={SQL Server};"
        "Server=Z14-55N\\SQLEXPRESS;"
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

@app.route('/submit', methods=['POST'])
def submit():
    return redirect('/order')


@app.route('/details')
def details():
    return render_template('details.html')


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
        "SELECT id, FirstName, LastName FROM Users WHERE Username=? AND Password=?",
        (data['username'], data['password'])
    )

    user = cursor.fetchone()

    if user:
        session['user_id'] = user[0]   # ✅ id
        session['firstname'] = user[1]
        session['lastname'] = user[2]

        cursor.close()
        conn.close()
        return jsonify({"status": "success"})
    else:
        cursor.close()
        conn.close()
        return jsonify({"status": "fail"})

@app.route('/logout')
def logout():
    session.clear()   # 🔥 இதை மட்டும் use பண்ணு
    return {"message": "Logged out"}   # JSON return பண்ணு


@app.route('/user')
def get_user():
    return jsonify({
        "firstname": session.get('firstname'),
        "lastname": session.get('lastname')
    })

@app.route("/mybookings")
def my_bookings_page():
    if "user_id" not in session:
        return redirect("/login")
    return render_template("mybookings.html")

@app.route("/profile")
def profile():
    if "user_id" not in session:
        return "Please login first"
    return render_template("profile.html")
    


# -------------------- DROPDOWN APIs --------------------
@app.route('/get_all_data')
def get_all_data():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT DISTINCT vehicle_type, brand, model, fuel 
        FROM vehicless
    """)

    data = {}

    for vehicle, brand, model, fuel in cursor.fetchall():

        if vehicle not in data:
            data[vehicle] = {}

        if brand not in data[vehicle]:
            data[vehicle][brand] = {}

        if model not in data[vehicle][brand]:
            data[vehicle][brand][model] = []

        # duplicate avoid
        if fuel not in data[vehicle][brand][model]:
            data[vehicle][brand][model].append(fuel)

    return jsonify(data)



@app.route("/get_services/<brand>")
def get_services(brand):
    conn = get_connection()
    cursor = conn.cursor()

    query = "SELECT id, service_name, price, image FROM services WHERE brand = ?"
    cursor.execute(query, (brand,))
    rows = cursor.fetchall()

    conn.close()

    data = []
    for row in rows:
        data.append({
            "id": row[0],
            "name": row[1],
            "price": row[2],
            "image": row[3]
        })

    return jsonify(data)


# 👉 API (service + inclusions)
@app.route("/get_service_details/<int:id>")
def get_service_details(id):

    conn = get_connection()
    cursor = conn.cursor()

    # service
    cursor.execute("""
        SELECT service_name, price, image 
        FROM services 
        WHERE id = ?
    """, (id,))
    service = cursor.fetchone()

    # inclusions
    cursor.execute("""
        SELECT inclusion_text 
        FROM service_inclusions 
        WHERE service_id = ?
    """, (id,))
    inclusions = cursor.fetchall()

    conn.close()

    if not service:
        return jsonify({})

    return jsonify({
        "name": service[0],
        "price": service[1],
        "image": "static/images/"+ service[2],
        "inclusions": [row[0] for row in inclusions]
    })

@app.route("/book_service", methods=["POST"])
def book_service():
    try:
        if "user_id" not in session:
            return jsonify({"message": "Please login first"}), 402

        data = request.get_json()

        brand = data.get("brand")
        model = data.get("model")
        service_id = data.get("service_id")

        if not service_id:
            return jsonify({"message": "Invalid service id"})

        service_id = int(service_id)
        user_id = session.get("user_id")

        conn = get_connection()
        cursor = conn.cursor()

        # user
        cursor.execute("SELECT FirstName, LastName FROM Users WHERE id=?", (user_id,))
        user = cursor.fetchone()

        if not user:
            return jsonify({"message": "User not found"})

        # service
        cursor.execute(
            "SELECT service_name, price FROM services WHERE id=?",
            (service_id,)
        )
        service = cursor.fetchone()

        if not service:
            return jsonify({"message": "Service not found"})

        service_name = service[0]
        price = service[1]

        # 🔥 Already booked check
        cursor.execute("""
            SELECT * FROM bookings
            WHERE user_id=? AND brand=? AND model=? AND service=?
        """, (user_id, brand, model, service_name))

        existing = cursor.fetchone()

        if existing:
            return jsonify({"message": "Already Booked"})

        # insert
        cursor.execute("""
            INSERT INTO bookings 
            (user_id, firstname, lastname, brand, model, service, price)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (user_id, user[0], user[1], brand, model, service_name, price))

        conn.commit()

        cursor.close()
        conn.close()

        return jsonify({"message": "Booking Successful"})

    except Exception as e:
        print("ERROR:", e)
        return jsonify({"message": "Server Error"})




@app.route("/get_my_bookings")
def get_my_bookings():

    print("SESSION:", session)
    print("USER ID:", session.get("user_id"))
    if "user_id" not in session:
        return jsonify([])

    user_id = session.get("user_id")

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT brand, model, service, price, created_at
        FROM bookings
        WHERE user_id=?
        ORDER BY created_at DESC
    """, (user_id,))

    rows = cursor.fetchall()

    result = []
    for row in rows:
        result.append({
            "brand": row[0],
            "model": row[1],
            "service": row[2],
            "price": row[3],
            "date": str(row[4])
        })
        

    return jsonify(result)


@app.route("/update_user", methods=["POST"])
def update_user():

    # 🔐 login check
    if "user_id" not in session:
        return jsonify({"message": "Please login first"}), 401

    conn = get_connection()
    cursor = conn.cursor()

    data = request.get_json()

    firstname = data.get("firstname")
    lastname = data.get("lastname")
    mobno = data.get("mobno")
    username = data.get("username")
    password = data.get("password")

    user_id = session["user_id"]

    # 🔍 username already exist check (other user)
    cursor.execute(
        "SELECT * FROM Users WHERE Username=? AND id != ?",
        (username, user_id)
    )
    if cursor.fetchone():
        return jsonify({"message": "Username already exists"})

    # ✅ update query
    cursor.execute("""
        UPDATE Users
        SET FirstName=?, LastName=?, Phone=?, Username=?, Password=?
        WHERE id=?
    """, (
        firstname,
        lastname,
        mobno,
        username,
        password,
        user_id
    ))

    conn.commit()
    cursor.close()
    conn.close()

    # 🔄 session update (important)
    session["firstname"] = firstname
    session["lastname"] = lastname

    return jsonify({"message": "Profile Updated Successfully"})

if __name__ == '__main__':
    app.run(debug=True)