// Define the GeoJSON data as a JavaScript object

// const url = "http://localhost:3000/api/incident/get-H3?layout=1&limit=300"
const url = "http://localhost:3001/api/feature/list"
const data = await fetch(url)
  .then(value => value.json())
  .then(data => data);


console.log("==> data", data);
// Initialize the Leaflet map
const map = L.map('map')
  .setView(
    [47.954586856562486, 34.91509533137332],
    15);

// Add a tile layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  minZoom: 4,
  maxZoom: 11,
  name: 'Carto Light',
  // attribution: 'Map data &copy; OpenStreetMap contributors'
}).addTo(map);

var myStyle = {
  "color": "rgba(53,136,226,0.87)",
  "weight": 1,
  "opacity": 0.65
};

// Add the GeoJSON data to the map
L.geoJSON(data, {
  style: myStyle,
  onEachFeature: onHexagonClick

} ).addTo(map);

function onHexagonClick(feature, layer) {
  if (feature.properties && feature.properties.hexCount) {
    layer.bindPopup("Count Of Incidents: " + feature.properties.hexCount);
  }
}

// ***********************************************************************

// // Define the car locations as an array of [latitude, longitude] pairs
// const carLocations = [
//   [51.5074, -0.1278],
//   [51.5074, -0.1278],
//   [51.5074, -0.1278],
//   [51.5074, -0.1278],
//   [51.5074, -0.1278],
//   [48.8566, 2.3522],
//   [48.8566, 2.3522],
//   [40.7128, -74.0060],
//   [40.7128, -74.0060],
//   [37.7749, -122.4194]
// ];
//
// // Define the hexagon resolution (the number of hexagons at the finest resolution)
// const hexResolution = 7;
//
// // Create an empty object to store the car counts for each hexagon
// const hexCarCounts = {};
//
// // Loop over the car locations and add each one to the appropriate hexagon
// for (const carLocation of carLocations) {
//   const hexId = h3.geoToH3(carLocation[0], carLocation[1], hexResolution);
//   if (!hexCarCounts[hexId]) {
//     hexCarCounts[hexId] = 1;
//   } else {
//     hexCarCounts[hexId]++;
//   }
// }
//
// // Create an array of GeoJSON features representing each hexagon and its car count
// const hexFeatures = Object.keys(hexCarCounts).map(hexId => {
//   const hexBoundary = h3.h3ToGeoBoundary(hexId);
//   const hexCenter = h3.h3ToGeo(hexId);
//   return {
//     type: 'Feature',
//     geometry: {
//       type: 'Polygon',
//       coordinates: [[...hexBoundary, hexBoundary[0]]]
//     },
//     properties: {
//       carCount: hexCarCounts[hexId],
//       center: hexCenter
//     }
//   };
// });
//
// // Initialize the Leaflet map
// const map = L.map('map').setView([51.5074, -0.1278], 13);
//
// // Add a tile layer to the map
// L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//   attribution: 'Map data &copy; OpenStreetMap contributors'
// }).addTo(map);
//
// // Define a function that creates a popup for each hexagon when it is clicked
// function onHexagonClick(feature, layer) {
//   if (feature.properties && feature.properties.carCount) {
//     layer.bindPopup(`Number of cars: ${feature.properties.carCount}`);
//   }
// }
//
// // Add the GeoJSON features to the map as a Leaflet layer with click events
// L.geoJSON(hexFeatures, {
//   onEachFeature: onHexagonClick
// }).addTo(map);
