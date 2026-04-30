
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