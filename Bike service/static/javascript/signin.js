const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

const usernameError = document.getElementById("usernameError");
const passwordError = document.getElementById("passwordError");

// =========================================
// USERNAME VALIDATION
// =========================================
usernameInput.addEventListener("input", function () {

    let username = usernameInput.value;

    if (username.length > 0) {

        let firstLetter = username.charAt(0);

        if (firstLetter !== firstLetter.toUpperCase()) {

            usernameError.innerText =
                "First letter must be CAPITAL";

        } else {

            usernameError.innerText = "";

        }
    } else {

        usernameError.innerText = "";

    }

});

// =========================================
// PASSWORD VALIDATION
// =========================================
passwordInput.addEventListener("input", function () {

    let password = passwordInput.value;

    let numberPattern = /^[0-9]{6}$/;

    if (!numberPattern.test(password)) {

        passwordError.innerText =
            "Password must contain exactly 6 numbers";

    } else {

        passwordError.innerText = "";

    }

});

// =========================================
// FORM SUBMIT
// =========================================
document.getElementById("loginForm").addEventListener("submit", function(e) {

    e.preventDefault();

    let username = usernameInput.value;
    let password = passwordInput.value;

    let firstLetter = username.charAt(0);

    if (firstLetter !== firstLetter.toUpperCase()) {

        usernameError.innerText =
            "First letter must be CAPITAL";

        return;
    }

    let numberPattern = /^[0-9]{6}$/;

    if (!numberPattern.test(password)) {

        passwordError.innerText =
            "Password must contain exactly 6 numbers";

        return;
    }

    const data = {
        username: username,
        password: password
    };

    fetch("/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })

    .then(response => response.json())

    .then(result => {

        if(result.status === "success") {

            alert("Login Successful");
            window.location.href = "/";

        } else {

            alert("Invalid Username or Password");

        }

    });

});