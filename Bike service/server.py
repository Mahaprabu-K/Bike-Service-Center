from flask import Flask,render_template , request, jsonify,session,redirect
import pyodbc

app = Flask(__name__)
app.secret_key = "mysecretkey"

conn = pyodbc.connect(
    "Driver={SQL Server};"
    "Server=KISHORE\\SQLEXPRESS;"
    "Database=Bikeservicedb;"
    "Trusted_Connection=yes;"
)

cursor = conn.cursor()

@app.route('/')
def index():
    return render_template("index.html",firstname=session.get('firstname'),lastname=session.get('lastname'))
    
@app.route('/signup')
def signup():
    return render_template("signup.html")



@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    firstname = data['firstname']
    lastname = data['lastname']
    phone = data['phone']
    whatsapp = data['whatsapp']
    email = data['email']
    gender = data['gender']
    username = data['username']
    password = data['password']

    cursor.execute("""
        INSERT INTO Users 
        (FirstName, LastName, Phone, Whatsapp, Email, Gender, Username, Password)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (firstname, lastname, phone, whatsapp, email, gender, username, password))

    conn.commit()

    return jsonify({"message": "Registered Successful"})



@app.route('/signin')
def signin():
    return render_template("signin.html")

@app.route('/order')
def order():
    return render_template("order.html")



@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    username = data['username']
    password = data['password']

    cursor.execute("SELECT FirstName,lastname FROM Users WHERE Username=? AND Password=?", (username, password))
    user = cursor.fetchone()

    if user:
        session['firstname'] = user[0]
        session['lastname'] = user[1]  
        return jsonify({"status": "success"})
    else:
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


@app.route('/get_vehicle')
def get_vehicle():
    cursor = conn.cursor()
    cursor.execute("SELECT DISTINCT vehicle_type FROM vehicless")
    data = [row[0] for row in cursor.fetchall()]
    return jsonify(data)


@app.route('/get_brand/<vehicle>')
def get_brand(vehicle):
    cursor = conn.cursor()
    cursor.execute("SELECT DISTINCT brand FROM vehicless WHERE vehicle_type = ?", vehicle)
    data = [row[0] for row in cursor.fetchall()]
    return jsonify(data)

@app.route('/get_model/<vehicle>/<brand>')
def get_model(vehicle, brand):
    cursor = conn.cursor()
    cursor.execute(
        "SELECT DISTINCT model FROM vehicless WHERE vehicle_type = ? AND brand = ?",
        (vehicle, brand)
    )
    data = [row[0] for row in cursor.fetchall()]
    return jsonify(data)

@app.route('/get_fuel/<vehicle>/<brand>/<model>')
def get_fuel(vehicle, brand,model):
    cursor = conn.cursor()
    cursor.execute(
        "SELECT DISTINCT fuel FROM vehicless WHERE vehicle_type = ? AND brand = ? AND model=?",
        (vehicle, brand,model)
    )
    data = [row[0] for row in cursor.fetchall()]
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)