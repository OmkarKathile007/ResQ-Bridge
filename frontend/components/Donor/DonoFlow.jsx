

"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { 
  Utensils, 
  MapPin, 
  ChevronRight, 
  UploadCloud, 
  CheckCircle2, 
  AlertCircle,
  Leaf,
  Beef,
  User,
  PartyPopper
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

// --- Visual Components ---
const StepIndicator = ({ step, currentStep, label }) => {
  const isActive = step === currentStep;
  const isCompleted = step < currentStep;

  return (
    <div className="flex items-center gap-3">
      <div 
        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 border-2 ${
          isActive 
            ? "bg-stone-900 border-stone-900 text-white" 
            : isCompleted 
              ? "bg-orange-500 border-orange-500 text-white" 
              : "bg-transparent border-stone-200 text-stone-300"
        }`}
      >
        {isCompleted ? <CheckCircle2 size={18} /> : step}
      </div>
      <div className="hidden sm:block">
        <p className={`text-xs font-bold uppercase tracking-widest ${isActive ? "text-stone-900" : "text-stone-400"}`}>
          Step 0{step}
        </p>
        <p className={`text-sm font-medium ${isActive ? "text-stone-700" : "text-stone-300"}`}>
          {label}
        </p>
      </div>
    </div>
  );
};

export default function DonorFlow() {
  const [donorName, setDonorName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [donorType, setDonorType] = useState("individual");

  const [foodFor, setFoodFor] = useState("");
  const [foodType, setFoodType] = useState("veg");
  const [quantity, setQuantity] = useState(">5");
  const [foodImage, setFoodImage] = useState(null);

  const [address, setAddress] = useState("");
  const [location, setLocation] = useState(null);
  const [prediction, setPrediction] = useState(null);

  const [currentCard, setCurrentCard] = useState("donorInfo");
  const [loading, setLoading] = useState(false);

  const { token } = useAuth();

  // Helper for steps
  const getStepNumber = () => {
    if (currentCard === 'donorInfo') return 1;
    if (currentCard === 'donorForm') return 2;
    return 3;
  };
  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL|| "http://localhost:8080";
  // --- Handlers ---
  const handlePredictImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      // Ensure your Python server is running on port 5010
      const res = await fetch("http://localhost:5010/api/predict", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        console.warn("Prediction API failed or not running");
        return; // Don't try to parse JSON if failed
      }

      const data = await res.json();
      setPrediction(data);
    } catch (error) {
      console.error("Prediction error (is python server running?):", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFoodImage(file);
      handlePredictImage(file);
    }
  };

  const submitDonation = async () => {
    const formData = new FormData();
    formData.append("donorName", donorName);
    formData.append("contactNumber", contactNumber);
    formData.append("donorType", donorType);
    formData.append("foodFor", foodFor);
    formData.append("foodType", foodFor === "humans" ? foodType : "Not applicable");
    formData.append("quantity", foodFor === "humans" ? quantity : "Not applicable");
    if (foodImage) formData.append("foodImage", foodImage);
    formData.append("address", address);
    formData.append("latitude", String(location?.latitude || 0));
    formData.append("longitude", String(location?.longitude || 0));

    try {
      const res = await fetch(`${BACKEND_URL}/api/donations`, {
        method: "POST",
        headers: {
            // 3. Add the Authorization Header
            // We do NOT add "Content-Type" because FormData sets it automatically
            ...(token && { Authorization: `Bearer ${token}` }) 
        },
        body: formData,
      });

      if (!res.ok) {
        // Handle 403, 500, 400 errors
        const text = await res.text();
        console.error("Server Error:", res.status, text);
        alert(`Failed to save: Server returned ${res.status}`);
        return;
      }

      const data = await res.json();
      console.log("Donation saved:", data);
      alert("Donation details submitted successfully!");
      
      // Reset flow
      setCurrentCard("donorInfo");
      setDonorName("");
      setFoodImage(null);
      setPrediction(null);
    } catch (err) {
      console.error("Error saving donation:", err);
      alert("Network error. Is backend running?");
    }
  };

  const handleNext = (e, nextStep) => {
    e.preventDefault();
    if (nextStep === "donationLocation" && !foodFor) {
      alert("Please select who the food is for.");
      return;
    }
    setCurrentCard(nextStep);
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    await submitDonation();
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error fetching location:", error);
          alert("Unable to fetch location. Please enable location access.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCF8] flex items-center justify-center p-4 lg:p-8 font-body relative text-stone-900">
      {/* Noise Texture */}
      <div className="absolute inset-0 opacity-40 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

      <div className="w-full max-w-6xl grid lg:grid-cols-12 gap-8 relative z-10">
        
        {/* --- Left Panel: Context/Visuals --- */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.6 }} 
          className="lg:col-span-5 hidden lg:flex flex-col justify-between bg-stone-900 rounded-[2.5rem] p-12 text-white relative overflow-hidden"
        >
          {/* Decorative Blobs */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500 rounded-full blur-[80px] opacity-20 -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 rounded-full blur-[80px] opacity-20 translate-y-1/2 -translate-x-1/2"></div>

          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-white/10 backdrop-blur-md mb-8">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-xs font-bold tracking-widest uppercase">Live Impact</span>
            </div>
            <h1 className="font-heading text-5xl font-medium leading-[1.1] mb-6">
              Share a meal,<br/>
              <span className="text-orange-500">Spark hope.</span>
            </h1>
            <p className="text-stone-400 text-lg leading-relaxed">
              Every donation you make is tracked in real-time and matched with the nearest NGO within milliseconds.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-12">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
               <div className="text-3xl font-heading font-bold text-white mb-1">1.2k</div>
               <div className="text-sm text-stone-400 uppercase tracking-wider">Donations</div>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
               <div className="text-3xl font-heading font-bold text-white mb-1">85</div>
               <div className="text-sm text-stone-400 uppercase tracking-wider">NGOs Active</div>
            </div>
          </div>
        </motion.div>

        {/* --- Right Panel: Form Flow --- */}
        <div className="lg:col-span-7 bg-white rounded-[2.5rem] shadow-xl shadow-stone-200 p-6 sm:p-10 lg:p-12 flex flex-col">
          
          {/* Header & Stepper */}
          <div className="mb-10">
            <h2 className="font-heading text-3xl font-bold text-stone-900 mb-2">Donation Details</h2>
            <div className="flex justify-between items-center mt-8 px-2">
              <StepIndicator step={1} currentStep={getStepNumber()} label="Identity" />
              <div className="h-px w-8 bg-stone-200 hidden sm:block"></div>
              <StepIndicator step={2} currentStep={getStepNumber()} label="Details" />
              <div className="h-px w-8 bg-stone-200 hidden sm:block"></div>
              <StepIndicator step={3} currentStep={getStepNumber()} label="Location" />
            </div>
          </div>

          {/* Form Content Area */}
          <div className="flex-1 relative overflow-hidden min-h-[400px]">
            <AnimatePresence mode="wait">
              
              {/* --- STEP 1: IDENTITY --- */}
              {currentCard === 'donorInfo' && (
                <motion.form 
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={(e) => handleNext(e, 'donorForm')}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <label className="text-sm font-bold text-stone-400 uppercase tracking-widest">Who are you?</label>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { id: 'individual', icon: User, label: 'Individual' },
                        { id: 'restaurant', icon: Utensils, label: 'Restaurant' },
                        { id: 'event_organization', icon: PartyPopper, label: 'Event' }
                      ].map((type) => (
                        <button 
                          key={type.id}
                          type="button" 
                          onClick={() => setDonorType(type.id)} 
                          className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-300 ${
                            donorType === type.id 
                              ? 'bg-stone-900 border-stone-900 text-white shadow-lg transform scale-105' 
                              : 'bg-white border-stone-200 text-stone-500 hover:border-orange-300 hover:bg-orange-50'
                          }`}
                        >
                          <type.icon className={`mb-2 w-6 h-6 ${donorType === type.id ? 'text-orange-400' : ''}`} />
                          <span className="text-sm font-medium">{type.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-stone-900">Donor Name</label>
                      <input 
                        required 
                        value={donorName} 
                        onChange={(e) => setDonorName(e.target.value)} 
                        placeholder="e.g. John Doe or Starbucks Pune" 
                        className="w-full h-14 px-4 bg-stone-50 border border-transparent rounded-xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-stone-900">Contact Number</label>
                      <input 
                        required 
                        value={contactNumber} 
                        onChange={(e) => setContactNumber(e.target.value)} 
                        placeholder="+91 98765 43210" 
                        className="w-full h-14 px-4 bg-stone-50 border border-transparent rounded-xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button type="submit" className="px-8 py-4 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 transition-all flex items-center gap-2 shadow-lg shadow-orange-500/20">
                      Continue <ChevronRight size={20} />
                    </button>
                  </div>
                </motion.form>
              )}

              {/* --- STEP 2: FOOD DETAILS --- */}
              {currentCard === 'donorForm' && (
                <motion.form 
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={(e) => handleNext(e, 'donationLocation')}
                  className="space-y-6"
                >
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-stone-900">Food For</label>
                      <div className="relative">
                        <select 
                          required 
                          value={foodFor} 
                          onChange={(e) => setFoodFor(e.target.value)} 
                          className="w-full h-14 px-4 bg-stone-50 border border-transparent rounded-xl focus:bg-white focus:border-orange-500 outline-none appearance-none"
                        >
                          <option value="">Select Recipient</option>
                          <option value="humans">Humans in need</option>
                          <option value="animals">Stray Animals</option>
                        </select>
                        <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 rotate-90" size={18} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-stone-900">Quantity</label>
                      <div className="relative">
                        <select 
                          value={quantity} 
                          onChange={(e) => setQuantity(e.target.value)} 
                          className="w-full h-14 px-4 bg-stone-50 border border-transparent rounded-xl focus:bg-white focus:border-orange-500 outline-none appearance-none"
                        >
                          <option value=">5">5-10 people</option>
                          <option value=">10">10-25 people</option>
                          <option value=">25">25-50 people</option>
                          <option value=">50">50+ people</option>
                        </select>
                        <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 rotate-90" size={18} />
                      </div>
                    </div>
                  </div>

                  {/* Image Upload Area */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-stone-900 flex justify-between">
                      <span>Food Image</span>
                      <span className="text-xs text-stone-400 font-normal">AI Verification Enabled</span>
                    </label>
                    <div className="relative border-2 border-dashed border-stone-200 rounded-2xl p-6 transition-colors hover:border-orange-400 bg-stone-50/50 group">
                      <input 
                        onChange={handleFileChange} 
                        type="file" 
                        accept="image/*" 
                        className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10" 
                      />
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl bg-white shadow-sm flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
                          {foodImage ? <img src={URL.createObjectURL(foodImage)} alt="Preview" className="w-full h-full object-cover rounded-xl" /> : <UploadCloud size={28} />}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-stone-900">{foodImage ? foodImage.name : 'Click to upload photo'}</h4>
                          <p className="text-sm text-stone-500">{foodImage ? 'Click to change' : 'JPG, PNG supported'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* AI Prediction Result */}
                  <AnimatePresence>
                    {(loading || prediction) && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }} 
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`p-4 rounded-xl border flex items-center gap-3 ${
                          prediction?.binary_result === 'Food' ? 'bg-green-50 border-green-100 text-green-800' : 'bg-stone-100 border-stone-200 text-stone-600'
                        }`}
                      >
                        {loading ? (
                          <div className="flex items-center gap-2 text-sm text-stone-500">
                            <div className="w-4 h-4 border-2 border-stone-400 border-t-transparent rounded-full animate-spin"></div>
                            Analyzing image...
                          </div>
                        ) : prediction?.binary_result === 'Food' ? (
                          <>
                            <div className="p-1 bg-green-200 rounded-full"><CheckCircle2 size={16} /></div>
                            <div className="flex-1 text-sm">
                              <span className="font-bold">Verified:</span> {prediction.food_name} ({(prediction.confidence || 0).toFixed(0)}% confidence)
                            </div>
                          </>
                        ) : (
                          <>
                            <AlertCircle size={18} />
                            <span className="text-sm">{prediction?.message || "Could not detect food"}</span>
                          </>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Food Type Toggle (Only if Humans) */}
                  {foodFor === 'humans' && (
                    <div className="p-4 bg-stone-50 rounded-xl flex items-center justify-between">
                      <span className="text-sm font-medium text-stone-700">Dietary Type</span>
                      <div className="flex bg-white p-1 rounded-lg border border-stone-200">
                        <button 
                          type="button" 
                          onClick={() => setFoodType('veg')}
                          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${foodType === 'veg' ? 'bg-green-100 text-green-700 shadow-sm' : 'text-stone-400 hover:text-stone-600'}`}
                        >
                          <Leaf size={14} /> Veg
                        </button>
                        <button 
                          type="button" 
                          onClick={() => setFoodType('nonveg')}
                          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${foodType === 'nonveg' ? 'bg-red-100 text-red-700 shadow-sm' : 'text-stone-400 hover:text-stone-600'}`}
                        >
                          <Beef size={14} /> Non-Veg
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="pt-4 flex justify-between items-center">
                    <button type="button" onClick={() => setCurrentCard('donorInfo')} className="text-stone-500 font-medium hover:text-stone-900 px-4 py-2">
                      Back
                    </button>
                    <button type="submit" className="px-8 py-4 bg-stone-900 text-white font-bold rounded-xl hover:bg-orange-600 transition-all flex items-center gap-2 shadow-lg shadow-stone-900/10">
                      Next Step <ChevronRight size={20} />
                    </button>
                  </div>
                </motion.form>
              )}

              {/* --- STEP 3: LOCATION --- */}
              {currentCard === 'donationLocation' && (
                <motion.form 
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleFinalSubmit}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-stone-900">Pickup Address</label>
                    <textarea 
                      required 
                      value={address} 
                      onChange={(e) => setAddress(e.target.value)} 
                      placeholder="Flat No, Building Name, Street Area..." 
                      className="w-full h-32 p-4 bg-stone-50 border border-transparent rounded-xl focus:bg-white focus:border-orange-500 outline-none resize-none"
                    />
                  </div>

                  <div className="p-5 border border-stone-200 rounded-xl flex items-center justify-between bg-stone-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                        <MapPin size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-stone-900">GPS Location</p>
                        <p className="text-xs text-stone-500">
                          {location ? `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}` : 'Required for pickup'}
                        </p>
                      </div>
                    </div>
                    <button 
                      type="button" 
                      onClick={getLocation} 
                      className="text-sm font-bold text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors"
                    >
                      {location ? 'Update' : 'Detect'}
                    </button>
                  </div>

                  <div className="pt-4 flex justify-between items-center">
                    <button type="button" onClick={() => setCurrentCard('donorForm')} className="text-stone-500 font-medium hover:text-stone-900 px-4 py-2">
                      Back
                    </button>
                    <button type="submit" className="px-8 py-4 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-all flex items-center gap-2 shadow-lg shadow-green-600/20">
                      <CheckCircle2 size={20} /> Confirm Donation
                    </button>
                  </div>
                </motion.form>
              )}

            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}