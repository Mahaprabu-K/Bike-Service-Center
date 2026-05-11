function loadUser() {
    fetch("/user")
    .then(res => res.json())
    .then(data => {
        const userDiv = document.getElementById("userSection");

        if (data.firstname && data.lastname) {
            userDiv.innerHTML = `
                <div class="user-menu">
                    
                    <span class="username">
                       <h3> ${data.firstname} ${data.lastname}</h3>
                    </span>

                    <div class="user-icon" onclick="toggleMenu()">👤</div>

                    <div id="dropdownMenu" class="dropdown">
                        <button class="drop-btn" onclick="goToBookings()">📋 My Bookings</button>
                        <button class="drop-btn" onclick="goToProfile()">✏️ Edit Profile</button>
                        <button class="drop-btn logout" onclick="logout()">🚪 Logout</button>
                    </div>

                </div>
            `;
        } else {
            userDiv.innerHTML = `
                <a class="in" href="/signin">Sign In</a>
                <a class="up" href="/signup">Sign Up</a>
            `;
        }
    });
}

loadUser();

function toggleMenu() {
    const menu = document.getElementById("dropdownMenu");

    if (menu.style.display === "block") {
        menu.style.display = "none";
    } else {
        menu.style.display = "block";
    }
}

function toggleMenu() {
    let menu = document.getElementById("dropdownMenu");
    menu.style.display = (menu.style.display === "block") ? "none" : "block";
}

// 🔥 outside click close
document.addEventListener("click", function(e) {

    let menu = document.getElementById("dropdownMenu");
    let profile = document.querySelector(".user-icon");

    // dropdown அல்லது profile icon click இல்லனா close
    if (!menu.contains(e.target) && !profile.contains(e.target)) {
        menu.style.display = "none";
    }
});

function goToBookings() {
    window.location.href = "/mybookings";
}


function goToProfile() {
    window.location.href = "/profile";
}

function logout() {
    fetch("/logout")
    .then(res => res.json())
    .then(data => {
        alert(data.message);
        window.location.href = "/";
    })
    .catch(err => console.error(err));
}

let fullData = {};

// 🔹 reusable function
function populate(id, values, text) {
    const el = document.getElementById(id);

    // 🔥 clear old data (important)
    el.innerHTML = `<option value="" >${text}</option>`;

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

    // save to localStorage
    localStorage.setItem("vehicle", vehicle);
    localStorage.setItem("brand", brand);
    localStorage.setItem("model", model);
    localStorage.setItem("fuel", fuel);

    // move next page
    window.location.href = "/order";
}

// 🔹 DB data fetch
// 🔥 DB data
fetch("/get_slider_services")
.then(res => res.json())
.then(data => {

    console.log(data);

    let slides = document.querySelectorAll(".slide");
    let names = document.querySelectorAll(".serviceName");
    let prices = document.querySelectorAll(".servicePrice");
    let images = document.querySelectorAll(".slideImage");

    data.forEach((item, index) => {

        if (names[index]) {
            names[index].innerText = item.service_name;
        }

        if (prices[index]) {
            prices[index].innerText = "₹ " + item.price;
        }

        if (images[index]) {
            let imagePath = item.image.includes("static")
                ? item.image
                : "/static/images/" + item.image;

            images[index].src = imagePath;
        }

        if (slides[index]) {
            slides[index].onclick = function () {
                localStorage.setItem("id", item.id);
                localStorage.setItem("service_name", item.service_name);
                localStorage.setItem("price", item.price);
                localStorage.setItem("image", item.image);

                window.location.href = "/order2";
            };
        }

    });

});



document.addEventListener("DOMContentLoaded", function () {

    let slides = document.querySelectorAll(".slide");
    let i = 0;

    if (slides.length === 0) {
        console.log("No slides found");
        return;
    }

    function showSlide() {

        slides.forEach(s => s.classList.remove("active"));

        slides[i].classList.add("active");

        i++;

        if (i >= slides.length) {
            i = 0;
        }
    }

    setInterval(showSlide, 3000);

});


function goToOrder2(id, name, price, image) {

    console.log("CLICKED ID:", id);

    localStorage.setItem("id", id);
    localStorage.setItem("service_name", name);
    localStorage.setItem("price", price);
    localStorage.setItem("image", image);

    window.location.href = "/order2";
}