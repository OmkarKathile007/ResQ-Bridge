"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, 
  LogOut, 
  Settings, 
  Gift, 
  Coins, 
  ChevronDown,
  Bell
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';


const DonorNavbar = ({ donorName = "User", points = 150 }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const router = useRouter();
  const profileRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleRedeem = () => {
    router.push('/redeem');
    setIsProfileOpen(false);
  };

  const handleLogout = () => {
    // Add logout logic here
    router.push('/login');
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-stone-200/50">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          {/* --- Logo Section --- */}
          <Link href="/donor" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center text-white font-bold font-heading text-xl shadow-lg shadow-orange-500/20 group-hover:rotate-6 transition-transform">
              D
            </div>
            <span className="text-2xl font-heading font-bold text-stone-900 tracking-tight group-hover:text-orange-600 transition-colors">
              Donor<span className="text-stone-400">Hub</span>
            </span>
          </Link>

          {/* --- Right Actions --- */}
          <div className="flex items-center gap-3 sm:gap-6">
            
            {/* Points / Rewards Pill (Visible on Desktop) */}
            <Link href="/redeem">
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-full border border-orange-100 transition-colors cursor-pointer group">
                <Coins className="w-4 h-4 text-orange-500 group-hover:scale-110 transition-transform" />
                <span className="font-bold font-heading">{points} pts</span>
                <span className="text-xs text-orange-400 font-medium border-l border-orange-200 pl-2 ml-1">Redeem</span>
              </div>
            </Link>

            {/* Notification Bell */}
            <button className="p-2 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-full transition-all relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 p-1 pl-2 rounded-full border border-stone-200 hover:border-stone-300 hover:bg-stone-50 transition-all bg-white"
              >
                <div className="hidden sm:flex flex-col items-end mr-1">
                  <span className="text-xs font-bold text-stone-900 leading-tight">{donorName}</span>
                  <span className="text-[10px] text-stone-500 uppercase tracking-wider font-medium">Donor</span>
                </div>
                <div className="w-9 h-9 bg-stone-900 text-white rounded-full flex items-center justify-center shadow-md">
                   <User className="w-4 h-4" />
                </div>
                <ChevronDown className={`w-4 h-4 text-stone-400 mr-2 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* AnimatePresence for smooth dropdown */}
              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-3 w-64 bg-white rounded-2xl shadow-xl shadow-stone-200 border border-stone-100 overflow-hidden"
                  >
                    {/* Mobile Points View */}
                    <div className="md:hidden p-4 bg-orange-50 border-b border-orange-100">
                      <div className="text-xs text-orange-600 font-bold uppercase tracking-wider mb-1">Available Balance</div>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-stone-900">{points}</span>
                        <Coins className="text-orange-500 w-6 h-6" />
                      </div>
                    </div>

                    <div className="p-2">
                      <button 
                        onClick={handleRedeem}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-stone-700 hover:text-stone-900 hover:bg-stone-50 rounded-xl transition-colors text-left"
                      >
                        <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                          <Gift className="w-4 h-4" />
                        </div>
                        Redeem Rewards
                      </button>

                      <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-stone-700 hover:text-stone-900 hover:bg-stone-50 rounded-xl transition-colors text-left">
                        <div className="p-2 bg-stone-100 text-stone-600 rounded-lg">
                          <Settings className="w-4 h-4" />
                        </div>
                        Settings
                      </button>

                      <div className="h-px bg-stone-100 my-2 mx-2"></div>

                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors text-left"
                      >
                        <div className="p-2 bg-red-100 text-red-500 rounded-lg">
                          <LogOut className="w-4 h-4" />
                        </div>
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DonorNavbar;