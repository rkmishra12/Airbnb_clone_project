// Step 1: Initialize the map
let map = L.map('map').setView([ coordinates[1] , coordinates[0] ],9);

// Step 2: Add OpenStreetMap tile layer
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '© OpenStreetMap'
}).addTo(map);

const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

let marker = L.marker([coordinates[1],coordinates[0]], { icon: redIcon }).addTo(map);

marker.bindPopup("You'll be live here !").openPopup();
