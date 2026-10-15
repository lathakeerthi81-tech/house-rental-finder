
const houseForm = document.getElementById("houseForm");
const storageKey = "rentalHouses";

// Create a house card
function createHouseCard(house) {
    const card = document.createElement("div");
    card.className = "house-card";

    const photo = document.createElement("img");
    photo.src = house.image;
    photo.alt = house.name;
    photo.style.width = "100%";
    photo.style.height = "200px";
    photo.style.objectFit = "cover";

    const title = document.createElement("h3");
    title.textContent = house.name;

    const place = document.createElement("p");
    place.textContent = "📍 " + house.location;

    const rooms = document.createElement("p");
    rooms.textContent = "🛏️ " + house.bedrooms + " Bedrooms";

    const price = document.createElement("h3");
    price.textContent =
        "₹" + Number(house.rent).toLocaleString("en-IN") +
        " / month";

    const contact = document.createElement("a");
    contact.textContent = "📞 Contact Owner";
    contact.href = "tel:" + house.phone;
    contact.style.display = "inline-block";
    contact.style.margin = "10px";
    contact.style.padding = "10px";
    contact.style.backgroundColor = "#145a32";
    contact.style.color = "white";
    contact.style.textDecoration = "none";
    contact.style.borderRadius = "5px";

    card.append(photo, title, place, rooms, price, contact);

    return card;
}

// Get saved houses
function getSavedHouses() {
    try {
        return JSON.parse(localStorage.getItem(storageKey)) || [];
    } catch (error) {
        return [];
    }
}

// Display saved houses when the website opens
function loadSavedHouses() {
    const housesContainer = document.querySelector(".houses");

    getSavedHouses().forEach(function (house) {
        housesContainer.appendChild(createHouseCard(house));
    });
}

// Search houses by location
function searchHouses() {
    const location = document.getElementById("locationInput")
        .value.trim().toLowerCase();

    const houses = document.querySelectorAll(".house-card");
    let found = 0;

    houses.forEach(function (house) {
        const place = house.querySelector("p");

        const matches =
            location === "" ||
            (place && place.textContent.toLowerCase().includes(location));

        house.style.display = matches ? "" : "none";

        if (matches) found++;
    });

    let message = document.getElementById("noResults");

    if (!message) {
        message = document.createElement("p");
        message.id = "noResults";
        message.style.textAlign = "center";
        document.querySelector(".houses").before(message);
    }

    message.textContent =
        found === 0 ? "No houses found in this location." : "";
}

// Add and save a new house
houseForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("houseName").value.trim();
    const location = document.getElementById("houseLocation").value.trim();
    const rent = Number(document.getElementById("houseRent").value);
    const bedrooms = Number(document.getElementById("houseBedrooms").value);
    const imageFile = document.getElementById("houseImage").files[0];
    const phone = document.getElementById("ownerPhone").value.trim();

    if (
        !name || !location || !imageFile ||
        rent <= 0 || bedrooms <= 0 ||
        !/^[0-9]{10}$/.test(phone)
    ) {
        alert("Enter valid details and a 10-digit phone number.");
        return;
    }

    if (!imageFile.type.startsWith("image/")) {
        alert("Please select an image file.");
        return;
    }

    const reader = new FileReader();

    reader.onload = function () {
        const house = {
            name: name,
            location: location,
            rent: rent,
            bedrooms: bedrooms,
            image: reader.result,
            phone: phone
        };

        const savedHouses = getSavedHouses();
        savedHouses.push(house);

        try {
            localStorage.setItem(storageKey, JSON.stringify(savedHouses));

            document.querySelector(".houses")
                .appendChild(createHouseCard(house));

            houseForm.reset();
            alert("House saved successfully!");

        } catch (error) {
            alert(
                "Could not save this house. The photo may be too large. " +
                "Try a smaller image."
            );
        }
    };

    reader.onerror = function () {
        alert("Could not read the photo. Please try another image.");
    };

    reader.readAsDataURL(imageFile);
});

// Load saved listings when the page opens
loadSavedHouses();
