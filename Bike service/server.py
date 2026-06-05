from flask import Flask, render_template, request, jsonify, session, redirect
import pyodbc

app = Flask(__name__)
app.secret_key = "mysecretkey"


def get_connection():
    return pyodbc.connect(
        "Driver={SQL Server};"
        "Server=Z14-55M\\SQLEXPRESS;"
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

@app.route('/order2')
def order2():
    return render_template("order2.html")

@app.route('/submit', methods=['POST'])
def submit():
    return redirect('/order')


@app.route('/details')
def details():
    return render_template('details.html')

@app.route('/details2')
def details2():
    return render_template('details2.html')


# -------------------- AUTH --------------------

@app.route('/register', methods=['POST'])
def register():
    conn = get_connection()
    cursor = conn.cursor()

    data = request.get_json()

    # 🔹 முதலில் check பண்ணு
    cursor.execute("SELECT * FROM Users WHERE Username = ?", (data['username'],))
    existing = cursor.fetchone()

    if existing:
        cursor.close()
        conn.close()
        return jsonify({"message": "Already registered"})

    # 🔹 இல்லனா insert பண்ணு
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
        """
        SELECT id, FirstName, LastName, Phone
        FROM Users
        WHERE Username=? AND Password=?
        """,
        (data['username'], data['password'])
    )

    user = cursor.fetchone()

    if user:

        session['user_id'] = user[0]
        session['firstname'] = user[1]
        session['lastname'] = user[2]

        cursor.close()
        conn.close()

        return jsonify({
            "status": "success",
            "firstname": user[1],
            "lastname": user[2],
            "mobile": user[3]
        })

    else:

        cursor.close()
        conn.close()

        return jsonify({
            "status": "fail"
        })

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

        data = request.get_json()

        print("BOOK DATA:", data)

        service_id = data.get("service_id")
        service_name = data.get("service_name")
        price = data.get("price")

        brand = data.get("brand")
        model = data.get("model")
        fuel = data.get("fuel")

        firstname = data.get("firstname")
        lastname = data.get("lastname")
        mobno = data.get("mobno")

        bikenumber = data.get("bikenumber")

        user_id = session.get("user_id")

        if user_id is None:

            return jsonify({
                "status": "error",
                "message": "User not logged in"
            }), 401

        conn = get_connection()
        cursor = conn.cursor()

        # Already booked check
        cursor.execute("""
            SELECT id
            FROM bookings
            WHERE user_id = ?
            AND service_name = ?
            AND price = ?
        """, (
            user_id,
            service_name,
            price
        ))

        existing = cursor.fetchone()

        if existing:

            session["booking"] = {
                "service_id": service_id,
                "service_name": service_name,
                "price": price,
                "brand": brand,
                "model": model,
                "fuel": fuel,
                "firstname": firstname,
                "lastname": lastname,
                "mobno": mobno,
                "bikenumber": bikenumber,
                "status": "already_booked"
            }

            cursor.close()
            conn.close()

            return jsonify({
                "status": "already_booked"
            })

        # Insert booking
        cursor.execute("""
            INSERT INTO bookings (
                user_id,
                service_id,
                service_name,
                price,
                firstname,
                lastname,
                mobno,
                brand,
                model,
                fuel,
                bikenumber
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            user_id,
            service_id,
            service_name,
            price,
            firstname,
            lastname,
            mobno,
            brand,
            model,
            fuel,
            bikenumber
        ))

        conn.commit()

        # Save booking data in session
        session["booking"] = {
            "service_id": service_id,
            "service_name": service_name,
            "price": price,
            "brand": brand,
            "model": model,
            "fuel": fuel,
            "firstname": firstname,
            "lastname": lastname,
            "mobno": mobno,
            "bikenumber": bikenumber,
            "status": "success"
        }

        print("SESSION BOOKING =", session["booking"])

        cursor.close()
        conn.close()

        return jsonify({
            "status": "success"
        })

    except Exception as e:

        print("BOOK ERROR:", e)

        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

        
@app.route("/get_success_data")
def get_success_data():

    booking = session.get("booking")

    print("BOOKING SESSION =", booking)

    if not booking:
        return jsonify({})

    return jsonify(booking)


@app.route("/sucess")
def sucess():
    return render_template("sucess.html")

@app.route("/order3")
def order3():
    return render_template("order3.html")

@app.route("/details3")
def details3():
    return render_template("details3.html")


# =========================================
# GET SUCCESS DATA
# =========================================



    
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
        SELECT 
            brand,
            model,
            fuel,
            service_name,
            price,bikenumber
        FROM bookings
        WHERE user_id=?
    """, (user_id,))

    rows = cursor.fetchall()

    result = []

    for row in rows:

        result.append({
            "brand": row[0],
            "model": row[1],
            "fuel": row[2],
            "service_name": row[3],
            "price":row[4],
            "bikenumber":row[5]
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



@app.route('/get_slider_services')
def get_slider_services():

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT id, service_name, price, image
        FROM slider_services
    """)

    rows = cursor.fetchall()

    data = []

    for row in rows:
        data.append({
            "id": row[0],
            "service_name": row[1],
            "price": row[2],
            "image": row[3]
        })

    cursor.close()
    conn.close()

    return jsonify(data)

@app.route('/get_order_data')
def get_order_data():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT brand, model, fuel FROM vehicless")
    rows = cursor.fetchall()

    data = []
    for r in rows:
        data.append({
            "brand": r[0],
            "model": r[1],
            "fuel": r[2]
        })

    return jsonify({"data": data})


@app.route('/get_services2')
def get_services2():

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT id, service_name, price, image FROM slider_services")

    data = [
        {
            "id": row[0],
            "name": row[1],
            "price": row[2],
            "image": row[3]
        }
        for row in cursor.fetchall()
    ]

    return jsonify(data)


@app.route('/get_all_datas')
def get_all_datas():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT brand, model, fuel FROM vehicless")

    data = []
    for row in cursor.fetchall():
        data.append({
            "brand": row[0],
            "model": row[1],
            "fuel": row[2]
        })

    conn.close()
    return jsonify(data)

@app.route('/get_service_details2/<int:id>')
def get_service_details2(id):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT id, service_name, price, image
        FROM slider_services
        WHERE id = ?
    """, (id,))

    row = cursor.fetchone()

    cursor.close()
    conn.close()

    if row:

        return jsonify({
            "id": row[0],
            "name": row[1],
            "price": row[2],
            "image": row[3],
            "inclusions": [
                "Engine Check",
                "Oil Change",
                "Brake Check"
            ]
        })

    return jsonify({
        "error": "Not found"
    })


@app.route("/get_service_details3/<int:id>")
def get_service_details3(id):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT id, service_name, price, image
        FROM services2
        WHERE id = ?
    """, (id,))

    row = cursor.fetchone()

    if row is None:
        return jsonify({"error": "Service not found"}), 404

    return jsonify({
        "id": row[0],
        "service_name": row[1],
        "price": row[2],
        "image": row[3]
    })


@app.route("/get_vehicle_data")
def get_vehicle_data():

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT DISTINCT brand, model, fuel
        FROM vehicless
    """)

    rows = cursor.fetchall()

    data = []

    for row in rows:

        data.append({
            "brand": row[0],
            "model": row[1],
            "fuel": row[2]
        })

    cursor.close()
    conn.close()

    return jsonify(data)


@app.route("/get_order3")
def get_order3():

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT id, service_name, price, image
        FROM services2
    """)

    rows = cursor.fetchall()

    data = []

    for row in rows:
        data.append({
            "id": row[0],
            "service_name": row[1],
            "price": row[2],
            "image": row[3]
        })

    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)