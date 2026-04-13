document.querySelector("form").addEventListener("submit", function(e) {
    e.preventDefault();

    let password = document.getElementById("password").value;
    let confirmPassword = document.getElementById("confirm_password").value;

    if(password !== confirmPassword){
        document.getElementById("conpassError").innerText = "Password not match";
        return;
    }

    const data = {
        firstname: document.getElementById("firstname").value,
        lastname: document.getElementById("lastname").value,
        phone: document.getElementById("phone").value,
        whatsapp: document.getElementById("whatsapp").value,
        email: document.getElementById("email").value,
        gender: document.querySelector('input[name="gender"]:checked').value,
        username: document.getElementById("username").value,
        password: document.getElementById("password").value
    };

    fetch("/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        alert(result.message);
        if(result.message){
            window.location.href = "/signin";
        }
    });
});