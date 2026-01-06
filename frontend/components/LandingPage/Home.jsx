
"use client";

import Navbar from './Navbar';
import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Utensils, HeartHandshake, Clock, MapPin, Leaf, ArrowRight, ArrowUpRight, Globe } from 'lucide-react';
import ImageSlider from './ImageSlider';
import Link from 'next/link';
import Script from 'next/script';

// --- Custom Font Injection & Grain ---
// We inject Google Fonts directly here to ensure it works instantly for you.
const GlobalStyles = () => (
  <style jsx global>{`
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600&family=Space+Grotesk:wght@400;500;600;700&display=swap');
    
    :root {
      --font-heading: 'Space Grotesk', sans-serif;
      --font-body: 'Outfit', sans-serif;
    }
    
    body {
      background-color: #FDFCF8; /* Warm off-white, like paper */
      color: #1a1a1a;
    }

    .bg-noise {
      position: absolute;
      inset: 0;
      z-index: -1;
      opacity: 0.05;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
      pointer-events: none;
    }

    .font-heading { font-family: var(--font-heading); }
    .font-body { font-family: var(--font-body); }
  `}</style>
);

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

function Home() {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: targetRef, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <>
      <GlobalStyles />
      <Navbar /> {/* Ensure your Navbar is transparent or updated to match */}
      
      <main className="min-h-screen w-full flex flex-col overflow-hidden font-body relative selection:bg-orange-200 selection:text-orange-900">
        <div className="bg-noise fixed h-full w-full"></div>

        {/* --- HERO SECTION --- */}
        <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 px-6">
          <div className="max-w-[1400px] mx-auto">
            <div className="grid lg:grid-cols-12 gap-12 items-center">
              
              {/* Typography Side */}
              <motion.div 
                initial="initial"
                animate="animate"
                viewport={{ once: true }}
                className="lg:col-span-7 space-y-8 relative z-10"
              >
                {/* Decorative pill */}
                <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-stone-200 bg-white/50 backdrop-blur-sm">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-xs font-medium uppercase tracking-wider text-stone-500">Live Network Active</span>
                </motion.div>

                <motion.h1 
                  variants={fadeInUp}
                  className="font-heading text-6xl sm:text-7xl lg:text-8xl font-medium tracking-tight leading-[0.95] text-stone-900"
                >
                  Rescue Food.<br/>
                  <span className="italic font-light text-stone-400">Restore</span> Humanity.
                </motion.h1>
                
                <motion.p 
                  variants={fadeInUp}
                  className="text-xl sm:text-2xl text-stone-600 max-w-xl font-light leading-relaxed"
                >
                  We bridge the gap between surplus and scarcity. A hyper-local platform connecting food donors to NGOs in milliseconds.
                </motion.p>

                <motion.div variants={fadeInUp} className="flex flex-wrap gap-4 pt-4">
                  <Link href="/login">
                    <button className="group relative px-8 py-4 bg-stone-900 text-white rounded-full overflow-hidden transition-transform active:scale-95">
                      <div className="absolute inset-0 bg-orange-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
                      <span className="relative font-medium text-lg flex items-center gap-2">
                        Get Started <ArrowRight className="w-5 h-5" />
                      </span>
                    </button>
                  </Link>
                  <Link href="/about">
                    <button className="px-8 py-4 bg-transparent border border-stone-300 text-stone-900 rounded-full hover:bg-stone-100 transition-colors font-medium text-lg">
                      How it works
                    </button>
                  </Link>
                </motion.div>
              </motion.div>

              {/* Image Side - Asymmetrical & Artistic */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="lg:col-span-5 relative"
              >
                <div className="relative aspect-[4/5] lg:aspect-square">
                   {/* Abstract Shape Background */}
                   <div className="absolute top-10 -right-10 w-full h-full bg-orange-200 rounded-full blur-[80px] opacity-40"></div>
                   
                   {/* Main Image Container */}
                   <div className="relative h-full w-full rounded-[2rem] overflow-hidden border border-stone-200 shadow-2xl">
                     <ImageSlider className="w-full h-full object-cover" />
                     
                     {/* Floating Glass Card */}
                     <div className="absolute bottom-6 left-6 right-6 p-4 bg-white/80 backdrop-blur-md rounded-xl border border-white/40 shadow-lg flex items-center justify-between">
                        <div>
                          <p className="text-xs text-stone-500 uppercase tracking-widest font-heading">Recent Match</p>
                          <p className="text-stone-900 font-medium">Starbucks Pune → Hope Foundation</p>
                        </div>
                        <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center text-green-700">
                          <Leaf size={20} />
                        </div>
                     </div>
                   </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* --- STATS STRIP (Minimalist) --- */}
        <div className="border-y border-stone-200 bg-white/50 backdrop-blur-sm">
          <div className="max-w-[1400px] mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-stone-200">
              {[
                { val: "84.5k", label: "Meals Saved" },
                { val: "1,200", label: "Tons CO₂ Reduced" },
                { val: "2,500", label: "Partner NGOs" },
                { val: "98", label: "Active Cities" }
              ].map((stat, i) => (
                <div key={i} className="py-8 px-6 text-center group hover:bg-orange-50/50 transition-colors cursor-default">
                  <p className="font-heading text-4xl font-semibold text-stone-900 group-hover:text-orange-600 transition-colors">{stat.val}</p>
                  <p className="text-sm text-stone-500 uppercase tracking-widest mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- FEATURES (Swiss Grid Style) --- */}
        <section className="py-32 px-6">
          <div className="max-w-[1400px] mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
              <h2 className="font-heading text-5xl md:text-6xl text-stone-900 leading-[0.9]">
                Engineered for <br/>
                <span className="text-orange-600">Human Impact.</span>
              </h2>
              <p className="text-xl text-stone-600 max-w-md pb-2 border-b border-stone-300">
                Advanced logistics met with radical transparency. A tool suite designed for modern food rescue.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Card 1 */}
              <div className="group p-8 rounded-[2rem] bg-[#F5F5F0] hover:bg-orange-600 transition-colors duration-500">
                <div className="h-14 w-14 bg-white rounded-full flex items-center justify-center mb-12 shadow-sm group-hover:scale-110 transition-transform">
                  <Clock className="w-6 h-6 text-stone-900" />
                </div>
                <h3 className="font-heading text-2xl font-semibold mb-4 text-stone-900 group-hover:text-white">Real-Time Sync</h3>
                <p className="text-stone-600 group-hover:text-orange-100 leading-relaxed">
                  Our WebSocket architecture ensures matches happen in milliseconds. Food is perishable; our technology is instant.
                </p>
              </div>

              {/* Card 2 */}
              <div className="group p-8 rounded-[2rem] bg-[#F5F5F0] hover:bg-stone-900 transition-colors duration-500">
                <div className="h-14 w-14 bg-white rounded-full flex items-center justify-center mb-12 shadow-sm group-hover:scale-110 transition-transform">
                  <MapPin className="w-6 h-6 text-stone-900" />
                </div>
                <h3 className="font-heading text-2xl font-semibold mb-4 text-stone-900 group-hover:text-white">Smart Routing</h3>
                <p className="text-stone-600 group-hover:text-stone-400 leading-relaxed">
                  Calculates the most efficient path between donors and NGOs, accounting for traffic and vehicle capacity.
                </p>
              </div>

              {/* Card 3 */}
              <div className="group p-8 rounded-[2rem] bg-[#F5F5F0] hover:bg-green-700 transition-colors duration-500">
                <div className="h-14 w-14 bg-white rounded-full flex items-center justify-center mb-12 shadow-sm group-hover:scale-110 transition-transform">
                  <Leaf className="w-6 h-6 text-stone-900" />
                </div>
                <h3 className="font-heading text-2xl font-semibold mb-4 text-stone-900 group-hover:text-white">Impact Analytics</h3>
                <p className="text-stone-600 group-hover:text-green-100 leading-relaxed">
                  Visual data storytelling for your ESG goals. Download reports on carbon saved and lives impacted instantly.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* --- BIG CTA (Parallax) --- */}
        <section ref={targetRef} className="py-20 px-6 overflow-hidden">
          <motion.div style={{ y }} className="max-w-[1400px] mx-auto">
            <div className="relative rounded-[2.5rem] bg-stone-900 text-white overflow-hidden px-8 py-24 md:p-32 text-center">
              {/* Grain overlay specific to this dark card */}
              <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
              
              <div className="relative z-10 flex flex-col items-center">
                <div className="mb-8 p-4 border border-white/20 rounded-full inline-block">
                  <Globe className="w-8 h-8 text-orange-500" />
                </div>
                
                <h2 className="font-heading text-5xl md:text-7xl font-medium mb-8 leading-tight">
                  Ready to close the loop on <br/>
                  <span className="text-orange-500">food waste?</span>
                </h2>
                
                <div className="flex flex-col sm:flex-row gap-6 mt-4">
                  <Link href="/signup">
                    <button className="px-10 py-5 bg-white text-stone-900 rounded-full font-semibold text-lg hover:bg-orange-100 transition-colors flex items-center gap-2">
                      Join the Network <ArrowUpRight className="w-5 h-5" />
                    </button>
                  </Link>
                  <Link href="/contact">
                    <button className="px-10 py-5 bg-transparent border border-white/30 text-white rounded-full font-semibold text-lg hover:bg-white/10 transition-colors">
                      Contact Sales
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

      </main>

      {/* Chatbot Script */}
      <Script id="watson-chat-options" strategy="afterInteractive">
        {`
          window.watsonAssistantChatOptions = {
            integrationID: "c7cf9b64-599b-441d-afb1-b39bcbdb4440",
            region: "au-syd",
            serviceInstanceID: "e800a508-cd46-4310-8aec-21a55012d210",
            onLoad: async (instance) => { await instance.render(); }
          };
          setTimeout(function(){
            const t = document.createElement('script');
            t.src = "https://web-chat.global.assistant.watson.appdomain.cloud/versions/" + 
              (window.watsonAssistantChatOptions.clientVersion || 'latest') + 
              "/WatsonAssistantChatEntry.js";
            document.head.appendChild(t);
          });
        `}
      </Script>
    </>
  );
}

export default Home;