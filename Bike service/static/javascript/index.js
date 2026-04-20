function loadUser() {
    fetch("/user")
    .then(res => res.json())
    .then(data => {
        const userDiv = document.getElementById("userSection");

        if (data.firstname && data.lastname) {
            userDiv.innerHTML = `
                <h3>${data.firstname} ${data.lastname}</h3>
                <a class="in" href="#" onclick="logout()">Logout</a>
            `;
        } else {
            userDiv.innerHTML = `
                <a class="in"  href="/signin">Sign In</a>
                <a class="up" href="/signup">Sign Up</a>
            `;
        }
    });
}



function logout() {
    fetch("/logout")
    .then(() => {
        window.location.reload();
    });
}
loadUser();


fetch('/get_vehicle')
.then(res => res.json())
.then(data => {
    let vehicleSelect = document.getElementById("vehicle");
    data.forEach(v => {
        let option = document.createElement("option");
        option.value = v;
        option.text = v;
        vehicleSelect.appendChild(option);
    });
});


document.addEventListener("DOMContentLoaded", function () {
document.getElementById("vehicle").addEventListener("change", function() {
    let vehicle = this.value;

    

    fetch(`/get_brand/${(vehicle)}`)
    .then(res => res.json())
    .then(data => {
        let brandSelect = document.getElementById("brand");
        brandSelect.innerHTML = '<option value="">Select Brand</option>';

        data.forEach(b => {
            let option = document.createElement("option");
            option.value = b;
            option.text = b;
            brandSelect.appendChild(option);
        });
    });
});
});

document.getElementById("brand").addEventListener("change", function() {
     console.log("🔥 CHANGE TRIGGERED");
    let brand = this.value;
    let vehicle = document.getElementById("vehicle").value;

    
    fetch(`/get_model/${vehicle}/${brand}`)
    .then(res => res.json())
    .then(data => {
        let modelSelect = document.getElementById("model");
        modelSelect.innerHTML = '<option value="">Select Model</option>';

        data.forEach(m => {
            let option = document.createElement("option");
            option.value = m;
            option.text = m;
            modelSelect.appendChild(option);
        });
    });
});

document.getElementById("model").addEventListener("change", function() {
    let model = this.value;
    let vehicle = document.getElementById("vehicle").value;
    let brand = document.getElementById("brand").value;


    fetch(`/get_fuel/${vehicle}/${brand}/${model}`)
    .then(res => res.json())
    .then(data => {
        let fuelSelect = document.getElementById("fuel");
        fuelSelect.innerHTML = '<option value="">Select Fuel</option>';

        data.forEach(f => {
            let option = document.createElement("option");
            option.value = f;
            option.text = f;
            fuelSelect.appendChild(option);
        });
    });
});


function goNext(event) {

    event.preventDefault(); // 🔥 important

    let brand = document.getElementById("brand").value;
    let model = document.getElementById("model").value;
    let fuel = document.getElementById("fuel").value;

    console.log("Saving:", brand, model, fuel); 

    localStorage.setItem("brand", brand);
    localStorage.setItem("model", model);
    localStorage.setItem("fuel", fuel);

    window.location.href = "/order";
}





