var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl).then(function(data) {  
  createFeatures(data.features);
});


// CREATE BASIC MAPS: LIGHT MAP AND SATELLITE MAP
function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY
  });

  var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "satellite-v9",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Light Map": lightmap,
    "Satellite": satellitemap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create myMap, giving it the lightmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5,
    layers: [lightmap, earthquakes]
  });

  // Create a layer control
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  })    
  .addTo(myMap);
}

// CREATE EARTHQUAKE FEATURES
function createFeatures(earthquakeData) {
  
  // For each feature create Popup leyend, size and color the marker
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3> Magnitude: " + feature.properties.mag +
      "</h3><hr><h3> Location: " + (feature.properties.place) + "</h3><hr><h3> Depth: "
      + (feature.geometry.coordinates[2])+ "</h3>");

      var magnitude = feature.properties.mag
      var depth = feature.geometry.coordinates[2]
      var longitude = feature.geometry.coordinates[0]
      var latitude = feature.geometry.coordinates[1]      

    // Conditional coloring of circles based on depth
      var color = "";
      if(depth > 25){ color = "red";}
      else if (depth > 15){ color = "yellow";}
      else{ color = "green";}

    // Size the market based on the magnitude of the earthquake
    var markerOptions = {
      fillOpacity: 0.75,
      color: "white",
      fillColor: color,
      radius : magnitude * 200
    };
    
    L.geoJSON(earthquakeData,{
      pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, markerOptions);
      }
    })
  }

  // Create a GeoJSON layer 
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature
  });  

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}
