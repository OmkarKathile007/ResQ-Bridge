"use client";
import { useScroll, useTransform, motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import ImageSlide from "../ImageSlide/ImageSlide";
import Link from "next/link";

export const Timeline = ({ data }) => {
  const ref = useRef(null);
  const containerRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 5%", "end 40%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height * 100]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div className="w-full min-h-full  font-sans px-4 sm:px-6 md:px-10 lg:px-12 xl:px-16" ref={containerRef}>
      {/* Hero Section */}
      <div className="w-full h-screen flex flex-col justify-between md:flex-row items-center">
        <div className="h-[40vh] sm:h-[50vh]  md:h-[70vh] w-full md:w-1/2 mt-8 md:mt-12">
          <ImageSlide />
        </div>

        <div className="flex flex-col gap-4 md:gap-8 lg:gap-12 w-full md:w-1/2 h-[50vh] md:h-[70vh] py-4 md:py-8">
          <h1 className="mt-4 md:mt-8 lg:mt-12 text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-center font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-800 dark:from-neutral-800 dark:via-black dark:to-neutral-500">
            Food Link
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl w-full md:w-5/6 lg:w-3/4 mx-auto px-2 sm:px-0">
            Our platform connects surplus food with nearby NGOs, ensuring perishables reach those in need before they spoil. We help reduce waste and create a future where no food goes to waste and no one goes hungry
          </p>
          <Link className="w-full md:w-1/2 lg:w-1/3 mx-auto mt-4 md:mt-8" href="">
            <button className="bg-orange-400 rounded-md w-full p-2 sm:p-3 text-sm sm:text-base md:text-lg text-white hover:bg-orange-500 transition-colors">
              Explore
            </button>
          </Link>
        </div>
      </div>

      {/* Timeline Section */}
      <div ref={ref} className="relative w-full  bg-orange-400 text-white mx-auto pb-20 min-h-full px-4 sm:px-6">
        

        {/* Vertical Line */}
        <div className="absolute left-4 sm:left-6 md:left-8 top-0 overflow-hidden w-[2px] bg-gradient-to-b from-transparent via-neutral-200 dark:via-neutral-700 to-transparent [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]"
          style={{ height: height + "px" }}>
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0 w-[12px] bg-gradient-to-t from-purple-500 via-blue-500 to-transparent rounded-full"
          />
        </div>
      </div>
    </div>
  );
};