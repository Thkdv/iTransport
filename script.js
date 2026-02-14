var map = L.map('map').setView([14.3278, 120.9458], 17);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
   attribution: '© OpenStreetMap contributors'
}).addTo(map);

let pickupMarker = null;
let dropoffMarker = null;
let routeLine = null;

function onLocationFound(e) {
    if (pickupMarker) map.removeLayer(pickupMarker);
    pickupMarker = L.marker(e.latlng, {draggable: true}).addTo(map)
        .bindPopup("Pick-up Point").openPopup();
    document.getElementById("User_Location").value = "Current Location Found";
}

function drawSimpleRoute() {
    if (pickupMarker && dropoffMarker) {
        if (routeLine) map.removeLayer(routeLine);
        var coords = [pickupMarker.getLatLng(), dropoffMarker.getLatLng()];
        routeLine = L.polyline(coords, {color: '#ffffff', weight: 5, dashArray: '10, 10'}).addTo(map);
        map.fitBounds(routeLine.getBounds());
    }
}

// SEARCH BOX LOGIC
var geocoder = L.Control.geocoder({
    defaultMarkGeocode: false,
    placeholder: "Search for destination..."
})
.on('markgeocode', function(e) {
    var latlng = e.geocode.center;
    if (dropoffMarker) map.removeLayer(dropoffMarker);
    dropoffMarker = L.marker(latlng, {draggable: true}).addTo(map)
        .bindPopup(e.geocode.name).openPopup();
    document.getElementById("User_DropOff").value = e.geocode.name;
    drawSimpleRoute();
})
.addTo(map);

map.on('click', function(e) {
    if (!pickupMarker) {
        onLocationFound(e);
    } else if (!dropoffMarker) {
        dropoffMarker = L.marker(e.latlng, {draggable: true}).addTo(map)
            .bindPopup("Drop-off Point").openPopup();
        document.getElementById("User_DropOff").value = e.latlng.lat.toFixed(4) + ", " + e.latlng.lng.toFixed(4);
        drawSimpleRoute();
    }
});

function onLocationError(e) { alert("GPS Signal Weak: " + e.message); }
map.on('locationfound', onLocationFound);
map.on('locationerror', onLocationError);

map.locate({
    setView: true, 
    maxZoom: 17, 
    enableHighAccuracy: true,
    timeout: 60000,
    maximumAge: 0
});