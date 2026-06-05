let currentServiceId = null;
let currentServiceName = "";
let currentServicePrice = 0;

window.onload = function () {

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (!id) {
        console.log("No service ID in URL");
        return;
    }

    currentServiceId = id;

    fetch(`/get_service_details/${id}`)
    .then(res => res.json())
    .then(data => {

        console.log("DATA:", data);

        // ================= SERVICE DATA =================
        currentServiceName = data.name;
        currentServicePrice = data.price;

        // ================= IMAGE =================
        document.getElementById("serviceImage").src =
            data.image.includes("static")
            ? data.image
            : "/static/images/" + data.image;

        // ================= TEXT =================
        document.getElementById("serviceName").innerText =
            data.name || "No Service";

        document.getElementById("servicePrice").innerText =
            "₹ " + (data.price || 0);

        // ================= INCLUSIONS =================
        let list = document.getElementById("inclusionList");

        list.innerHTML = "";

        if (data.inclusions && Array.isArray(data.inclusions)) {

            data.inclusions.forEach(item => {

                let li = document.createElement("li");

                li.innerText = item;

                list.appendChild(li);

            });

        }

    })
    .catch(err => console.log("FETCH ERROR:", err));

};


// ================= BOOK NOW =================

function bookNow() {

    if (!currentServiceId) {

        alert("Service ID missing");

        return;
    }

    fetch("/book_service", {

        method: "POST",

        credentials: "include",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            service_id: currentServiceId,

            service_name: currentServiceName,

            price: currentServicePrice,

            firstname: localStorage.getItem("firstname"),

            lastname: localStorage.getItem("lastname"),

            mobno: localStorage.getItem("mobile"),

            brand: localStorage.getItem("brand"),

            model: localStorage.getItem("model"),

            fuel: localStorage.getItem("fuel"),

            bikenumber: localStorage.getItem("bikenumber"),

            price: localStorage.getItem("price")

        })

    })

    .then(res => res.json())

    .then(data => {

        console.log("BOOK RESPONSE:", data);

        // ================= SUCCESS =================
        if (data.status === "success") {

            localStorage.setItem(
                "book_service_id",
                currentServiceId
            );

            localStorage.setItem(
                "book_service_name",
                currentServiceName
            );

            localStorage.setItem(
                "book_price",
                currentServicePrice
            );

            localStorage.setItem(
                "book_brand",
                localStorage.getItem("brand")
            );

            localStorage.setItem(
                "book_model",
                localStorage.getItem("model")
            );

            localStorage.setItem(
                "book_fuel",
                localStorage.getItem("fuel")
            );

            localStorage.setItem(
                "book_bikenumber",
                localStorage.getItem("bikenumber")
            );

            localStorage.setItem(
                "book_name",
                localStorage.getItem("firstname") + " " +
                localStorage.getItem("lastname")
            );

            localStorage.setItem(
                "book_mobile",
                localStorage.getItem("mobile")
            );

             localStorage.setItem(
                "book_price",
                localStorage.getItem("price")
            );


            window.location.href = "/sucess";

        }

        // ================= ALREADY BOOKED =================
        else if (data.status === "already_booked") {

            window.location.href = "/sucess";

        }

        // ================= ERROR =================
        else {

            alert(data.message || "Booking failed");

        }

    })

    .catch(err => {

        console.log("BOOK ERROR:", err);

    });

}