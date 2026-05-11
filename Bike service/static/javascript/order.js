
window.onload = function () {

    let brand = localStorage.getItem("brand");
    let model = localStorage.getItem("model");
    let fuel = localStorage.getItem("fuel");
    

    console.log("Loaded:", brand, model, fuel);

    document.getElementById("brand").innerHTML =
        `<option selected>${brand}</option>`;

    document.getElementById("model").innerHTML =
        `<option selected>${model}</option>`;

    document.getElementById("fuel").innerHTML =
        `<option selected>${fuel}</option>`;
        


    fetch(`/get_services/${brand}`)
    .then(res => res.json())
    .then(data => {

        console.log(data); // check

        let container = document.getElementById("serviceContainer");
        container.innerHTML = "";

        data.forEach(item => {

            container.innerHTML += `
            <div class="card">
                <a href="/details?id=${item.id}">
                    <img src="/static/images/${item.image}" class="img1">

                    <div class="tag">
                        <span>${item.name}</span>
                        <span>₹${item.price}</span>
                    </div>
                </a>
            </div>
            `;

        });

    });

};

let orderData = {};

// 🔹 populate function
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

// 🔹 reset
function resetSelect(id, text) {
    document.getElementById(id).innerHTML = `<option value="">${text}</option>`;
}

document.addEventListener("DOMContentLoaded", function () {

    let brandEl = document.getElementById("brand");
    let modelEl = document.getElementById("model");
    let fuelEl  = document.getElementById("fuel");

    let savedBrand = localStorage.getItem("brand");
    let savedModel = localStorage.getItem("model");
    let savedFuel  = localStorage.getItem("fuel");

    fetch('/get_order_data')
    .then(res => res.json())
    .then(data => {

        orderData = data;

        // 🔥 LOAD BRAND
        populate("brand", Object.keys(orderData), "Select Brand");

        // =========================
        // 🔥 BRAND CHANGE
        // =========================
        brandEl.addEventListener("change", function () {

            let brand = this.value;

            populate("model", Object.keys(orderData[brand] || {}), "Select Model");
            resetSelect("fuel", "Select Fuel");

            modelEl.value = "";
            fuelEl.value = "";

            localStorage.setItem("brand", brand);
            localStorage.removeItem("model");
            localStorage.removeItem("fuel");
        });

        // =========================
        // 🔥 MODEL CHANGE
        // =========================
        modelEl.addEventListener("change", function () {

            let brand = brandEl.value;
            let model = this.value;

            populate("fuel", (orderData[brand] || {})[model] || [], "Select Fuel");

            fuelEl.value = "";

            localStorage.setItem("model", model);
            localStorage.removeItem("fuel");
        });

        // =========================
        // 🔥 FUEL CHANGE
        // =========================
        fuelEl.addEventListener("change", function () {
            localStorage.setItem("fuel", this.value);
        });

        // =========================
        // 🔥 PROPER RESTORE FIX
        // =========================
        if (savedBrand && orderData[savedBrand]) {

            brandEl.value = savedBrand;

            populate("model", Object.keys(orderData[savedBrand]), "Select Model");

            if (savedModel && orderData[savedBrand][savedModel]) {

                modelEl.value = savedModel;

                populate("fuel", orderData[savedBrand][savedModel], "Select Fuel");

                if (savedFuel && orderData[savedBrand][savedModel].includes(savedFuel)) {
                    fuelEl.value = savedFuel;
                }
            }
        }

    });

});