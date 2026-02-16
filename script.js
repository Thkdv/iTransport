var map = L.map('map').setView([14.3278, 120.9458], 17);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
   attribution: '© OpenStreetMap contributors'
}).addTo(map);

let pickupMarker = null;
let dropoffMarker = null;
let routeLine = null;

async function updateAddressField(marker, inputId) {
    const latlng = marker.getLatLng();
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org{latlng.lat}&lon=${latlng.lng}`);
        const data = await response.json();
        const address = data.display_name.split(',').slice(0, 3).join(',');
        document.getElementById(inputId).value = address;
    } catch (error) {
        document.getElementById(inputId).value = `${latlng.lat.toFixed(4)}, ${latlng.lng.toFixed(4)}`;
    }
}

function drawSimpleRoute() {
    if (pickupMarker && dropoffMarker) {
        if (routeLine) map.removeLayer(routeLine);
        var coords = [pickupMarker.getLatLng(), dropoffMarker.getLatLng()];
        routeLine = L.polyline(coords, {
            color: '#3388ff',
            weight: 5, 
            dashArray: '10, 10'
        }).addTo(map);
        map.fitBounds(routeLine.getBounds(), { padding: [50, 50] });
    }
}

function setupMarkerEvents(marker, inputId) {
    marker.on('drag', drawSimpleRoute);
    marker.on('dragend', () => updateAddressField(marker, inputId));
}

function onLocationFound(e) {
    if (pickupMarker) map.removeLayer(pickupMarker);
    pickupMarker = L.marker(e.latlng, {draggable: true}).addTo(map)
        .bindPopup("Pick-up Point").openPopup();
    updateAddressField(pickupMarker, "User_Location");
    setupMarkerEvents(pickupMarker, "User_Location");
}

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
    setupMarkerEvents(dropoffMarker, "User_DropOff");
    drawSimpleRoute();
})
.addTo(map);

map.on('click', function(e) {
    if (!pickupMarker) {
        onLocationFound(e);
    } else if (!dropoffMarker) {
        dropoffMarker = L.marker(e.latlng, {draggable: true}).addTo(map)
            .bindPopup("Drop-off Point").openPopup();
        updateAddressField(dropoffMarker, "User_DropOff");
        setupMarkerEvents(dropoffMarker, "User_DropOff");
        drawSimpleRoute();
    }
});

function onLocationError(e) { alert("GPS Signal Weak: " + e.message); }
map.on('locationfound', onLocationFound);
map.on('locationerror', onLocationError);

map.locate({ setView: true, maxZoom: 17, enableHighAccuracy: true });