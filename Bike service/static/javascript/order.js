let currentService = {
    name: "",
    price: 0
};

window.onload = function () {

    // ================= VEHICLE DATA =================
    let brand = localStorage.getItem("brand");
    let model = localStorage.getItem("model");
    let fuel = localStorage.getItem("fuel");

    document.getElementById("brand").innerHTML =
        `<option selected>${brand || "Select Brand"}</option>`;

    document.getElementById("model").innerHTML =
        `<option selected>${model || "Select Model"}</option>`;

    document.getElementById("fuel").innerHTML =
        `<option selected>${fuel || "Select Fuel"}</option>`;


    // ================= SERVICE CONTAINER =================
    let container = document.getElementById("serviceContainer");

    container.innerHTML = "";


    // ================= SELECTED SERVICE =================
    let selectedId = localStorage.getItem("id");


    // =====================================================
    // CASE 1 : SLIDER SELECTED SERVICE
    // =====================================================
    if (selectedId) {

        let name = localStorage.getItem("service_name");
        let price = localStorage.getItem("price");
        let image = localStorage.getItem("image");

        currentService.name = name;
        currentService.price = price;

        let imagePath = image.includes("static")
            ? image
            : "/static/images/" + image;


        container.innerHTML = `

            <div class="card">

                <img 
                    src="${imagePath}" 
                    class="img1"
                    onclick="goToSingleDetails()"
                >

                <div class="tag">
                    <span>${name}</span>
                    <span>₹${price}</span>
                </div>

            </div>

        `;

        return;
    }


    // =====================================================
    // CASE 2 : BRAND BASED SERVICES
    // =====================================================
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
                    onclick="selectService(
                        '${item.name}',
                        '${item.price}',
                        ${item.id}
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

    .catch(err => console.log(err));

};



// =====================================================
// SELECT SERVICE
// =====================================================
function selectService(name, price, id) {

    currentService.name = name;
    currentService.price = price;

    localStorage.setItem("service_name", name);
    localStorage.setItem("price", price);
    localStorage.setItem("id", id);

    window.location.href = `/details?id=${id}`;
}



// =====================================================
// NORMAL DETAILS PAGE
// =====================================================
function goToDetails(id) {

    window.location.href = `/details?id=${id}`;

}



// =====================================================
// SLIDER SERVICE DETAILS PAGE
// =====================================================
function goToSingleDetails() {

    window.location.href = "/details";

}



// =====================================================
// BOOK SERVICE
// =====================================================
function bookNow() {

    let service_name = localStorage.getItem("service_name");

    let price = localStorage.getItem("price");

    console.log(service_name, price);

    fetch("/book_service", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            service_name: service_name,

            price: price
        })
    })

    .then(res => res.json())

    .then(data => {

        console.log(data);

        alert(data.message);

    })

    .catch(err => console.log(err));

}