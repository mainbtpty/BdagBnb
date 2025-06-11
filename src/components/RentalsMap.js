
import React, { useState, useEffect } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

function RentalsMap({ locations, setHighLight }) {
  const [center, setCenter] = useState(null);

  // Load the Google Maps API
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyB5ww9KhIBVI61iv8gLls6smfG-u4I6CWk", // Replace with your actual Google Maps API key
  });

  // Calculate the center based on the average of latitudes and longitudes
  useEffect(() => {
    if (locations && locations.length > 0) {
      const avgLat =
        locations.reduce((sum, loc) => sum + loc.lat, 0) / locations.length;
      const avgLng =
        locations.reduce((sum, loc) => sum + loc.lng, 0) / locations.length;
      setCenter({ lat: avgLat, lng: avgLng });
    }
  }, [locations]);

  // Show a loading message until the API and center are ready
  if (!isLoaded || !center) {
    return <div>Loading...</div>;
  }

  // Render the map with markers
  return (
    <GoogleMap
      mapContainerStyle={{
        width: "50vw",
        height: "calc(100vh - 135px)",
      }}
      center={center}
      zoom={13}
      options={{
        disableDefaultUI: true,
      }}
    >
      {locations.map((coords, i) => (
        <Marker
          key={i}
          position={{ lat: coords.lat, lng: coords.lng }}
          onClick={() => setHighLight(i)}
        />
      ))}
    </GoogleMap>
  );
}

export default RentalsMap;