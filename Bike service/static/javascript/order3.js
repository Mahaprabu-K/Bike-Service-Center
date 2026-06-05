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


   window.onload = function () {

    fetch("/get_order3")
    .then(res => res.json())
    .then(data => {

        let container =
            document.getElementById("serviceContainer");

        container.innerHTML = "";

        data.forEach(service => {

            container.innerHTML += `

                <div class="card">

                    <img src="/static/images/${service.image}"
                         class="img1"
                         onclick="goToDetails(${service.id})">

                    <div class="tag">

                        <span>${service.service_name}</span>

                        <span>₹${service.price}</span>

                    </div>

                </div>

            `;

        });

    });

};

function goToDetails(id) {

    window.location.href =
        `details3.html?id=${id}`;

}
