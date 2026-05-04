
fetch("/get_my_bookings", {
    credentials: "include"
})
.then(res => res.json())
.then(data => {

    console.log("DATA:", data);

    const div = document.getElementById("bookingList");

    // safety check
    if (!data || data.length === 0) {
        div.innerHTML = "<p>No bookings yet</p>";
        return;
    }

    let total = data.length;
    let html = "";   // 🔥 collect all HTML

   data.forEach((b, index) => {
    html += `
        <div class="booking-card">

            <div class="card-header">
                <span class="sno">#${total - index}</span>
                <span class="price">₹${b.price || 0}</span>
            </div>

            <div class="card-body">
                <p>🏍 <b>Bike:</b> ${b.brand || '-'}</p>
                <p>⚙ <b>Model:</b> ${b.model || '-'}</p>
                <p>🛠 <b>Service Pack:</b> ${b.service || '-'}</p>
                <p>📅 <b>Date:</b> ${b.date || 'N/A'}</p>
            </div>

        </div>
    `;
});
    div.innerHTML = html;
})
.catch(err => {
    console.log("ERROR:", err);
});
