window.onload = function () {

    console.log("JS Loaded ");

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

        



    if (brand === "ELECT ") {
    document.getElementById("img1").src = "/static/images/service.jpg";
    document.getElementById("img2").src = "/static/images/service2.jpg";
    document.getElementById("img3").src = "/static/images/tvs3.jpg";
}

 if (brand === "ROYAL ENFIELD") {
    document.getElementById("img1").src = "/static/images/service.jpg";
    document.getElementById("img2").src = "/static/images/service2.jpg";
    document.getElementById("img3").src = "/static/images/service3.jpg";
}


};


fetch('/get_brands')
.then(res => res.json())
.then(data => {
    let brandSelect = document.getElementById("brand");
    data.forEach(v => {
        let option = document.createElement("option");
        option.value = v;
        option.text = v;
        brandSelect.appendChild(option);
    });
});

document.getElementById("brand").addEventListener("change", function() {

    let brand = this.value;

    // 🔥 empty check
    if(!brand) return;

    fetch(`/get_models/${brand}`)
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

    // 🔥 empty check
    if(!model) return;

    fetch(`/get_fuels/${model}`)
    .then(res => res.json())
    .then(data => {

        let fuelSelect = document.getElementById("fuel");

        fuelSelect.innerHTML = '<option value="">Select fuel</option>';

        data.forEach(f => {
            let option = document.createElement("option");
            option.value = f;
            option.text = f;
            fuelSelect.appendChild(option);
        });
    });

});



// 🔹 Image update function
// 🔹 Image update function
function updateImage() {

    let brand = document.getElementById("brand").value;
    let model = document.getElementById("model").value;
    let fuel = document.getElementById("fuel").value;

    // 🔥 எல்லாம் select ஆனா மட்டும் run ஆகும்
    if (brand && model && fuel) {

        if (brand === "ELECT ") {
            document.getElementById("img1").src = "/static/images/service.jpg";
            document.getElementById("img2").src = "/static/images/service2.jpg";
            document.getElementById("img3").src = "/static/images/tvs3.jpg";
        } 
        else if (brand === "ROYAL ENFIELD") {
            document.getElementById("img1").src = "/static/images/service.jpg";
            document.getElementById("img2").src = "/static/images/service2.jpg";
            document.getElementById("img3").src = "/static/images/service3.jpg";
        }

    }
}
// 🔹 Dropdown change event
document.getElementById("brand").addEventListener("change", function () {
    let selectedBrand = this.value;
    updateImage(selectedBrand,selectedModel);
});

document.getElementById("model").addEventListener("change", function () {
    let selectedModel = this.value;
    updateImage(selectedModel,selectedFuel);
});

document.getElementById("fuel").addEventListener("change", function () {
    let selectedFuel = this.value;
    updateImage(selectedFuel);
});





fetch("/get_services")
.then(response => response.json())
.then(data => {

    // First service
    document.getElementById("img1").src =
        "/static/images/" + data[0].image;

    document.getElementById("name1").innerText =
        data[0].name;

    document.getElementById("price1").innerText =
        "Rs." + data[0].price;


    // Second service
    document.getElementById("img2").src =
        "/static/images/" + data[1].image;

    document.getElementById("name2").innerText =
        data[1].name;

    document.getElementById("price2").innerText =
        "Rs." + data[1].price;


    // Third service
    document.getElementById("img3").src =
        "/static/images/" + data[2].image;

    document.getElementById("name3").innerText =
        data[2].name;

    document.getElementById("price3").innerText =
        "Rs." + data[2].price;

});
