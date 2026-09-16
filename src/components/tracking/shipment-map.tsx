"use client";

import { useEffect, useRef, useState } from "react";
import type { Map as LeafletMap, Marker, LatLngTuple } from "leaflet";
import "leaflet/dist/leaflet.css";

const locations: Record<string, LatLngTuple> = {
  yangon: [16.8409, 96.1735], mandalay: [21.9588, 96.0891],
  muse: [23.9869, 97.9040], myawaddy: [16.6891, 98.5089],
};
type Props = { origin: string; destination: string; gate: string; latitude: number | null; longitude: number | null };

export function ShipmentMap({ origin, destination, gate, latitude, longitude }: Props) {
  const container = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markerRef = useRef<Marker | null>(null);
  const leafletRef = useRef<typeof import("leaflet") | null>(null);
  const positionRef = useRef<LatLngTuple | null>(null);
  const [message, setMessage] = useState("Loading map…");
  const hasPosition = latitude !== null && longitude !== null && Number.isFinite(latitude) && Number.isFinite(longitude)
    && Math.abs(latitude) <= 90 && Math.abs(longitude) <= 180;
  useEffect(() => {
    positionRef.current = hasPosition ? [latitude!, longitude!] : null;
    const L = leafletRef.current, map = mapRef.current;
    if (!L || !map) return;
    if (!positionRef.current) { markerRef.current?.remove(); markerRef.current = null; return; }
    if (markerRef.current) markerRef.current.setLatLng(positionRef.current);
    else markerRef.current = addTruck(L, map, positionRef.current);
  }, [latitude, longitude, hasPosition]);
  useEffect(() => {
    let disposed = false;
    let observer: ResizeObserver | undefined;
    import("leaflet").then(L => {
      if (disposed || !container.current) return;
      const map = L.map(container.current, { scrollWheelZoom: false }).setView([20.5, 96.5], 6);
      mapRef.current = map;
      leafletRef.current = L;
      const tiles = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);
      tiles.on("tileerror", () => { if (!disposed) setMessage("Some map tiles could not load. Check your connection; saved coordinates remain available below."); });
      const points: LatLngTuple[] = [];
      for (const [label, name, color] of [["Origin", origin, "#2563eb"], ["Destination", destination, "#16a34a"], ["Gate", gate, "#d97706"]]) {
        const point = locations[name.trim().toLowerCase()];
        if (!point) continue;
        points.push(point);
        const popup = document.createElement("span");
        popup.textContent = `${label}: ${name} (approximate demo location)`;
        L.circleMarker(point, { radius: 8, color, fillOpacity: 0.8 }).addTo(map).bindPopup(popup);
      }
      if (positionRef.current) {
        const position = positionRef.current;
        points.push(position);
        markerRef.current = addTruck(L, map, position);
      }
      if (points.length) map.fitBounds(L.latLngBounds(points), { padding: [35,35], maxZoom: 11 });
      observer = new ResizeObserver(() => map.invalidateSize());
      observer.observe(container.current);
      setMessage("");
    }).catch(() => { if (!disposed) setMessage("The map could not load. Refresh to retry."); });
    return () => { disposed = true; observer?.disconnect(); mapRef.current?.remove(); mapRef.current = null; markerRef.current = null; leafletRef.current = null; };
  }, [origin, destination, gate]);
  return <section className="panel tracking-panel">
    <div className="panel-heading"><div><h2>Shipment map</h2><p className="panel-subtitle">Last reported location · Device or demo GPS</p></div><button type="button" className="button signout-button" onClick={() => mapRef.current?.setView(hasPosition ? [latitude!, longitude!] : [20.5,96.5], hasPosition ? 10 : 6)}> {hasPosition ? "Find truck" : "Myanmar view"}</button></div>
    <div ref={container} className="shipment-map" role="region" aria-label="Interactive shipment map" />
    <div className="map-caption"><p role="status">{message}</p><p>{hasPosition ? `Truck coordinates: ${latitude!.toFixed(5)}, ${longitude!.toFixed(5)}` : "No truck location reported yet."}</p><p>Blue: origin · Green: destination · Amber: gate. Known demo locations are approximate; unrecognized place names are not plotted. The truck moves when a new saved position arrives. Use Find truck to recenter.</p></div>
  </section>;
}

function addTruck(L: typeof import("leaflet"), map: LeafletMap, position: LatLngTuple) {
  return L.marker(position, { title: "Last reported truck position", icon: L.divIcon({
    className: "truck-map-marker", html: '<span aria-hidden="true">🚚</span>', iconSize: [38,38], iconAnchor: [19,19],
  }) }).addTo(map).bindPopup("Last reported truck position");
}
