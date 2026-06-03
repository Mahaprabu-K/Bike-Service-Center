const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

const usernameError = document.getElementById("usernameError");
const passwordError = document.getElementById("passwordError");

// =========================================
// USERNAME VALIDATION
// =========================================
usernameInput.addEventListener("input", function () {

    let username = usernameInput.value;

    // MAX 15 LETTERS
    if (username.length > 15) {

        usernameError.innerText =
            "Maximum 15 letters only";

        username = username.slice(0, 15);
    }

    // FIRST LETTER CAPITAL
    if (username.length > 0) {

        let firstLetter = username.charAt(0);

        if (firstLetter !== firstLetter.toUpperCase()) {

            usernameError.innerText =
                "First letter must be CAPITAL";

            username = "";

        } 
        
        else if (username.length <= 15) {

            usernameError.innerText = "";
        }

    } 
    
    else {

        usernameError.innerText = "";
    }

    usernameInput.value = username;

});

// =========================================
// PASSWORD VALIDATION
// =========================================
passwordInput.addEventListener("input", function () {

    let value = passwordInput.value;

    // ONLY NUMBERS
    if (/[^0-9]/.test(value)) {

        passwordError.innerText =
            "Only numbers are allowed";

        value = value.replace(/[^0-9]/g, "");

    } 
    
    else {

        passwordError.innerText = "";
    }

    // ONLY 6 DIGITS
    if (value.length > 6) {

        passwordError.innerText =
            "Only 6 numbers allowed";

        value = value.slice(0, 6);
    }

    passwordInput.value = value;

});

// =========================================
// FORM SUBMIT
// =========================================
document.getElementById("loginForm").addEventListener("submit", function(e) {

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
}
    // USERNAME REQUIRED
    if (username === "") {

        usernameError.innerText =
            "Username is required";

        return;
    }

    if (password ===""){
        passwordError.innerText =
            "password is required";

        return;
    }

    if (username === "" || password === "") {
    return;
}

    // USERNAME CHECK
    let firstLetter = username.charAt(0);

    if (firstLetter !== firstLetter.toUpperCase()) {

        usernameError.innerText =
            "First letter must be CAPITAL";

        return;
    }

    // PASSWORD CHECK
    let numberPattern = /^[0-9]{6}$/;

    if (!numberPattern.test(password)) {

        passwordError.innerText =
            "Password must contain exactly 6 numbers";

        return;
    }

    // SAVE USERNAME
    localStorage.setItem("username", username);

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

        console.log("LOGIN RESULT:", result);

        if(result.status === "success") {

            // SAVE USER DATA
            localStorage.setItem("firstname", result.firstname);
            localStorage.setItem("lastname", result.lastname);
            localStorage.setItem("mobile", result.mobile);

            alert("Login Successful");

            // REDIRECT
            window.location.href = "/";

        } 
        
        else {

            alert("Invalid Username or Password");

        }

    })

    .catch(error => {

        console.log("ERROR:", error);

    });

});