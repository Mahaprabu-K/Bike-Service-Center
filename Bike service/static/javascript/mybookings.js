fetch("/get_my_bookings", {
    credentials: "include"
})

.then(res => res.json())

.then(data => {

    console.log("DATA:", data);

    const div = document.getElementById("bookingList");

    if (!data || data.length === 0) {

        div.innerHTML = "<p>No bookings yet</p>";
        return;

    }

    let html = "";

    data.forEach((b, index) => {

        html += `

            <div class="booking-card">

                <div class="card-header">

                    <span class="sno">
                        #${index + 1}
                    </span>

                </div>

                <div class="card-body">

                    <p>🏍 <b>Bike:</b> ${b.brand || '-'}</p>

                    <p>⚙ <b>Model:</b> ${b.model || '-'}</p>

                    <p>⚙ <b>Bikenumber:</b> ${b.bikenumber || '-'}</p>

                    <p>⛽ <b>Fuel:</b> ${b.fuel || '-'}</p>

                    <p>🛠 <b>Service Pack:</b> ${b.service_name || '-'}</p>

                    <p>💰 <b>Amount:</b> ₹ ${b.price || 0}</p>

                </div>

            </div>

        `;
    });

    div.innerHTML = html;

})

.catch(err => {

    console.log("ERROR:", err);

});