import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { Place } from "@/data/places";
import "leaflet/dist/leaflet.css";

// Fix default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const userIcon = new L.DivIcon({
  className: "",
  html: `<div style="width:20px;height:20px;border-radius:50%;background:hsl(174,62%,38%);border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);"></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

const ecoIcon = new L.DivIcon({
  className: "",
  html: `<div style="width:28px;height:28px;border-radius:50%;background:hsl(142,60%,40%);border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;font-size:14px;">🌿</div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

interface ExploreMapProps {
  places: Place[];
  userLocation: [number, number];
  onSelectPlace: (place: Place) => void;
  selectedPlace?: Place | null;
}

export default function ExploreMap({ places, userLocation, onSelectPlace, selectedPlace }: ExploreMapProps) {
  return (
    <MapContainer
      center={userLocation}
      zoom={13}
      className="w-full h-full min-h-[400px]"
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapUpdater center={userLocation} />

      <Marker position={userLocation} icon={userIcon}>
        <Popup>📍 You are here</Popup>
      </Marker>

      {places.map((place) => (
        <Marker
          key={place.id}
          position={[place.lat, place.lng]}
          icon={place.isEcoFriendly ? ecoIcon : undefined}
          eventHandlers={{ click: () => onSelectPlace(place) }}
        >
          <Popup>
            <strong>{place.name}</strong>
            <br />
            <span style={{ fontSize: 12 }}>{place.description.slice(0, 80)}...</span>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
