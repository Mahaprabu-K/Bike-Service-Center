// Get id from URL
const params =
    new URLSearchParams(window.location.search);

const serviceId =
    params.get("id");


// Call Python backend
fetch("/get_service/" + serviceId)

.then(response => response.json())

.then(service => {

    // Image
    document.getElementById("serviceImage").src =
        "/static/images/" + service.image;


    // Name
    document.getElementById("serviceName").innerText =
        service.name;

    // Price
    document.getElementById("servicePrice").innerText =
        "₹ " + service.price;

    // Inclusions
    const list =
        document.getElementById("inclusionList");

    list.innerHTML = "";

    service.inclusions.forEach(item => {

        const li =
            document.createElement("li");

        li.innerText = item;

        list.appendChild(li);

    });

})

.catch(error => {

    console.log("Error:", error);

});