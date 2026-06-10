
// ================= FIRSTNAME =================
document.getElementById("firstname").addEventListener("input", function () {

    let value = this.value.replace(/[^A-Za-z]/g, "");

    if (value.length > 15) {
        document.getElementById("fnameError").innerText =
            "Maximum 15 letters only";
        value = value.slice(0, 15);
    } else {
        document.getElementById("fnameError").innerText = "";
    }

    this.value = value;
});


// ================= LASTNAME =================
document.getElementById("lastname").addEventListener("input", function () {

    let value = this.value.replace(/[^A-Za-z]/g, "");

    if (value.length > 15) {
        document.getElementById("lnameError").innerText =
            "Maximum 15 letters only";
        value = value.slice(0, 15);
    } else {
        document.getElementById("lnameError").innerText = "";
    }

    this.value = value;
});


// ================= MOBILE =================
document.getElementById("phone").addEventListener("input", function () {

    let value = this.value.replace(/\D/g, "");

    if (value.length > 10) {
        document.getElementById("mobileError").innerText =
            "Only 10 digits allowed";
        value = value.slice(0, 10);
    } else {
        document.getElementById("mobileError").innerText = "";
    }

    this.value = value;
});


// ================= WHATSAPP =================
document.getElementById("whatsapp").addEventListener("input", function () {

    let value = this.value.replace(/\D/g, "");

    if (value.length > 10) {
        document.getElementById("whatsappError").innerText =
            "Only 10 digits allowed";
        value = value.slice(0, 10);
    } else {
        document.getElementById("whatsappError").innerText = "";
    }

    this.value = value;
});


// ================= EMAIL =================
document.getElementById("email").addEventListener("input", function () {

    let email = this.value.trim();

    if (
        email !== "" &&
        !/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email)
    ) {
        document.getElementById("emailError").innerText =
            "Email must end with @gmail.com";
    } else {
        document.getElementById("emailError").innerText = "";
    }
});


// ================= USERNAME =================
document.getElementById("username").addEventListener("input", function () {

    let value = this.value.replace(/[^A-Za-z]/g, "");

    if (value.length > 15) {
        document.getElementById("userError").innerText =
            "Maximum 15 letters only";
        value = value.slice(0, 15);
    } else {
        document.getElementById("userError").innerText = "";
    }

    if (value.length > 0) {
        value =
            value.charAt(0).toUpperCase() +
            value.slice(1);
    }

    this.value = value;
});


// ================= PASSWORD =================
document.getElementById("password").addEventListener("input", function () {

    let value = this.value.replace(/\D/g, "");

    if (value.length > 6) {
        document.getElementById("passError").innerText =
            "Only 6 numbers allowed";
        value = value.slice(0, 6);
    } else {
        document.getElementById("passError").innerText = "";
    }

    this.value = value;
});


// ================= CONFIRM PASSWORD =================
document.getElementById("confirm_password").addEventListener("input", function () {

    let password =
        document.getElementById("password").value;

    if (
        this.value !== "" &&
        this.value !== password
    ) {
        document.getElementById("conpassError").innerText =
            "Password not match";
    } else {
        document.getElementById("conpassError").innerText = "";
    }
});


// ================= FORM SUBMIT =================
document.getElementById("form").addEventListener("submit", function (e) {

    e.preventDefault();

    let firstname =
        document.getElementById("firstname").value.trim();

    let lastname =
        document.getElementById("lastname").value.trim();

    let phone =
        document.getElementById("phone").value.trim();

    let whatsapp =
        document.getElementById("whatsapp").value.trim();

    let email =
        document.getElementById("email").value.trim();

    let username =
        document.getElementById("username").value.trim();

    let password =
        document.getElementById("password").value.trim();

    let confirmPassword =
        document.getElementById("confirm_password").value.trim();

    let gender =
        document.querySelector('input[name="gender"]:checked');

    let isValid = true;

    // CLEAR OLD ERRORS
    document.getElementById("fnameError").innerText = "";
    document.getElementById("lnameError").innerText = "";
    document.getElementById("mobileError").innerText = "";
    document.getElementById("whatsappError").innerText = "";
    document.getElementById("emailError").innerText = "";
    document.getElementById("userError").innerText = "";
    document.getElementById("passError").innerText = "";
    document.getElementById("conpassError").innerText = "";
    document.getElementById("genderError").innerText = "";

    // FIRSTNAME
    if (firstname === "") {
        document.getElementById("fnameError").innerText =
            "Firstname is required";
        isValid = false;
    }

    // LASTNAME
    if (lastname === "") {
        document.getElementById("lnameError").innerText =
            "Lastname is required";
        isValid = false;
    }

    // MOBILE
    if (!/^[0-9]{10}$/.test(phone)) {
        document.getElementById("mobileError").innerText =
            "Enter valid 10 digit mobile number";
        isValid = false;
    }

    // WHATSAPP
    if (!/^[0-9]{10}$/.test(whatsapp)) {
        document.getElementById("whatsappError").innerText =
            "Enter valid 10 digit whatsapp number";
        isValid = false;
    }

    // EMAIL
    if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email)) {
        document.getElementById("emailError").innerText =
            "Email must end with @gmail.com";
        isValid = false;
    }

    // USERNAME
    if (username === "") {
        document.getElementById("userError").innerText =
            "Username is required";
        isValid = false;
    }

    // PASSWORD
    if (!/^[0-9]{6}$/.test(password)) {
        document.getElementById("passError").innerText =
            "Password must contain exactly 6 numbers";
        isValid = false;
    }

    // CONFIRM PASSWORD
    if (confirmPassword === "") {
        document.getElementById("conpassError").innerText =
            "Confirm Password is required";
        isValid = false;
    } else if (password !== confirmPassword) {
        document.getElementById("conpassError").innerText =
            "Password not match";
        isValid = false;
    }

    // GENDER
    if (!gender) {
        document.getElementById("genderError").innerText =
            "Please select gender";
        isValid = false;
    }

    if (!isValid) {
        return;
    }

    // REGISTER API
    fetch("/register", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            firstname,
            lastname,
            phone,
            whatsapp,
            email,
            gender: gender.value,
            username,
            password
        })

    })

    .then(response => response.json())

    .then(result => {

        alert(result.message);

        if (result.message === "Registered Successful") {
            window.location.href = "/signin";
        }

    })

    .catch(error => {

        console.log(error);
        alert("Server Error");

    });
});

