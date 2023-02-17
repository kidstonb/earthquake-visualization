// geojson url 
// M4.5+ in the last 7 days, 
// https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php
const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson";

const dataPromise = d3.json(url);
console.log("Data Promise: ", dataPromise);

// Check the data in browser console
d3.json(url).then(function(data){
    console.log(data.features[0]);
    createMarkers(data);
    
});
function createMap(earthquake){
// base tile layer of map
// var baseMaps = {
//     "basic": basicBackground
// };

// leaflet map
var map = L.map("map",{
    // center: [],
    // zoom: 0.5,
    layers: [earthquake]
}).setView([20, -0.1], 2);

// tile layer: basic openstreetmap 
var basicBackground = L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
    maxZoom: 6
}).addTo(map);

// create the legend 
var depthLegend = L.control({ position: "bottomright" });
depthLegend.onAdd = function(map) {
  var div = L.DomUtil.create("div", "info legend");
  var colourList = ['#ffccff','#ff99ff','#ff66ff','#ff00ff','#cc00cc','#660066'];
  var depthList = ['0 - 20','21 - 50','51 - 100','101 - 300','301 - 500','500+'];
  var labels = ["<h1>Earthquake depth [km]</h1>"];
  var depths = ['0','20','50','100','300','500']
  for (var i = 0; i < colourList.length; i++) {
    // div.innerHTML += '<i style="background:' + colourList[i] + '"></i> ' + depthList[i] + '<br>';//(depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
    labels.push("<li style=\"background-color: " + colourList[i] + "\"></li>" + depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+'));
  }
  console.log(labels);
  div.innerHTML = labels.join('');
  console.log(div.innerHTML);
  return div;
};
// document.querySelector(".legend").innerHTML = [
//   "<p>Updated: " + moment.unix(time).format("h:mm:ss A") + "</p>",
//   "<p class='out-of-order'>Out of Order Stations: " + stationCount.OUT_OF_ORDER + "</p>",
//   "<p class='coming-soon'>Stations Coming Soon: " + stationCount.COMING_SOON + "</p>",
//   "<p class='empty'>Empty Stations: " + stationCount.EMPTY + "</p>",
//   "<p class='low'>Low Stations: " + stationCount.LOW + "</p>",
//   "<p class='healthy'>Healthy Stations: " + stationCount.NORMAL + "</p>"
// ].join("");
depthLegend.addTo(map);

}



// function to select colour based on earthquake depth [km]
function getColour(depth) {
  return depth > 500 ? '#660066':
  depth > 300? '#cc00cc' :
  depth > 100? '#ff00ff' :
  depth > 50? '#ff66ff' :
  depth > 20 ? '#ff99ff':
  depth > 0 ? '#ffccff' :
  '#660033';
  }

// create markers with a function
function createMarkers(data) {
    // array = [];
    markerArray = [];

    for (var i = 0; i < data.features.length; i++) {
    var coordinates = data.features[i].geometry.coordinates;
    var properties = data.features[i].properties;

    if (coordinates) {
        // array.push([coordinates[1], coordinates[0]]);
        // var Marker = L.marker([coordinates[1], coordinates[0]])
        var circleColour = getColour(coordinates[2]);
        var circle = L.circle([coordinates[1], coordinates[0]], {
            color: 'black',// circleColour,   
            weight: 1,        
            fillColor: circleColour, 
            fillOpacity: 0.6,
            radius: properties.mag*30000 
        })
      .bindPopup("<h3>" + properties.place + "<h3><h3>Magnitude: " + properties.mag + "<h3><h3>Depth: " + coordinates[2] + " km</h3>");
      // .addTo(map);
        // markerArray.push(Marker);
        markerArray.push(circle);
    }
    }
    // console.log(array);
    // console.log(coordinates[2]);

    // pass markers to the map
    createMap(L.layerGroup(markerArray));

}


