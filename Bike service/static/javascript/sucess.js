window.onload = function () {

    const params = new URLSearchParams(window.location.search);
    const booking_id = params.get("booking_id");

    fetch(`/get_booking/${booking_id}`)
    .then(res => res.json())
    .then(data => {

        document.getElementById("service_id").innerText = data.service_id;
        document.getElementById("brand").innerText = data.brand;
        document.getElementById("model").innerText = data.model;
        document.getElementById("fuel").innerText = data.fuel;
        document.getElementById("name").innerText = data.name;
        document.getElementById("mobile").innerText = data.mobile;

    });

}