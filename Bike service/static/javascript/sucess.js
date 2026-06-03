window.onload = function () {

    fetch("/get_success_data", {
        credentials: "include"
    })

    .then(res => res.json())

    .then(data => {

        console.log("SUCCESS DATA:", data);

        // =========================
        // BOOKING STATUS
        // =========================
        if (data.status === "already_booked") {

            document.querySelector("h1").innerText =
                "Already Booked ⚠️";

        } else {

            document.querySelector("h1").innerText =
                "Booking Successful ✅";
        }

        // =========================
        // BOOKING DETAILS
        // =========================
        document.getElementById("service_id").innerText =
            data.service_id || "-";

        document.getElementById("service_name").innerText =
            data.service_name || "-";

        document.getElementById("brand").innerText =
            data.brand || "-";

        document.getElementById("model").innerText =
            data.model || "-";

        document.getElementById("fuel").innerText =
            data.fuel || "-";

        document.getElementById("name").innerText =
            (data.firstname || "") + " " + (data.lastname || "");

        document.getElementById("mobile").innerText =
            data.mobno || "-";

        document.getElementById("bikenumber").innerText =
            data.bikenumber || "-";


    })

    .catch(error => {

        console.log("ERROR:", error);

    });

}