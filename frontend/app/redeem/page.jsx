"use client"
import { useState, useEffect } from "react";

// Function to generate a random redeem code
const generateRedeemCode = () => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({ length: 8 }, () =>
    characters.charAt(Math.floor(Math.random() * characters.length))
  ).join("");
};

// Function to shuffle an array (Fisher-Yates shuffle)
const shuffleArray = (array) => {
  let shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const RewardPage = () => {
  const [scratchedIndex, setScratchedIndex] = useState(null);
  const [coupons, setCoupons] = useState([]);

  useEffect(() => {
    const initialCoupons = [
      { discount: "25%", restaurant: "Burger King", code: generateRedeemCode() },
      { discount: "30%", restaurant: "Pizza Hut", code: generateRedeemCode() },
      { discount: "35%", restaurant: "Subway", code: generateRedeemCode() },
      { discount: "40%", restaurant: "Domino's", code: generateRedeemCode() },
      { discount: "45%", restaurant: "KFC", code: generateRedeemCode() },
      { discount: "55%", restaurant: "McDonald's", code: generateRedeemCode() },
    ];

    setCoupons(shuffleArray(initialCoupons)); // Shuffle coupons on refresh
  }, []);

  const handleScratch = (index) => {
    setScratchedIndex(index); // Only one card can be scratched at a time
  };

  return (
    <div className="min-h-screen bg-orange-100 flex flex-col items-center py-12">
      {/* Heading */}
      <h1 className="text-4xl font-bold text-orange-700 mb-4 text-center">
        🎉 Congratulations! 🎉
      </h1>
      <p className="text-lg text-gray-700 mb-8 text-center">
        You've won 6 scratch cards! Click on one to reveal your prize.
      </p>

      {/* Grid Layout for Coupons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
        {coupons.map((coupon, index) => (
          <div
            key={index}
            className="relative bg-white rounded-2xl shadow-lg p-6 w-64 h-44 flex items-center justify-center cursor-pointer transition-transform transform hover:scale-105"
            onClick={() => handleScratch(index)}
          >
            {/* Scratchable Overlay - Only one card can be scratched at a time */}
            {scratchedIndex !== index && (
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-500 flex items-center justify-center rounded-2xl text-white text-xl font-bold">
                Scratch Here!
              </div>
            )}

            {/* Revealed Coupon Content */}
            {scratchedIndex === index && (
              <div className="text-center">
                <h2 className="text-3xl font-bold text-orange-600">
                  {coupon.discount} OFF
                </h2>
                <p className="text-gray-700 mt-2 text-lg">
                  at {coupon.restaurant}
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  Redeem Code: <span className="font-bold text-black">{coupon.code}</span>
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <p className="text-gray-600 text-sm mt-10">
        © 2025. Your Company Name. <br />
        <span className="underline cursor-pointer">Privacy Policy</span>
      </p>
    </div>
  );
};

export default RewardPage;