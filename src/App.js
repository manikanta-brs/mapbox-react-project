import React, { useEffect } from "react";
import mapboxgl from "mapbox-gl"; // Import Mapbox GL
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder"; // Import Geocoder
import "mapbox-gl/dist/mapbox-gl.css"; // Import Mapbox GL CSS
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css"; // Import Geocoder CSS
import "./App.css";
import "./styles.css";

function App() {
  useEffect(() => {
    // Set your Mapbox access token
    mapboxgl.accessToken =
      "pk.eyJ1IjoicGFyaXNyaSIsImEiOiJja2ppNXpmaHUxNmIwMnpsbzd5YzczM2Q1In0.8VJaqwqZ_zh8qyeAuqWQgw";

    // Initialize the map
    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v11", // Map style
      center: [80.18536880746353, 16.501575031841256], // Map center coordinates
      zoom: 13, // Initial zoom level
    });

    // Add the geocoder (search box)
    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      placeholder: "Search any place on the planet",
    });
    document.getElementById("geocoder").appendChild(geocoder.onAdd(map));

    // Add geolocation control to track user location
    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true,
    });
    map.addControl(geolocate);
    map.on("load", () => geolocate.trigger());

    // Display geographical information on mouse move
    map.on("mousemove", (e) => {
      document.getElementById("info").innerHTML =
        `<p>Geographical information</p>` +
        JSON.stringify(e.lngLat.wrap(), null, 2);
    });

    // Add zoom, rotation, and fullscreen controls
    map.addControl(new mapboxgl.NavigationControl());
    map.addControl(new mapboxgl.FullscreenControl());

    // Add a draggable marker
    const marker = new mapboxgl.Marker({ draggable: true })
      .setLngLat([80.18536880746353, 16.501575031841256]) // Initial marker position
      .addTo(map);

    // Display marker coordinates on drag end
    function onDragEnd() {
      const lngLat = marker.getLngLat();
      const coordinates = document.getElementById("coordinates");
      coordinates.style.display = "block";
      coordinates.innerHTML = `Longitude: ${lngLat.lng}<br />Latitude: ${lngLat.lat}`;
    }
    marker.on("dragend", onDragEnd);

    // Layer switching functionality
    const layerList = document.getElementById("menu");
    const inputs = layerList.getElementsByTagName("input");

    function switchLayer(layer) {
      const layerId = layer.target.id;
      map.setStyle("mapbox://styles/mapbox/" + layerId);
    }

    for (let i = 0; i < inputs.length; i++) {
      inputs[i].onclick = switchLayer;
    }
  }, []);

  return (
    <div className="App">
      <main role="main" className="pt-5">
        {/* Map Container */}
        <div id="map" style={{ height: "500px", width: "100%" }} />

        {/* Geocoder (Search) */}
        <div id="geocoder" className="geocoder" />

        {/* Mousemove Information */}
        <div
          id="info"
          style={{
            position: "absolute",
            bottom: "10px",
            left: "10px",
            background: "#fff",
            padding: "10px",
          }}
        />

        {/* Coordinates for Marker */}
        <div
          id="coordinates"
          style={{
            display: "none",
            position: "absolute",
            top: "10px",
            right: "10px",
            background: "#fff",
            padding: "10px",
          }}
        />

        {/* Layer Selection Menu */}
        <div
          id="menu"
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            background: "#fff",
            padding: "10px",
          }}
        >
          <input id="streets-v11" type="radio" name="rtoggle" defaultChecked />
          <label htmlFor="streets-v11">Streets</label>
          <input id="light-v10" type="radio" name="rtoggle" />
          <label htmlFor="light-v10">Light</label>
          <input id="dark-v10" type="radio" name="rtoggle" />
          <label htmlFor="dark-v10">Dark</label>
          <input id="outdoors-v11" type="radio" name="rtoggle" />
          <label htmlFor="outdoors-v11">Outdoors</label>
          <input id="satellite-v9" type="radio" name="rtoggle" />
          <label htmlFor="satellite-v9">Satellite</label>
        </div>
      </main>
    </div>
  );
}

export default App;
