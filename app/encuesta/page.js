"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";

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
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(null);

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
    axios
      .post(`http://localhost:5000/tickets/${id}/rate`, {
        tiempo_de_respuesta: ratings.question1,
        actitud: ratings.question2,
        respuesta: ratings.question3,
      })
      .then((response) => {
        setMessage(
          "Muchas gracias por llenar la encuesta para poder mejorar en nuestros servicios."
        );
        setMessageType("success");
      })
      .catch((error) => {
        setMessage(
          "Error al enviar la encuesta. Por favor, intente más tarde."
        );
        setMessageType("error");
      });
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
      <div className="p-6 bg-white text-black rounded-lg shadow-lg w-5/6">
        <div className="mb-8 text-center">
          <Image
            src="/assets/img/avatar.png"
            alt="Logo"
            className="h-20 w-25"
            width={100}
            height={100}
          />

          <h2 className="text-xl font-bold mb-4">TEMA: </h2>
          <p>{ticket.tema}</p>
          <h2 className="text-xl font-bold mb-4">Especialista:</h2>
          <p>{ticket.especialista_nombre}</p>
          <h2 className="text-xl font-bold mb-4">Descripción del caso:</h2>
          <p>{ticket.descripcion_caso}</p>
          <h2 className="text-xl font-bold mb-4">Solución:</h2>
          <p>{ticket.solucion_caso}</p>
          <h2 className="text-xl font-bold mb-4 pt-8">
            SEGÚN SU RESPUESTA CALIFIQUE LO SIGUIENTE:
          </h2>
        </div>

        {message && (
          <div
            className={`text-center mb-4 ${
              messageType === "success" ? "text-green-500" : "text-red-500"
            }`}
          >
            {message}
          </div>
        )}

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
