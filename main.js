//create map in leaflet and tie it to the div called 'theMap'
const map = L.map('theMap').setView([44.650627, -63.597140], 14);

//Recieves map data from Open Street Map. 
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);


// Create Bus Icon that can be used on the map 
const busIcon = L.icon({
    iconUrl: 'bus.png', 
    iconSize: [32, 32],  
    iconAnchor: [16, 16], 
    popupAnchor: [0, -16]  
});

// Function to fetch api data and create Markers on the map. 
async function routeGrab(){
    let response = await fetch('https://prog2700.onrender.com/hrmbuses');    
    let transitData = await response.json();
    // GeoJSON Feature to return information for GEOJSON function.  
    transitData = transitData.entity
    let transits = transitData.filter(transit => transit.vehicle.trip.routeId <= 10)
        .map(transit => {
            return {
                "type": "Feature",
                "geometry": {
                    "type": 'Point',
                    "coordinates": [transit.vehicle.position.longitude, transit.vehicle.position.latitude],
                    "bearing": transit.vehicle.position.bearing
                },
                "properties": {
                    "name": "buses",
                    "routeId": transit.vehicle.trip.routeId,
                },
            }
        });


        // Removes the existing layer of marker points.
        map.eachLayer(layer => {
            if (layer instanceof L.Marker) {
                map.removeLayer(layer);
            }
        });
    
        // GeoJSON Function to place markers on the map 
        L.geoJSON(transits, {
            pointToLayer: function (feature, latitudelongitude) {
                return L.marker(latitudelongitude, {icon: busIcon, rotationAngle: feature.geometry.bearing}).bindPopup(
                    `Route ID: ${feature.properties.routeId}`
                );        
            }
        }).addTo(map);
    }

// Calls the main function to then fetch the map api and add markers to the map. 
routeGrab();

// Refreshes every five seconds
setInterval(routeGrab, 5000);
