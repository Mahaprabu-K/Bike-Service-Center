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


let fullData = {};

// 🔹 reusable function
function populate(id, values, text) {
    const el = document.getElementById(id);

    // 🔥 clear old data (important)
    el.innerHTML = `<option value="">${text}</option>`;

    values.forEach(v => {
        let opt = document.createElement("option");
        opt.value = v;
        opt.text = v;
        el.appendChild(opt);
    });
}

// 🔹 load once (IMPORTANT)
document.addEventListener("DOMContentLoaded", function () {

    fetch('/get_all_data')
    .then(res => res.json())
    .then(data => {
        fullData = data;

        populate("vehicle", Object.keys(fullData), "Select Vehicle");
        populate("brand", [], "Select Brand");
    });

    // 🔹 vehicle change
    document.getElementById("vehicle").addEventListener("change", function () {
        let vehicle = this.value;

        populate("brand", Object.keys(fullData[vehicle] || {}), "Select Brand");
        populate("model", [], "Select Model");
        populate("fuel", [], "Select Fuel");
    });

    // 🔹 brand change
    document.getElementById("brand").addEventListener("change", function () {
        let vehicle = document.getElementById("vehicle").value;
        let brand = this.value;

        populate(
            "model",
            Object.keys((fullData[vehicle] || {})[brand] || {}),
            "Select Model"
        );

        populate("fuel", [], "Select Fuel");
    });

    // 🔹 model change
    document.getElementById("model").addEventListener("change", function () {
        let vehicle = document.getElementById("vehicle").value;
        let brand = document.getElementById("brand").value;
        let model = this.value;

        populate(
            "fuel",
            ((fullData[vehicle] || {})[brand] || {})[model] || [],
            "Select Fuel"
        );
    });

});


function goNext() {


    let vehicle = document.getElementById("vehicle").value;
    
    let brand = document.getElementById("brand").value;

    let model = document.getElementById("model").value;
    
    let fuel = document.getElementById("fuel").value;
    
    console.log("Saving:",vehicle, brand, model, fuel); 

    localStorage.setItem("vehicle", vehicle);
    localStorage.setItem("brand", brand);
    localStorage.setItem("model", model);
    localStorage.setItem("fuel", fuel);

}


document.getElementById("brand").addEventListener("change", function () {
  let brand = this.value;

  localStorage.setItem("brand", brand); // save
  updateImage(brand); // update image
});

// 🔥 Image update function
function updateImage(brand) {
  let img = document.getElementById("vehicleImage");

  if (brand === "Honda") {
    img.src = "/static/images/service.png";
  } else if (brand === "Yamaha") {
    img.src = "/static/images/yamaha.png";
  } else {
    img.src = "";
  }
}







