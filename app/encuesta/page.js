"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Accordion, AccordionItem } from "@nextui-org/react";

export default function Home({ searchParams }) {
  const { id } = searchParams;
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ratings, setRatings] = useState({
    question1: 0,
    question2: 0,
    question3: 0,
    solutionApproval: "",
  });

  useEffect(() => {
    if (id) {
      setLoading(true);
      setError(null);
      axios
        .get(
          `https://backendmintickets-production.up.railway.app/tickets/${id}`
        )
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
    const { question1, question2, question3, solutionApproval } = ratings;
    if (question1 && question2 && question3 && solutionApproval) {
      axios
        .post(
          `https://backendmintickets-production.up.railway.app/tickets/${id}/rate`,
          {
            tiempo_de_respuesta: ratings.question1,
            actitud: ratings.question2,
            respuesta: ratings.question3,
            solutionApproval: ratings.solutionApproval,
          }
        )
        .then((response) => {
          toast.success(
            "Sus respuestas han sido enviadas. ¡Gracias por responder!"
          );
        })
        .catch((error) => {
          toast.error(
            "Error al enviar la encuesta. Por favor, intente más tarde."
          );
        });
    } else {
      toast.error("Por favor, responda todas las preguntas antes de enviar.");
    }
  };

  if (loading) {
    return <div className="text-center py-10 text-black">Cargando...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  if (!ticket) {
    return (
      <div className="text-center py-10 text-black">
        No se encontró el ticket.
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <ToastContainer />
      <div className="p-6 bg-white text-black rounded-lg shadow-lg w-5/6">
        <div className="mb-8 text-center">
          <Image
            src="/assets/img/avatar.png"
            alt="Logo"
            className="h-20 w-25 mx-auto"
            width={100}
            height={100}
          />
          <h1 className="text-2xl font-bold mt-4 text-[#4a53a0]">
            ENCUESTA TICKET #{ticket.id}
          </h1>
        </div>

        <Accordion className="mb-8">
          <AccordionItem key="1" aria-label="Tema" title={<span>Tema</span>}>
            <p className="font-normal">{ticket.tema}</p>
          </AccordionItem>
          <AccordionItem
            key="2"
            aria-label="Especialista"
            title={<span>Especialista</span>}
          >
            <p className="font-normal">{ticket.especialista_nombre}</p>
          </AccordionItem>
          <AccordionItem
            key="3"
            aria-label="Descripción del caso"
            title={<span>Descripción del caso</span>}
          >
            <p className="font-normal">{ticket.descripcion_caso}</p>
          </AccordionItem>
          <AccordionItem
            key="4"
            aria-label="Solución"
            title={<span>Solución</span>}
          >
            <p className="font-normal">{ticket.solucion_caso}</p>
          </AccordionItem>
        </Accordion>

        <h2 className="text-xl font-bold mb-4 pt-8 text-center text-black">
          SEGÚN SU RESPUESTA CALIFIQUE LO SIGUIENTE:
        </h2>

        <div className="text-center text-black">
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

          <div>
            <h2 className="text-lg font-semibold mb-2">
              ¿Aprueba la solución del ticket?
            </h2>
            <div className="flex justify-center space-x-4 mb-6">
              <button
                className={`px-4 py-2 rounded-full border ${
                  ratings.solutionApproval === "Sí"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-black"
                }`}
                onClick={() => handleRatingChange("solutionApproval", "Sí")}
              >
                Sí
              </button>
              <button
                className={`px-4 py-2 rounded-full border ${
                  ratings.solutionApproval === "No"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-black"
                }`}
                onClick={() => handleRatingChange("solutionApproval", "No")}
              >
                No
              </button>
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
