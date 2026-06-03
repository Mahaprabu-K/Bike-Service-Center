window.onload = function () {

    // ================= SERVICE DETAILS =================

    let serviceId = localStorage.getItem("id");

    fetch(`/get_service_details2/${serviceId}`)
    .then(res => res.json())
    .then(data => {

        const container =
            document.getElementById("serviceContainer2");

        container.innerHTML = `

            <div class="card"
                 onclick="goToDetails2(${data.id})">

                <img src="${data.image}" class="img1">

                <div class="tag">
                    <span>${data.name}</span>
                    <span>₹${data.price}</span>
                </div>

            </div>

        `;
    });


    // ================= VEHICLE DATA =================

    fetch("/get_vehicle_data")

    .then(res => res.json())

    .then(data => {

        let brands = document.getElementById("brands");
        let models = document.getElementById("models");
        let fuels = document.getElementById("fuels");

        brands.innerHTML =
            '<option value="">Select Brand</option>';

        models.innerHTML =
            '<option value="">Select Model</option>';

        fuels.innerHTML =
            '<option value="">Select Fuel</option>';

        // Brand list
        let uniqueBrands =
            [...new Set(data.map(x => x.brand))];

        uniqueBrands.forEach(brand => {

            brands.innerHTML +=
                `<option value="${brand}">${brand}</option>`;

        });

        // Brand change
        brands.addEventListener("change", function () {

            let selectedBrand = this.value;

            models.innerHTML =
                '<option value="">Select Model</option>';

            fuels.innerHTML =
                '<option value="">Select Fuel</option>';

            let brandModels = data.filter(
                x => x.brand === selectedBrand
            );

            let uniqueModels =
                [...new Set(brandModels.map(x => x.model))];

            uniqueModels.forEach(model => {

                models.innerHTML +=
                    `<option value="${model}">${model}</option>`;

            });

        });

        // Model change
        models.addEventListener("change", function () {

            let selectedBrand = brands.value;
            let selectedModel = this.value;

            fuels.innerHTML =
                '<option value="">Select Fuel</option>';

            let fuelData = data.filter(
                x =>
                    x.brand === selectedBrand &&
                    x.model === selectedModel
            );

            let uniqueFuels =
                [...new Set(fuelData.map(x => x.fuel))];

            uniqueFuels.forEach(fuel => {

                fuels.innerHTML +=
                    `<option value="${fuel}">${fuel}</option>`;

            });

        });

    });

};

function goToDetails2(id) {

    let brand = document.getElementById("brands").value;
    let model = document.getElementById("models").value;
    let fuel = document.getElementById("fuels").value;
    let bikenumber = document.getElementById("bikenumber").value;


    if (brand === "" || model === "" || fuel === "" || bikenumber ==="") {

        alert("Please select Brand, Model , Fuel, bikenumber");

        return;
    }

    localStorage.setItem("brand", brand);
    localStorage.setItem("model", model);
    localStorage.setItem("fuel", fuel);
    localStorage.setItem("bikenumber",bikenumber);

    window.location.href = "/details2?id=" + id;
}