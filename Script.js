var map = L.map('map').setView([14.3278, 120.9458], 17);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
   attribution: '© OpenStreetMap contributors'
}).addTo(map);

var marker = L.marker([14.3278, 120.9458]).addTo(map)
    .bindPopup('Villa Nicasia, Dasmarinas')
    .openPopup();

function onLocationFound(e) {
    var radius = Math.round(e.accuracy / 2);

    L.marker(e.latlng).addTo(map)
        .bindPopup("You are within " + radius + " meters of this point").openPopup();

    L.circle(e.latlng, radius).addTo(map);

    document.getElementById("User_Location").value = "Current Location Found";
}

function onLocationError(e) {
    alert("Location access denied or timed out: " + e.message);
}

map.on('locationfound', onLocationFound);
map.on('locationerror', onLocationError);
map.locate({
    setView: true, 
    maxZoom: 17, 
    enableHighAccuracy: true, 
    timeout: 10000 
});

