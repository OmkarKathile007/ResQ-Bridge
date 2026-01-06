

"use client";

import React, { useState, useEffect } from "react";
import { 
  User, HeartHandshake, Recycle, MapPin, Phone, Check, ChevronDown, 
  AlertTriangle, Building, Mail, Clock, Calendar, Utensils, Package, 
  Image as ImageIcon, TrendingUp, Users, Leaf, ArrowRight 
} from 'lucide-react';
import { useAuth } from "@/context/AuthContext";

// --- Reusable UI Components ---
const Loader = () => (
  <div className="flex flex-col items-center justify-center h-96 text-slate-500 animate-in fade-in duration-500">
    <div className="relative">
      <div className="h-16 w-16 rounded-full border-4 border-slate-200 border-t-orange-500 animate-spin"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <HeartHandshake size={24} className="text-orange-500" />
      </div>
    </div>
    <p className="mt-6 text-lg font-medium text-slate-600">Syncing Network Data...</p>
  </div>
);

const ErrorDisplay = ({ message }) => (
  <div className="flex flex-col items-center justify-center h-96 bg-red-50/50 border border-red-100 rounded-3xl p-8 text-center animate-in zoom-in-95 duration-300">
    <div className="bg-red-100 p-4 rounded-full mb-4">
      <AlertTriangle className="h-10 w-10 text-red-500" />
    </div>
    <h3 className="text-2xl font-bold text-slate-800 mb-2">Connection Issue</h3>
    <p className="text-slate-500 max-w-md mx-auto mb-6">{message}</p>
    <button onClick={() => window.location.reload()} className="px-6 py-2 bg-white border border-slate-200 shadow-sm rounded-full text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
      Try Again
    </button>
  </div>
);

const EmptyState = ({ title, message, icon: Icon }) => (
    <div className="flex flex-col items-center justify-center h-96 bg-slate-50/50 border border-dashed border-slate-200 rounded-3xl p-8 text-center">
        <div className="bg-white p-4 rounded-full shadow-sm mb-4">
            <Icon className="h-10 w-10 text-slate-400" />
        </div>
        <h3 className="text-xl font-bold text-slate-700 mb-2">{title}</h3>
        <p className="text-slate-500 max-w-xs mx-auto">{message}</p>
    </div>
);

const StatCard = ({ label, value, icon: Icon, color, trend }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{label}</p>
        <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon size={24} className="text-white" />
      </div>
    </div>
    <div className="mt-4 flex items-center gap-2 text-sm">
      <span className="text-emerald-500 font-semibold flex items-center gap-1">
        <TrendingUp size={14} /> {trend}
      </span>
      <span className="text-slate-400">vs last month</span>
    </div>
  </div>
);

// --- Main Dashboard Component ---

const NGODashboard = () => {
  const [activeTab, setActiveTab] = useState("donors");
  const [expandedIndices, setExpandedIndices] = useState({});
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get Token from Context
  const { token, isLoading: authLoading } = useAuth();

  const stats = {
    donors: { value: "1,248", trend: "+12%" },
    volunteers: { value: "86", trend: "+5%" },
    impact: { value: "14.2k", trend: "+18%" } 
  };

  useEffect(() => {
    // Wait for auth to load before fetching
    if (authLoading) return;

    const fetchDonors = async () => {
      setLoading(true);
      setError(null);
      try {
        const headers = {};
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch("http://localhost:8080/api/donors", {
            headers: headers
        });

        if (!response.ok) {
            if (response.status === 403) throw new Error("Access Denied: Please Login.");
            throw new Error("Unable to connect to the donor network.");
        }
        
        const data = await response.json();
        const sorted = Array.isArray(data)
          ? [...data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          : [];
        setDonors(sorted);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (activeTab === "donors") {
      fetchDonors();
    }
  }, [activeTab, token, authLoading]);

  useEffect(() => {
    setExpandedIndices({});
  }, [activeTab]);

  const toggleExpand = (tab, index) => {
    setExpandedIndices(prev => ({
      ...prev,
      [tab]: prev[tab] === index ? null : index,
    }));
  };

  // Mock Data
  const volunteers = [
    { name: "Aarav Sharma", contact: "+91 98765 43210", location: "Mumbai, MH", skills: "Logistics", availability: "Weekends", rating: 4.8 },
    { name: "Priya Patel", contact: "+91 87654 32109", location: "Delhi, DL", skills: "Social Media", availability: "Weekdays", rating: 4.9 },
  ];

  const biogasPlants = [
    { name: "Green Energy Biogas", location: "Pune, MH", capacity: "150 tons", status: "Operational", contact: "manager1@greenenergy.com" },
  ];

  if (authLoading) return <Loader />;

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-900 font-sans selection:bg-orange-100 selection:text-orange-900">
      <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-orange-500 p-2 rounded-lg"><Leaf className="text-white" size={24} /></div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-800">NGO<span className="text-orange-500">Connect</span></h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full text-sm font-medium text-slate-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              System Operational
            </div>
            <div className="h-10 w-10 rounded-full bg-slate-200 overflow-hidden border-2 border-white shadow-sm">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Profile" />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 lg:p-8 space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-800">Dashboard Overview</h2>
            <p className="text-slate-500 mt-1">Manage your network, track donations, and monitor impact.</p>
          </div>
          <div className="flex gap-2">
             <button className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors shadow-sm">Export Data</button>
             <button className="px-5 py-2.5 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-colors shadow-lg shadow-orange-200">+ New Campaign</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard label="Total Donations" value={stats.donors.value} trend={stats.donors.trend} icon={Package} color="bg-blue-500" />
            <StatCard label="Active Volunteers" value={stats.volunteers.value} trend={stats.volunteers.trend} icon={Users} color="bg-emerald-500" />
            <StatCard label="Food Rescued (kg)" value={stats.impact.value} trend={stats.impact.trend} icon={Recycle} color="bg-orange-500" />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-1.5 flex flex-wrap gap-1">
            {[
              { id: "donors", label: "Live Donations", icon: Package },
              { id: "volunteers", label: "Volunteer Network", icon: HeartHandshake },
              { id: "biogasPlants", label: "Biogas Facilities", icon: Recycle },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                  activeTab === tab.id ? "bg-slate-800 text-white shadow-md" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <tab.icon size={18} className={activeTab === tab.id ? "text-orange-400" : "text-slate-400"} />
                {tab.label}
              </button>
            ))}
        </div>

        <div className="min-h-[500px]">
           {activeTab === "donors" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                 {loading ? <Loader /> : error ? <ErrorDisplay message={error} /> : (
                    donors.length > 0 ? (
                      <div className="grid grid-cols-1 gap-4">
                        {donors.map((donor, index) => (
                          <DonorCard key={donor._id || index} donor={donor} index={index} expanded={expandedIndices.donors === index} onExpand={() => toggleExpand('donors', index)} />
                        ))}
                      </div>
                    ) : <EmptyState title="No Active Donations" message="Waiting for new donation requests to arrive." icon={Package} />
                 )}
              </div>
           )}

           {activeTab === "volunteers" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                 {volunteers.map((volunteer, index) => (
                    <VolunteerCard key={index} volunteer={volunteer} expanded={expandedIndices.volunteers === index} onExpand={() => toggleExpand('volunteers', index)} />
                 ))}
              </div>
           )}

            {activeTab === "biogasPlants" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                 {biogasPlants.map((plant, index) => (
                    <BiogasCard key={index} plant={plant} expanded={expandedIndices.biogas === index} onExpand={() => toggleExpand('biogas', index)} />
                 ))}
              </div>
           )}
        </div>
      </main>
    </div>
  );
};

// --- Sub-Components (DonorCard, VolunteerCard, BiogasCard) ---
// Copy the same sub-components from your previous request, 
// they are already compatible with JSX. Just remove any ": any" if you added them manually.

const DonorCard = ({ donor, expanded, onExpand }) => (
  <div className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${expanded ? 'border-orange-200 shadow-xl ring-1 ring-orange-100' : 'border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200'}`}>
    <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-start gap-4">
        <div className={`p-3.5 rounded-2xl ${expanded ? 'bg-orange-100' : 'bg-slate-100'} transition-colors`}>
          <User className={expanded ? 'text-orange-600' : 'text-slate-500'} size={24} />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
             <h3 className="text-lg font-bold text-slate-800">{donor.donorName || "Anonymous Donor"}</h3>
             {expanded && <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-bold uppercase rounded-full tracking-wide">New</span>}
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-500">
             <span className="flex items-center gap-1.5"><Phone size={14} className="text-slate-400" /> {donor.contactNumber || "N/A"}</span>
             <span className="flex items-center gap-1.5"><MapPin size={14} className="text-slate-400" /> {donor.location?.address || "No Address"}</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-3 pl-16 md:pl-0">
         <button onClick={onExpand} className={`p-2.5 rounded-xl transition-colors ${expanded ? 'bg-slate-100 text-slate-600' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}>
            <ChevronDown size={20} className={`transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} />
         </button>
         <button className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition-colors text-sm font-semibold shadow-lg shadow-slate-200 flex items-center gap-2">
            Accept <ArrowRight size={16} />
         </button>
      </div>
    </div>

    {/* Expanded Content */}
    <div className={`grid transition-[grid-template-rows] duration-300 ease-out ${expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
      <div className="overflow-hidden">
        <div className="p-5 pt-0 border-t border-slate-100 bg-slate-50/30">
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
              
              {/* Details Column */}
              <div className="col-span-1 lg:col-span-2 space-y-4">
                 <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Donation Manifest</h4>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                       <div className="flex items-center gap-2 text-slate-500 mb-1"><Utensils size={14} /> Type</div>
                       <div className="font-semibold text-slate-800">{donor.donation?.foodType || 'Mixed'}</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                       <div className="flex items-center gap-2 text-slate-500 mb-1"><Package size={14} /> Quantity</div>
                       <div className="font-semibold text-slate-800">{donor.donation?.quantity || 'Unknown'}</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                       <div className="flex items-center gap-2 text-slate-500 mb-1"><Calendar size={14} /> Time</div>
                       <div className="font-semibold text-slate-800">{new Date(donor.createdAt).toLocaleDateString()}</div>
                    </div>
                 </div>
                 
                 <div className="flex gap-3 mt-4">
                     <button 
                        onClick={() => window.open(`https://maps.google.com/?q=${donor.location?.coordinates?.latitude},${donor.location?.coordinates?.longitude}`)}
                        disabled={!donor.location?.coordinates?.latitude}
                        className="flex-1 px-4 py-3 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                     >
                        <MapPin size={18} className="text-orange-500" /> Open Maps
                     </button>
                     <button className="flex-1 px-4 py-3 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                        <Phone size={18} className="text-emerald-500" /> Call Donor
                     </button>
                 </div>
              </div>

              {/* Image Column */}
              <div className="col-span-1">
                 <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Verification</h4>
                 <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-200 relative border border-slate-200">
                    {donor.donation?.foodImage?.image ? (
                        <img 
                           src={`data:${donor.donation.foodImage.contentType};base64,${donor.donation.foodImage.image}`} 
                           alt="Donation" 
                           className="w-full h-full object-cover" 
                        />
                    ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                            <ImageIcon size={32} />
                            <span className="text-xs font-medium mt-2">No Image</span>
                        </div>
                    )}
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  </div>
);

const VolunteerCard = ({ volunteer, expanded, onExpand }) => (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-all">
        <div className="flex justify-between items-start mb-4">
            <div className="flex gap-4">
                <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-lg">
                    {volunteer.name.charAt(0)}
                </div>
                <div>
                    <h3 className="text-lg font-bold text-slate-800">{volunteer.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-amber-500">
                         {[...Array(5)].map((_,i) => <span key={i} className={i < Math.floor(volunteer.rating) ? "fill-current" : "text-slate-200"}>★</span>)}
                         <span className="text-slate-400 ml-1 text-xs">({volunteer.rating})</span>
                    </div>
                </div>
            </div>
            <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full">{volunteer.availability}</span>
        </div>
        
        <div className="space-y-3 mb-5">
            <div className="flex items-center gap-3 text-sm text-slate-600">
                <MapPin size={16} className="text-slate-400" /> {volunteer.location}
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-600">
                <Check size={16} className="text-slate-400" /> {volunteer.skills}
            </div>
        </div>

        <button onClick={onExpand} className="w-full py-2.5 border border-slate-200 rounded-xl text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-colors">
            {expanded ? "Hide Details" : "View Profile"}
        </button>

        {expanded && (
            <div className="mt-4 pt-4 border-t border-slate-100 animate-in slide-in-from-top-2 duration-200">
                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl">
                    <span className="text-sm font-medium text-slate-700">{volunteer.contact}</span>
                    <button className="p-2 bg-white shadow-sm rounded-lg text-emerald-600 hover:text-emerald-700">
                        <Phone size={16} />
                    </button>
                </div>
            </div>
        )}
    </div>
);

const BiogasCard = ({ plant }) => (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:border-orange-200 transition-colors group">
        <div className="flex items-center justify-between mb-6">
            <div className="p-3 bg-orange-50 text-orange-600 rounded-xl group-hover:bg-orange-500 group-hover:text-white transition-colors">
                <Recycle size={24} />
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${plant.status === 'Operational' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                {plant.status}
            </span>
        </div>
        
        <h3 className="text-xl font-bold text-slate-800 mb-1">{plant.name}</h3>
        <p className="text-slate-500 text-sm mb-6 flex items-center gap-1"><MapPin size={14}/> {plant.location}</p>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-50 p-3 rounded-xl">
                <p className="text-xs text-slate-400 uppercase font-bold">Capacity</p>
                <p className="font-semibold text-slate-700">{plant.capacity}</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl">
                <p className="text-xs text-slate-400 uppercase font-bold">Load</p>
                <p className="font-semibold text-slate-700">85%</p>
            </div>
        </div>

        <button className="w-full py-3 bg-slate-900 text-white rounded-xl font-semibold text-sm hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200">
            Request Processing
        </button>
    </div>
);

export default NGODashboard;