
function updateUser() {

    const firstname = document.getElementById("fname").value;
    const lastname = document.getElementById("lname").value;
    const mobno = document.getElementById("mobno").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    fetch("/update_user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
            firstname,
            lastname,
            mobno,
            username,
            password
        })
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message);
         window.location.href = "/";
    })
    .catch(err => {
        console.log("Error:", err);
    });
}

