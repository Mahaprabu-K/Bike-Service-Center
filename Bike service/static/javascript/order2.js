window.onload = function () {

    let id = localStorage.getItem("id");
    let name = localStorage.getItem("service_name");
    let price = localStorage.getItem("price");
    let image = localStorage.getItem("image");

    console.log(id, name, price, image);

    if (!id) {
        console.log("No data found");
        return;
    }

    let imagePath = "" + image;

    let container = document.getElementById("serviceContainer2");

    container.innerHTML = `
        <div class="card" onclick="goToDetails(${id})">
            <img src="${imagePath}" class="img1">

            <div class="tag">
                <span>${name}</span>
                <span>₹${price}</span>
            </div>
        </div>
    `;
};

// 🔥 go to details page
function goToDetails(id) {
    window.location.href = `/details?name=${name}`;
}