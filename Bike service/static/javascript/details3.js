let currentServiceId = "";
let currentServiceName = "";
let currentServicePrice = 0;

window.onload = function () {

    const params = new URLSearchParams(window.location.search);

    const id = params.get("id");

    if (!id) {

        console.log("No Service ID");

        return;
    }

    currentServiceId = id;

    fetch(`/get_service_details3/${id}`)

    .then(res => res.json())

    .then(data => {

        console.log("SERVICE DATA:", data);

        currentServiceName = data.service_name;
        currentServicePrice = data.price;

        document.getElementById("serviceImage").src =
            "/static/images/" + data.image;

        document.getElementById("serviceName").innerText =
            data.service_name;

        document.getElementById("servicePrice").innerText =
            "₹" + data.price;

        const list =
            document.getElementById("inclusionList");

        list.innerHTML = "";

        if (data.inclusions) {

            if (Array.isArray(data.inclusions)) {

                data.inclusions.forEach(item => {

                    list.innerHTML +=
                        `<li>${item}</li>`;

                });

            } else {

                list.innerHTML +=
                    `<li>${data.inclusions}</li>`;
            }
        }

    })

    .catch(err => {

        console.log("DETAILS ERROR:", err);

    });

};