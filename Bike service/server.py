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




    
@app.route('/get_brands')
def get_brands():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT DISTINCT brand FROM vehicless")
    data = [row[0] for row in cursor.fetchall()]

    cursor.close()
    conn.close()

    return jsonify(data)

@app.route('/get_models/<brands>')
def get_models(brands):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT DISTINCT model FROM vehicless WHERE brand = ?",
        (brands,)
    )

    data = [row[0] for row in cursor.fetchall()]

    cursor.close()
    conn.close()

    return jsonify(data)


@app.route('/get_fuels/<models>')
def get_fuels(models):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT DISTINCT fuel FROM vehicless WHERE model = ?",
        (models,)
    )

    data = [row[0] for row in cursor.fetchall()]

    cursor.close()
    conn.close()

    return jsonify(data)



# Get services by brand
@app.route("/get_services/<brand>")
def get_services(brand):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT * FROM detailss WHERE brand=?",
        (brand,)
    )

    rows = cursor.fetchall()

    services = []

    for row in rows:

        services.append({
            "id": row[0],
            "brand": row[1],
            "name": row[2],
            "price": row[3],
            "image": row[4]
        })

    conn.close()

    return jsonify(services)


# Get single service
@app.route("/get_service/<int:id>/<brand>")
def get_service(id, brand):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT * FROM detailss WHERE id=? AND brand=?",
        (id, brand)
    )

    row = cursor.fetchone()

    service = {
        "id": row[0],
        "brand": row[1],
        "name": row[2],
        "price": row[3],
        "image": row[4]
    }

    conn.close()

    return jsonify(service)

if __name__ == '__main__':
    app.run(debug=True)