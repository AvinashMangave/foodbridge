import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Utensils, MapPin, Clock, ArrowRight } from 'lucide-react';

// Custom sleek marker for FoodBridge
const createCustomMarker = (category) => {
  return L.divIcon({
    className: 'custom-food-marker',
    html: `
      <div style="
        background: linear-gradient(135deg, #16a34a, #15803d);
        width: 38px;
        height: 38px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 14px rgba(22, 163, 74, 0.4);
        border: 2px solid #ffffff;
      ">
        <span style="
          transform: rotate(45deg);
          color: white;
          font-size: 15px;
          font-weight: bold;
        ">🍲</span>
      </div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    popupAnchor: [0, -38]
  });
};

const defaultCenter = [28.6139, 77.2090]; // Central default coordinates

const DonationMap = ({ donations = [], onSelectDonation }) => {
  return (
    <div className="w-full h-[520px] rounded-3xl overflow-hidden border border-slate-200 shadow-lg relative">
      <MapContainer
        center={defaultCenter}
        zoom={12}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {donations.map((d) => {
          const lat = d.location?.lat || 28.6139;
          const lng = d.location?.lng || 77.2090;

          return (
            <Marker
              key={d._id || d.id}
              position={[lat, lng]}
              icon={createCustomMarker(d.category)}
            >
              <Popup className="foodbridge-popup">
                <div className="w-60 p-1 text-slate-800">
                  <img
                    src={d.imageUrl}
                    alt={d.title}
                    className="w-full h-28 object-cover rounded-xl mb-2"
                  />
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wide">
                    {d.category}
                  </span>
                  <h4 className="font-bold text-sm text-slate-900 mt-1 line-clamp-1">
                    {d.title}
                  </h4>
                  <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <span className="font-bold text-emerald-700">{d.quantity} {d.unit}</span>
                    <span>• {d.servingsEstimate || Math.round(d.quantity * 2.5)} meals</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 truncate">
                    📍 {d.pickupAddress}
                  </p>
                  <button
                    onClick={() => onSelectDonation && onSelectDonation(d)}
                    className="w-full mt-3 py-1.5 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1"
                  >
                    <span>View / Claim</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Floating Info Pill */}
      <div className="absolute top-4 right-4 z-[400] bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-md border border-slate-200 text-xs text-slate-700 flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
        <span className="font-bold">{donations.length} surplus food locations pinned</span>
      </div>
    </div>
  );
};

export default DonationMap;
