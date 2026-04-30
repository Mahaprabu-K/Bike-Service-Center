
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
            <div style="border:1px solid #ccc; margin:10px; padding:10px;">
                <p><b>S.No:</b> ${total - index}</p>
                <p><b>Bike:</b> ${b.brand || '-'}</p>
                <p><b>Model:</b> ${b.model || '-'}</p>
                <p><b>Service:</b> ${b.service || '-'}</p>
                <p><b>Price:</b> ₹${b.price || 0}</p>
                <p><b>Date:</b> ${b.date || 'N/A'}</p>
            </div>
        `;
    });

    div.innerHTML = html;
})
.catch(err => {
    console.log("ERROR:", err);
});
