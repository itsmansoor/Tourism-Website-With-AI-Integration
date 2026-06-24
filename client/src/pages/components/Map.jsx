/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { getLatLng } from "../../utils/geoCode";
import { calculateDistance } from "../../utils/distanceCalc";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// ✅ FIX: Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const Map = ({ destinationName }) => {
  const [latLng, setLatLng] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [distance, setDistance] = useState(null);

  // Get destination coordinates
  useEffect(() => {
    const fetchDestinationLatLng = async () => {
      try {
        const coordinates = await getLatLng(destinationName);
        setLatLng(coordinates);
      } catch (err) {
        console.log("Geo error:", err);
      }
    };

    if (destinationName) {
      fetchDestinationLatLng();
    }
  }, [destinationName]);

  // Get user location
  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.log("Location error:", error.message);
      }
    );
  }, []);

  // Calculate distance
  useEffect(() => {
    if (latLng && userLocation) {
      const dist = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        latLng.lat,
        latLng.lng
      );
      setDistance(dist);
    }
  }, [latLng, userLocation]);

  if (!latLng || !userLocation) {
    return <p>Loading map and location...</p>;
  }

  return (
    <div className="w-full h-[400px]">
      <MapContainer
        center={[latLng.lat, latLng.lng]}
        zoom={10}
        scrollWheelZoom={false}
        className="h-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {/* Destination */}
        <Marker position={[latLng.lat, latLng.lng]}>
          <Popup>
            <b>{destinationName}</b>
          </Popup>
        </Marker>

        {/* User */}
        <Marker position={[userLocation.lat, userLocation.lng]}>
          <Popup>
            <b>Your Location</b>
          </Popup>
        </Marker>
      </MapContainer>

      <div className="mt-2 text-sm text-gray-700">
        🧭 You are{" "}
        <strong>{distance ? `${distance} km` : "calculating..."}</strong> away
        from <strong>{destinationName}</strong>
      </div>
    </div>
  );
};

export default Map;
