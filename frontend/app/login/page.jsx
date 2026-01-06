"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Building2, Users, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// --- VISUAL ASSETS ---
const userTypes = [
  {
    id: "donor",
    title: "Donor",
    icon: Heart,
    description: "Give Support",
  },
  {
    id: "ngo",
    title: "NGO",
    icon: Building2,
    description: "Receive Aid",
  },
  {
    id: "volunteer",
    title: "Volunteer",
    icon: Users,
    description: "Lend a Hand",
  },
];

export default function AuthPage() {
  const [selectedType, setSelectedType] = useState("ngo");
  const [tab, setTab] = useState("login");
  
  // State for forms
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // --- HANDLERS ---
  const handleLoginChange = (e) => {
    setLoginForm({ ...loginForm, [e.target.id]: e.target.value });
  };

  const handleSignupChange = (e) => {
    setSignupForm({ ...signupForm, [e.target.id]: e.target.value });
  };

  // --- API LOGIC ---
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!loginForm.email || !loginForm.password) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch(`${BACKEND_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: loginForm.email, 
          password: loginForm.password,
        }),
      });

            console.log("Login: response status", response.status);
            const respText = await response.text();
            console.log("Login: raw response text", respText);
            if (!response.ok) {
                throw new Error(respText || "Invalid credentials");
            }

            const data = respText ? JSON.parse(respText) : {};
            console.log("Login: parsed response", data);
            localStorage.setItem("token", data.token);
            localStorage.setItem("role", selectedType);
            router.push(`/${selectedType}`);

    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!signupForm.name || !signupForm.email || !signupForm.password || !signupForm.confirmPassword) {
      setError("Please fill in all required fields.");
      return;
    }
    if (signupForm.password !== signupForm.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: signupForm.email, 
          email: signupForm.email,
          password: signupForm.password,
          roles: [selectedType.toUpperCase()] 
        }),
      });

            console.log("Signup: response status", response.status);
            const respText = await response.text();
            console.log("Signup: raw response text", respText);
            if (!response.ok) {
                throw new Error(respText || "Registration failed");
            }

            const data = respText ? JSON.parse(respText) : {};
            console.log("Signup: parsed response", data);
            localStorage.setItem("token", data.token);
            router.push('/login');

    } catch (err) {
      console.error(err);
      setError("Registration failed. Email might already exist.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#FDFCF8] flex items-center justify-center p-4 lg:p-8 font-body relative overflow-hidden">
        {/* Noise Texture */}
        <div className="absolute inset-0 opacity-40 pointer-events-none z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-[1200px] h-full lg:min-h-[700px] bg-white rounded-[2.5rem] shadow-2xl shadow-stone-200 overflow-hidden relative z-10 flex flex-col lg:flex-row"
        >
            {/* --- LEFT SIDE: Brand / Visuals --- */}
            <div className="lg:w-[45%] bg-stone-900 relative p-12 flex flex-col justify-between text-white overflow-hidden">
                {/* Decoration */}
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-orange-500 rounded-full blur-[120px] opacity-20 -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-500 rounded-full blur-[100px] opacity-20 translate-y-1/2 -translate-x-1/2"></div>

                <div className="relative z-10">
                    <Link href="/" className="inline-flex items-center gap-2 mb-8 group cursor-pointer">
                        <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-stone-900 font-bold font-heading group-hover:rotate-12 transition-transform">S</div>
                        <span className="font-heading font-bold text-xl tracking-tight">SurplusShift</span>
                    </Link>
                    
                    <h2 className="font-heading text-4xl lg:text-5xl font-medium leading-[1.1] mb-6">
                        {selectedType === 'donor' && "Turn surplus into smiles."}
                        {selectedType === 'ngo' && "Resources when you need them."}
                        {selectedType === 'volunteer' && "Be the bridge for change."}
                    </h2>
                    <p className="text-stone-400 text-lg leading-relaxed max-w-sm">
                        Join the network of 85,000+ changemakers reducing waste and feeding communities.
                    </p>
                </div>

                <div className="relative z-10 mt-12 lg:mt-0">
                    <div className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
                        <div className="p-3 bg-orange-500 rounded-full">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="font-medium text-sm">Live Impact</p>
                            <p className="text-xs text-stone-400">12kg saved in Pune just now</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- RIGHT SIDE: Form Interaction --- */}
            <div className="lg:w-[55%] p-8 lg:p-16 flex flex-col justify-center bg-white relative">
                
                {/* Role Selector */}
                <div className="mb-10">
                    <label className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-4 block">Select your role</label>
                    <div className="grid grid-cols-3 gap-4">
                        {userTypes.map((type) => {
                            const isSelected = selectedType === type.id;
                            return (
                                <button
                                    key={type.id}
                                    onClick={() => setSelectedType(type.id)}
                                    className={`relative group flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-300 ${
                                        isSelected 
                                            ? "bg-stone-900 border-stone-900 text-white shadow-lg scale-105" 
                                            : "bg-white border-stone-200 text-stone-500 hover:border-orange-300 hover:bg-orange-50"
                                    }`}
                                >
                                    <type.icon className={`w-6 h-6 mb-2 ${isSelected ? "text-orange-400" : "text-stone-400 group-hover:text-orange-500"}`} />
                                    <span className="text-sm font-medium">{type.title}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex w-full border-b border-stone-200 mb-8 relative">
                    <div className="absolute bottom-0 h-0.5 bg-orange-500 transition-all duration-300" 
                         style={{ 
                             width: "50%", 
                             left: tab === "login" ? "0%" : "50%" 
                         }} 
                    />
                    <button
                        onClick={() => { setTab("login"); setError(""); }}
                        className={`w-1/2 pb-4 text-center font-heading font-medium transition-colors ${tab === "login" ? "text-stone-900" : "text-stone-400 hover:text-stone-600"}`}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => { setTab("signup"); setError(""); }}
                        className={`w-1/2 pb-4 text-center font-heading font-medium transition-colors ${tab === "signup" ? "text-stone-900" : "text-stone-400 hover:text-stone-600"}`}
                    >
                        Sign Up
                    </button>
                </div>

                {/* Error Banner */}
                <AnimatePresence>
                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }} 
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 flex items-center gap-2"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Forms */}
                <div className="relative min-h-[300px]">
                    <AnimatePresence mode="wait">
                        {tab === "login" ? (
                            <motion.form 
                                key="login"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3 }}
                                onSubmit={handleLoginSubmit} 
                                className="space-y-5"
                            >
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-stone-700">Email Address</label>
                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="name@company.com"
                                        className="w-full h-14 px-4 bg-stone-50 border border-transparent rounded-xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all outline-none text-stone-900 placeholder:text-stone-400"
                                        value={loginForm.email}
                                        onChange={handleLoginChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <label className="text-sm font-medium text-stone-700">Password</label>
                                        <a href="#" className="text-xs font-medium text-orange-600 hover:underline">Forgot?</a>
                                    </div>
                                    <input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full h-14 px-4 bg-stone-50 border border-transparent rounded-xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all outline-none text-stone-900 placeholder:text-stone-400"
                                        value={loginForm.password}
                                        onChange={handleLoginChange}
                                    />
                                </div>
                                
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-14 mt-4 bg-stone-900 text-white font-medium rounded-xl hover:bg-orange-600 transition-all duration-300 flex items-center justify-center gap-2 shadow-xl shadow-stone-900/10 disabled:opacity-70 disabled:cursor-not-allowed group"
                                >
                                    {loading ? <Loader2 className="animate-spin" /> : (
                                        <>
                                            Login to Account 
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </motion.form>
                        ) : (
                            <motion.form 
                                key="signup"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                onSubmit={handleSignupSubmit} 
                                className="space-y-4"
                            >
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-stone-700">Full Name</label>
                                    <input
                                        id="name"
                                        type="text"
                                        placeholder="John Doe"
                                        className="w-full h-12 px-4 bg-stone-50 border border-transparent rounded-xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all outline-none"
                                        value={signupForm.name}
                                        onChange={handleSignupChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-stone-700">Email Address</label>
                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="name@company.com"
                                        className="w-full h-12 px-4 bg-stone-50 border border-transparent rounded-xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all outline-none"
                                        value={signupForm.email}
                                        onChange={handleSignupChange}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-stone-700">Password</label>
                                        <input
                                            id="password"
                                            type="password"
                                            placeholder="Create password"
                                            className="w-full h-12 px-4 bg-stone-50 border border-transparent rounded-xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all outline-none"
                                            value={signupForm.password}
                                            onChange={handleSignupChange}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-stone-700">Confirm</label>
                                        <input
                                            id="confirmPassword"
                                            type="password"
                                            placeholder="Confirm password"
                                            className="w-full h-12 px-4 bg-stone-50 border border-transparent rounded-xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all outline-none"
                                            value={signupForm.confirmPassword}
                                            onChange={handleSignupChange}
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-14 mt-4 bg-orange-600 text-white font-medium rounded-xl hover:bg-orange-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-xl shadow-orange-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {loading ? <Loader2 className="animate-spin" /> : "Create Account"}
                                </button>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    </div>
  );
}