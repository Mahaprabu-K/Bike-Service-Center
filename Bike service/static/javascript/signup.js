// =========================================
// FIRSTNAME VALIDATION
// =========================================
document.getElementById("firstname").addEventListener("input", function () {

    let value = this.value;

    // ONLY LETTERS
    value = value.replace(/[^A-Za-z]/g, "");

    // MAX 15 LETTERS
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

    // ONLY NUMBERS
    value = value.replace(/[^0-9]/g, "");

    // ONLY 10 DIGITS
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

    // MAX 15 LETTERS
    if (value.length > 15) {

        document.getElementById("userError").innerText =
            "Maximum 15 letters only";

        value = value.slice(0, 15);
    }

    // FIRST LETTER CAPITAL
    if (value.length > 0) {

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

    // ONLY NUMBERS
    value = value.replace(/[^0-9]/g, "");

    // ONLY 6 NUMBERS
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

    let confirm =
        this.value;

    if (password !== confirm) {

        document.getElementById("conpassError").innerText =
            "Password not match";

    } else {

        document.getElementById("conpassError").innerText = "";
    }

});