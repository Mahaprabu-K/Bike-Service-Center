// ================= USER =================
function loadUser() {
    fetch("/user")
    .then(res => res.json())
    .then(data => {
        const userDiv = document.getElementById("userSection");

        if (data.firstname && data.lastname) {
            userDiv.innerHTML = `
                <div class="user-menu">
                    <span class="username">
                        <h3>${data.firstname} ${data.lastname}</h3>
                    </span>

                    <div class="user-icon" onclick="toggleMenu()">👤</div>

                    <div id="dropdownMenu" class="dropdown">
                        <button onclick="goToBookings()">📋 My Bookings</button>
                        <button onclick="goToProfile()">✏️ Edit Profile</button>
                        <button onclick="logout()">🚪 Logout</button>
                    </div>
                </div>
            `;
        } else {
            userDiv.innerHTML = `
                <a href="/signin" class="in">Sign In</a>
                <a href="/signup" class="up">Sign Up</a>
            `;
        }
    });
}
loadUser();

function toggleMenu() {
    let menu = document.getElementById("dropdownMenu");
    menu.style.display = (menu.style.display === "block") ? "none" : "block";
}

// close outside click
document.addEventListener("click", function(e) {
    let menu = document.getElementById("dropdownMenu");
    let profile = document.querySelector(".user-icon");

    if (menu && profile && !menu.contains(e.target) && !profile.contains(e.target)) {
        menu.style.display = "none";
    }
});

function goToBookings() { window.location.href = "/mybookings"; }
function goToProfile() { window.location.href = "/profile"; }

function logout() {
    fetch("/logout")
    .then(res => res.json())
    .then(data => {
        alert(data.message);
        window.location.href = "/";
    });
}

// ================= VEHICLE DROPDOWN =================

let fullData = {};

function populate(id, values, text) {

    const el = document.getElementById(id);

    el.innerHTML = `<option value="">${text}</option>`;

    values.forEach(v => {

        let opt = document.createElement("option");

        opt.value = v;

        opt.text = v;

        el.appendChild(opt);

    });
}



document.addEventListener("DOMContentLoaded", function () {

    fetch('/get_all_data')

    .then(res => res.json())

    .then(data => {

        fullData = data;

        populate("vehicle", Object.keys(fullData), "Select Vehicle");

        populate("brand", [], "Select Brand");

        populate("model", [], "Select Model");

        populate("fuel", [], "Select Fuel");

    });



    // ================= VEHICLE CHANGE =================

    document.getElementById("vehicle")

    .addEventListener("change", function () {

        let vehicle = this.value;

        populate(
            "brand",
            Object.keys(fullData[vehicle] || {}),
            "Select Brand"
        );

        populate("model", [], "Select Model");

        populate("fuel", [], "Select Fuel");

    });



    // ================= BRAND CHANGE =================

    document.getElementById("brand")

    .addEventListener("change", function () {

        let vehicle = document.getElementById("vehicle").value;

        let brand = this.value;

        populate(

            "model",

            Object.keys(

                (fullData[vehicle] || {})[brand] || {}

            ),

            "Select Model"

        );

        populate("fuel", [], "Select Fuel");

    });



    // ================= MODEL CHANGE =================

    document.getElementById("model")

    .addEventListener("change", function () {

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



// ================= NEXT BUTTON =================

function goNext() {

    let vehicle = document.getElementById("vehicle").value;

    let brand = document.getElementById("brand").value;

    let model = document.getElementById("model").value;

    let fuel = document.getElementById("fuel").value;



    // ================= SAVE VEHICLE DATA =================

    localStorage.setItem("vehicle", vehicle);

    localStorage.setItem("brand", brand);

    localStorage.setItem("model", model);

    localStorage.setItem("fuel", fuel);



    // ================= CLEAR OLD SERVICE =================

    localStorage.removeItem("id");

    localStorage.removeItem("service_name");

    localStorage.removeItem("price");

    localStorage.removeItem("image");



    // ================= NEXT PAGE =================

    window.location.href = "/order";
}



// ================= SELECT SERVICE =================

function selectService(name, price, id, image) {

    localStorage.setItem("service_name", name);

    localStorage.setItem("price", price);

    localStorage.setItem("id", id);

    localStorage.setItem("image", image);



    window.location.href = `/details?id=${id}`;
}



// ================= SERVICES =================
let currentIndex = 0;

// ================= LOAD SLIDER SERVICES =================
fetch("/get_slider_services")
.then(res => res.json())
.then(data => {

    let slides = document.querySelectorAll(".slide");
    let names = document.querySelectorAll(".serviceName");
    let prices = document.querySelectorAll(".servicePrice");
    let images = document.querySelectorAll(".slideImage");

    data.forEach((item, index) => {

        // ===== SERVICE NAME =====
        if (names[index]) {
            names[index].innerText = item.service_name;
        }

        // ===== PRICE =====
        if (prices[index]) {
            prices[index].innerText = "₹ " + item.price;
        }

        // ===== IMAGE =====
        if (images[index]) {

            let imagePath = item.image.includes("static")
                ? item.image
                : "/static/images/" + item.image;

            images[index].src = imagePath;
        }

        // ===== CLICK EVENT =====
        if (slides[index]) {

            slides[index].style.cursor = "pointer";

            slides[index].addEventListener("click", function () {

                console.log("clicked");

                goToOrder2(
                    item.id,
                    item.service_name,
                    item.price,
                    item.image
                );

            });

        }

    });

    // start slider
    startSlider();

})
.catch(err => console.log(err));


// ================= SELECT SERVICE =================
function goToOrder2(id, name, price, image) {

    // clear old values
    localStorage.removeItem("vehicle");
    localStorage.removeItem("brand");
    localStorage.removeItem("model");
    localStorage.removeItem("fuel");

    // save service
    localStorage.setItem("id", id);
    localStorage.setItem("service_name", name);
    localStorage.setItem("price", price);
    localStorage.setItem("image", image);

    // go order page
    window.location.href = "/order2";
}


// ================= AUTO SLIDER =================
function startSlider() {

    let slides = document.querySelectorAll(".slide");
    let dots = document.querySelectorAll(".dot");

    // first slide active
    slides[0].classList.add("active");

    if (dots[0]) {
        dots[0].classList.add("active-dot");
    }

    setInterval(() => {

        // remove active
        slides.forEach(slide => {
            slide.classList.remove("active");
        });

        dots.forEach(dot => {
            dot.classList.remove("active-dot");
        });

        // next slide
        currentIndex++;

        if (currentIndex >= slides.length) {
            currentIndex = 0;
        }

        // add active
        slides[currentIndex].classList.add("active");

        if (dots[currentIndex]) {
            dots[currentIndex].classList.add("active-dot");
        }

    }, 3000);

}