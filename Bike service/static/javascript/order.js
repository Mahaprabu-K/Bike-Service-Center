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