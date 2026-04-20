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



    if (brand === "TVS") {
    document.getElementById("img1").src = "/static/images/service.jpg";
    document.getElementById("img2").src = "/static/images/service2.jpg";
    document.getElementById("img3").src = "/static/images/tvs3.jpg";
}

 if (brand === "Bajaj") {
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


document.getElementById("model").addEventListener("change", function () {
    changeImage(this.value);

function changeImage(brand) {
    const bikeImages = {
        "Bajaj": "/static/images/service.jpg",
        "Pulsar": "/static/images/pulsar.png",
        "R15": "/static/images/r15.png"
    };

    let imagePath = bikeImages[brand] || "/static/images/default.png";

    document.getElementById("bikeImage").src = imagePath;
}});