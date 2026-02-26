import { useEffect, useRef } from "react";
import L from "leaflet";
import { Place } from "@/data/places";
import "leaflet/dist/leaflet.css";

const defaultIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
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

interface ExploreMapProps {
  places: Place[];
  userLocation: [number, number];
  onSelectPlace: (place: Place) => void;
  selectedPlace?: Place | null;
}

export default function ExploreMap({ places, userLocation, onSelectPlace }: ExploreMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: userLocation,
      zoom: 13,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    markersLayerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      markersLayerRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !markersLayerRef.current) return;

    const map = mapRef.current;
    const markersLayer = markersLayerRef.current;

    markersLayer.clearLayers();
    map.setView(userLocation, map.getZoom());

    L.marker(userLocation, { icon: userIcon })
      .bindPopup("📍 You are here")
      .addTo(markersLayer);

    places.forEach((place) => {
      const marker = L.marker([place.lat, place.lng], {
        icon: place.isEcoFriendly ? ecoIcon : defaultIcon,
      }).addTo(markersLayer);

      marker.bindPopup(`<strong>${place.name}</strong><br/><span style="font-size:12px">${place.description.slice(0, 80)}...</span>`);
      marker.on("click", () => onSelectPlace(place));
    });
  }, [places, userLocation, onSelectPlace]);

  return <div ref={mapContainerRef} className="w-full h-full min-h-[400px]" aria-label="Map view" />;
}
