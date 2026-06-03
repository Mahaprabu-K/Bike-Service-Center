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

    // ================= FETCH SLIDER SERVICE DETAILS =================

    fetch(`/get_service_details2/${id}`)

    .then(res => res.json())

    .then(data => {

        console.log("SERVICE DATA:", data);

        // ================= STORE =================

        currentServiceName = data.name;
        currentServicePrice = data.price;

        // ================= IMAGE =================

        document.getElementById("serviceImage").src =
            data.image;

        // ================= NAME =================

        document.getElementById("serviceName").innerText =
            data.name;

        // ================= PRICE =================

        document.getElementById("servicePrice").innerText =
            "₹" + data.price;

        // ================= INCLUSIONS =================

        const list = document.getElementById("inclusionList");

        list.innerHTML = "";

        if (data.inclusions) {

            data.inclusions.forEach(item => {

                const li = document.createElement("li");

                li.innerText = item;

                list.appendChild(li);

            });

        }

    })

    .catch(err => {

        console.log("DETAILS ERROR:", err);

    });

};



// ================= BOOK NOW =================

function bookNow() {

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

            bikenumber: localStorage.getItem("bikenumber")

        })

    })

    .then(res => res.json())

    .then(data => {

        console.log("BOOK RESPONSE:", data);

        if (
            data.status === "success" ||
            data.status === "already_booked"
        ) {

            window.location.href = "/sucess";

        } else {

            alert(data.message);

        }

    })

    .catch(err => {

        console.log("BOOK ERROR:", err);

    });

}