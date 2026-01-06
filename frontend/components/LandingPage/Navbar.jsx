
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${
          scrolled || menuOpen
            ? "bg-white/80 backdrop-blur-md border-stone-200/50 py-4"
            : "bg-transparent border-transparent py-6"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between">
          {/* Logo Section */}
          <Link href="/" className="group z-50 relative">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
                <span className="text-white font-bold font-heading text-xl">R</span>
              </div>
              <h1 className="font-heading text-2xl font-bold text-stone-900 tracking-tight">
                ResQ<span className="text-stone-400">Bridge</span>
              </h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8 font-body">
            <Link 
              href="/statistics" 
              className="text-stone-600 hover:text-orange-600 font-medium transition-colors text-sm uppercase tracking-wider"
            >
              Statistics
            </Link>
            <Link 
              href="/about" 
              className="text-stone-600 hover:text-orange-600 font-medium transition-colors text-sm uppercase tracking-wider"
            >
              How it works
            </Link>

            <Link href="/login">
              <button className="px-6 py-2.5 bg-stone-900 hover:bg-orange-600 text-white rounded-full font-medium transition-all duration-300 transform hover:scale-105 shadow-lg shadow-stone-900/20 text-sm">
                Login / Register
              </button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden z-50 p-2 text-stone-900 hover:bg-stone-100 rounded-full transition-colors"
            aria-label="Toggle Menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-white pt-24 px-6 md:hidden"
          >
            <div className="flex flex-col gap-6">
              <Link
                href="/statistics"
                onClick={toggleMenu}
                className="flex items-center justify-between p-4 bg-stone-50 rounded-2xl group"
              >
                <span className="font-heading text-xl text-stone-900">Statistics</span>
                <ChevronRight className="text-stone-400 group-hover:text-orange-500 transition-colors" />
              </Link>
              
              <Link
                href="/about"
                onClick={toggleMenu}
                className="flex items-center justify-between p-4 bg-stone-50 rounded-2xl group"
              >
                <span className="font-heading text-xl text-stone-900">How it works</span>
                <ChevronRight className="text-stone-400 group-hover:text-orange-500 transition-colors" />
              </Link>

              <hr className="border-stone-100 my-2" />

              <Link href="/login" onClick={toggleMenu}>
                <button className="w-full py-4 bg-orange-500 text-white rounded-xl font-bold text-lg shadow-xl shadow-orange-500/20 active:scale-95 transition-transform">
                  Login / Register
                </button>
              </Link>
            </div>
            
            {/* Mobile Footer Deco */}
            <div className="absolute bottom-10 left-0 w-full text-center text-stone-400 text-sm">
              <p>Designed for Impact.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;