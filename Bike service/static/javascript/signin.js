document.getElementById("loginForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const data = {
        username: document.getElementById("username").value,
        password: document.getElementById("password").value
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
        if(result.status === "success"){

            alert("Login Successful");
            window.location.href = "/";
        } else {
            alert("Invalid Username or Password");
        }
    });
});