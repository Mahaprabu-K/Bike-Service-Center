// =========================================
// FIRSTNAME VALIDATION
// =========================================
document.getElementById("firstname").addEventListener("input", function () {

    let value = this.value;

    value = value.replace(/[^A-Za-z]/g, "");

    if (value.length > 15) {

        document.getElementById("fnameError").innerText =
            "Maximum 15 letters only";

        value = value.slice(0, 15);

    } else {

        document.getElementById("fnameError").innerText = "";
    }

    this.value = value;

});

// =========================================
// LASTNAME VALIDATION
// =========================================
document.getElementById("lastname").addEventListener("input", function () {

    let value = this.value;

    value = value.replace(/[^A-Za-z]/g, "");

    if (value.length > 15) {

        document.getElementById("lnameError").innerText =
            "Maximum 15 letters only";

        value = value.slice(0, 15);

    } else {

        document.getElementById("lnameError").innerText = "";
    }

    this.value = value;

});

// =========================================
// MOBILE VALIDATION
// =========================================
document.getElementById("phone").addEventListener("input", function () {

    let value = this.value;

    value = value.replace(/[^0-9]/g, "");

    if (value.length > 10) {

        document.getElementById("mobileError").innerText =
            "Only 10 numbers allowed";

        value = value.slice(0, 10);

    } else {

        document.getElementById("mobileError").innerText = "";
    }

    this.value = value;

});

// =========================================
// WHATSAPP VALIDATION
// =========================================
document.getElementById("whatsapp").addEventListener("input", function () {

    let value = this.value;

    value = value.replace(/[^0-9]/g, "");

    if (value.length > 10) {

        document.getElementById("whatsappError").innerText =
            "Only 10 numbers allowed";

        value = value.slice(0, 10);

    } else {

        document.getElementById("whatsappError").innerText = "";
    }

    this.value = value;

});

// =========================================
// EMAIL VALIDATION
// =========================================
document.getElementById("email").addEventListener("input", function () {

    let value = this.value;

    let pattern =
        /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

    if (!pattern.test(value)) {

        document.getElementById("emailError").innerText =
            "Email must end with @gmail.com";

    } else {

        document.getElementById("emailError").innerText = "";
    }

});

// =========================================
// USERNAME VALIDATION
// =========================================
document.getElementById("username").addEventListener("input", function () {

    let value = this.value;

    value = value.replace(/[^A-Za-z]/g, "");

    if (value.length > 15) {

        document.getElementById("userError").innerText =
            "Maximum 15 letters only";

        value = value.slice(0, 15);

    }

    else if (value.length > 0) {

        let firstLetter = value.charAt(0);

        if (firstLetter !== firstLetter.toUpperCase()) {

            document.getElementById("userError").innerText =
                "First letter must be CAPITAL";

        } else {

            document.getElementById("userError").innerText = "";
        }

    }

    this.value = value;

});

// =========================================
// PASSWORD VALIDATION
// =========================================
document.getElementById("password").addEventListener("input", function () {

    let value = this.value;

    value = value.replace(/[^0-9]/g, "");

    if (value.length > 6) {

        document.getElementById("passError").innerText =
            "Only 6 numbers allowed";

        value = value.slice(0, 6);

    } else {

        document.getElementById("passError").innerText = "";
    }

    this.value = value;

});

// =========================================
// CONFIRM PASSWORD
// =========================================
document.getElementById("confirm_password").addEventListener("input", function () {

    let password =
        document.getElementById("password").value;

    let confirm = this.value;

    if (password !== confirm) {

        document.getElementById("conpassError").innerText =
            "Password not match";

    } else {

        document.getElementById("conpassError").innerText = "";
    }

});

// =========================================
// FORM SUBMIT
// =========================================
document.getElementById("form").addEventListener("submit", function (e) {

    e.preventDefault();

    let firstname = document.getElementById("firstname").value;
    let lastname = document.getElementById("lastname").value;
    let phone = document.getElementById("phone").value;
    let whatsapp = document.getElementById("whatsapp").value;
    let email = document.getElementById("email").value;
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    let gender =
        document.querySelector('input[name="gender"]:checked');

    if (!gender) {

        alert("Please select gender");
        return;
    }

    fetch("/register", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            firstname: firstname,
            lastname: lastname,
            phone: phone,
            whatsapp: whatsapp,
            email: email,
            gender: gender.value,
            username: username,
            password: password

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

document.getElementById("form").addEventListener("submit", function(e) {

    e.preventDefault();

    let username = usernameInput.value.trim();
    let password = passwordInput.value.trim();

    // CLEAR OLD ERRORS
    usernameError.innerText = "";
    passwordError.innerText = "";

    if (username === "" && password === "") {

    usernameError.innerText =
        "Username is required";

    passwordError.innerText =
        "Password is required";

    return;

} else {

    usernameError.innerText = "";
    passwordError.innerText = "";
} });