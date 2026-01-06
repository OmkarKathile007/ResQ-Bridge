
"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import images from "../../public/Shared/itemData"; // Ensure `itemData` has the images array

export default function ImageSlide() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex < images.length - 1 ? prevIndex + 1 : 0
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="slideshow relative w-full h-[300px] sm:h-[400px] md:h-[450px] lg:h-[450px] xl:h-[450px] rounded-lg overflow-hidden shadow-lg">
      {images.map((image, index) => (
        <Image
          key={index}
          src={image.image}
          alt={image.alt}
          className={`absolute top-0 left-0 w-full h-full object-cover transition-all duration-500 ease-in-out ${
            index === currentImageIndex
              ? "z-10 opacity-100 scale-100 translate-x-0 rotate-0"
              : "opacity-0 scale-110 -translate-x-4 -rotate-6"
          }`}
          fill
        />
      ))}
    </div>
  );
}
