let currentService = {
    name: "",
    price: 0
};

window.onload = function () {

    // ================= VEHICLE DATA =================

    let brand = localStorage.getItem("brand");
    let model = localStorage.getItem("model");
    let fuel = localStorage.getItem("fuel");

    let brandEl = document.getElementById("brand");
    let modelEl = document.getElementById("model");
    let fuelEl = document.getElementById("fuel");

    if (brandEl) {
        brandEl.innerHTML =
            `<option selected>${brand || "Select Brand"}</option>`;
    }

    if (modelEl) {
        modelEl.innerHTML =
            `<option selected>${model || "Select Model"}</option>`;
    }

    if (fuelEl) {
        fuelEl.innerHTML =
            `<option selected>${fuel || "Select Fuel"}</option>`;
    }

    // ================= SERVICE CONTAINER =================

    let container = document.getElementById("serviceContainer");

    if (!container) return;

    container.innerHTML = "";

    // ================= CHECK SLIDER SERVICE =================

    let selectedId = localStorage.getItem("id");

    if (selectedId) {

        let name = localStorage.getItem("service_name");
        let price = localStorage.getItem("price");
        let image = localStorage.getItem("image");

        currentService.name = name;
        currentService.price = price;

        let imagePath = image && image.includes("static")
            ? image
            : "/static/images/" + image;

        container.innerHTML = `

            <div class="card">

                <img
                    src="${imagePath}"
                    class="img1"
                    
                >

                <div class="tag">

                    <span>${name}</span>

                    <span>₹${price}</span>

                </div>

            </div>

        `;

        return;
    }

    // ================= NORMAL SERVICES =================

    if (!brand) {

        console.log("No brand selected");

        return;
    }

    fetch(`/get_services/${brand}`)

    .then(res => res.json())

    .then(data => {

        data.forEach(item => {

            container.innerHTML += `

                <div
    class="card"
    onclick="validateAndSelectService(
        '${item.name}',
        '${item.price}',
        '${item.id}'
    )"
>

                    <img
                        src="/static/images/${item.image}"
                        class="img1"
                    >

                    <div class="tag">

                        <span>${item.name}</span>

                        <span>₹${item.price}</span>

                    </div>

                </div>

            `;

        });

    })

    .catch(err => {

        console.log("FETCH ERROR:", err);

    });

};


// ================= NORMAL SERVICE =================

function selectService(name, price, id) {

    currentService.name = name;
    currentService.price = price;

    localStorage.setItem("service_name", name);
    localStorage.setItem("price", price);
    localStorage.setItem("id", id);

    window.location.href = `/details?id=${id}`;
}


// ================= NORMAL DETAILS ================

// ================= SLIDER DETAILS =================



function validateAndSelectService(name, price, id) {

    const bikeInput = document.getElementById("bikenumber");

    if (!bikeInput || bikeInput.value.trim() === "") {

        alert("Please enter Bike Number");

        return;
    }

    localStorage.setItem(
        "bikenumber",
        bikeInput.value.trim()
    );

    currentService.name = name;
    currentService.price = price;

    localStorage.setItem("service_name", name);
    localStorage.setItem("price", price);
    localStorage.setItem("id", id);

    window.location.href = `/details?id=${id}`;
}