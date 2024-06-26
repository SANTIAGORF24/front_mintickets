"use client";
import React, { useState } from "react";
import { Navbaruser } from "@/components/NavBar/Navbaruser";

export default function Home() {
  const [ratings, setRatings] = useState({
    attitude: 0,
    speed: 0,
    response: 0,
    solution: 0,
  });

  const handleRatingChange = (category, value) => {
    setRatings((prevRatings) => ({
      ...prevRatings,
      [category]: value,
    }));
  };

  const handleSubmit = () => {
    // Aquí puedes enviar los datos a tu base de datos
    console.log(ratings);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white text-black rounded-lg shadow-lg w-full max-w-md">
        <div className="mb-8 text-center">
          <h2 className="text-xl font-bold mb-4">TEMA:</h2>
          <h2 className="text-xl font-bold mb-4">Especialista</h2>
          <h2 className="text-xl font-bold mb-4">Descripción del caso</h2>
          <h2 className="text-xl font-bold mb-4">Solución:</h2>
        </div>

        <div className="text-center">
          <h2 className="text-lg font-semibold mb-2">
            Califique la actitud del especialista
          </h2>
          <div className="flex justify-center space-x-2 mb-6">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                className={`px-4 py-2 rounded-full border ${
                  ratings.attitude === value
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-black"
                }`}
                onClick={() => handleRatingChange("attitude", value)}
              >
                {value}
              </button>
            ))}
          </div>

          <h2 className="text-lg font-semibold mb-2">
            Califique la velocidad con la que se solucionó el ticket
          </h2>
          <div className="flex justify-center space-x-2 mb-6">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                className={`px-4 py-2 rounded-full border ${
                  ratings.speed === value
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-black"
                }`}
                onClick={() => handleRatingChange("speed", value)}
              >
                {value}
              </button>
            ))}
          </div>

          <h2 className="text-lg font-semibold mb-2">
            Califique la respuesta del especialista
          </h2>
          <div className="flex justify-center space-x-2 mb-6">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                className={`px-4 py-2 rounded-full border ${
                  ratings.response === value
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-black"
                }`}
                onClick={() => handleRatingChange("response", value)}
              >
                {value}
              </button>
            ))}
          </div>

          <h2 className="text-lg font-semibold mb-2">Califique la solución</h2>
          <div className="flex justify-center space-x-2 mb-6">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                className={`px-4 py-2 rounded-full border ${
                  ratings.solution === value
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-black"
                }`}
                onClick={() => handleRatingChange("solution", value)}
              >
                {value}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-full"
            onClick={handleSubmit}
          >
            Enviar Respuesta
          </button>
        </div>
      </div>
    </div>
  );
}
