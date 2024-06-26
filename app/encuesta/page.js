"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Home({ searchParams }) {
  const { id } = searchParams;
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ratings, setRatings] = useState({
    question1: 0,
    question2: 0,
    question3: 0,
  });

  useEffect(() => {
    if (id) {
      setLoading(true);
      setError(null);
      axios
        .get(`http://localhost:5000/tickets/${id}`)
        .then((response) => {
          setTicket(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error al obtener la información del ticket:", error);
          setError(
            "No se pudo cargar la información del ticket. Por favor, intente más tarde."
          );
          setLoading(false);
        });
    }
  }, [id]);

  const handleRatingChange = (question, value) => {
    setRatings((prevRatings) => ({
      ...prevRatings,
      [question]: value,
    }));
  };

  const handleSubmit = () => {
    console.log(ratings);
    // Ejemplo de cómo podrías enviar los datos:
    // axios.post(`http://localhost:5000/tickets/${id}/rate`, ratings)
    //   .then(response => {
    //     console.log("Calificación enviada con éxito");
    //   })
    //   .catch(error => {
    //     console.error("Error al enviar la calificación:", error);
    //   });
  };

  if (loading) {
    return <div className="text-center py-10">Cargando...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  if (!ticket) {
    return <div className="text-center py-10">No se encontró el ticket.</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white text-black rounded-lg shadow-lg w-full max-w-md">
        <div className="mb-8 text-center">
          <h2 className="text-xl font-bold mb-4">TEMA: {ticket.tema}</h2>
          <h2 className="text-xl font-bold mb-4">
            Especialista: {ticket.especialista_nombre}
          </h2>
          <h2 className="text-xl font-bold mb-4">
            Descripción del caso: {ticket.descripcion_caso}
          </h2>
          <h2 className="text-xl font-bold mb-4">
            Solución: {ticket.solucion_caso}
          </h2>
          <h2 className="text-xl font-bold mb-4">
            SEGÚN SU RESPUESTA CALIFIQUE LO SIGUIENTE:
          </h2>
        </div>

        <div className="text-center">
          <div>
            <h2 className="text-lg font-semibold mb-2">
              Tiempo en el que se le atendio
            </h2>
            <div className="flex justify-center space-x-2 mb-6">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  className={`px-4 py-2 rounded-full border ${
                    ratings.question1 === value
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-black"
                  }`}
                  onClick={() => handleRatingChange("question1", value)}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">
              Actitud del especialista
            </h2>
            <div className="flex justify-center space-x-2 mb-6">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  className={`px-4 py-2 rounded-full border ${
                    ratings.question2 === value
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-black"
                  }`}
                  onClick={() => handleRatingChange("question2", value)}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">
              Respuesta del especialista
            </h2>
            <div className="flex justify-center space-x-2 mb-6">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  className={`px-4 py-2 rounded-full border ${
                    ratings.question3 === value
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-black"
                  }`}
                  onClick={() => handleRatingChange("question3", value)}
                >
                  {value}
                </button>
              ))}
            </div>
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
