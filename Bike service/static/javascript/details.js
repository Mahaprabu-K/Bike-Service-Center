let currentServiceId = null;

window.onload = function () {

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (!id) {
        console.log("No service ID in URL");
        return;
    }

    currentServiceId = id;
    console.log("SERVICE ID:", currentServiceId);

    fetch(`/get_service_details/${id}`)
    .then(res => res.json())
    .then(data => {

        console.log("DATA:", data); // 🔥 debug

        // 🔥 image path fix
        let imagePath = data.image.includes("static")
            ? data.image
            : "/static/images/" + data.image;

        document.getElementById("serviceImage").src = imagePath;
        document.getElementById("serviceName").innerText = data.name;
        document.getElementById("servicePrice").innerText = "₹ " + data.price;

        let list = document.getElementById("inclusionList");
        list.innerHTML = "";

        data.inclusions.forEach(item => {
            let li = document.createElement("li");
            li.innerText = item;
            list.appendChild(li);
        });
    })
    .catch(err => console.log(err));
};


// 🔥 BOOK FUNCTION (cleaned)
function bookNow() {

    console.log("BOOKING ID:", currentServiceId);

    if (!currentServiceId) {
        alert("Service ID missing");
        return;
    }

    let brand = localStorage.getItem("brand");
    let model = localStorage.getItem("model");

    fetch("/book_service", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            brand: brand,
            model: model,
            service_id: currentServiceId
        })
    })
    .then(res => {
        if (res.status === 402) {
            alert("Please login first");
            window.location.href = "/signin";
            return;
        }
        return res.json();
    })
    .then(data => {
        if (data) {
            alert(data.message);
            window.location.href = "/";
        }
    })
    .catch(err => console.error("Error:", err));
}



