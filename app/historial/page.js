"use client";
import React, { useState } from "react";
import axios from "axios";
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Progress, Accordion, AccordionItem } from "@nextui-org/react";

const Home = () => {
  const [ticketId, setTicketId] = useState("");
  const [ticketData, setTicketData] = useState(null);
  const [error, setError] = useState("");

  const fetchTicket = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/tickets/${ticketId}`
      );
      setTicketData(response.data);
      setError("");

      // Mostrar notificación según el estado del ticket
      if (response.data.estado === "Creado") {
        toast.error("Su ticket está en estado Creado", {
          position: "top-right",
          autoClose: 5000,
        });
      } else if (response.data.estado === "En proceso") {
        toast.warning("Su ticket está en estado En proceso", {
          position: "top-right",
          autoClose: 5000,
        });
      } else if (response.data.estado === "Solucionado") {
        toast.success("Su ticket ha sido resuelto", {
          position: "top-right",
          autoClose: 5000,
        });
      }
    } catch (err) {
      console.error(err);
      setError("Ticket no encontrado");
      setTicketData(null);
      toast.error("Ticket no encontrado", {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  // Función para determinar el progreso y el color
  const getProgressProps = () => {
    if (ticketData) {
      switch (ticketData.estado) {
        case "Creado":
          return { value: 10, color: "danger" };
        case "En proceso":
          return { value: 60, color: "warning" };
        case "Solucionado":
          return { value: 100, color: "success" };
        default:
          return { value: 0, color: "default" };
      }
    }
    return { value: 0, color: "default" };
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 text-black">
      <ToastContainer />
      <div className="w-full max-w-4xl p-6 shadow-lg bg-white rounded-md flex flex-col items-center">
        <div className="mb-6">
          <Image
            src="/assets/img/avatar.png"
            alt="Logo"
            className="h-20 w-25"
            width={100}
            height={100}
          />
        </div>
        <div className="flex-1 w-full">
          <h3 className="text-2xl mb-4 text-black text-center">
            Buscar Ticket
          </h3>
          <div className="flex items-center justify-center mb-4 text-black">
            <input
              type="text"
              placeholder="ID del Ticket"
              value={ticketId}
              onChange={(e) => setTicketId(e.target.value)}
              className="border-b-2 border-gray-300 focus:border-blue-500 outline-none py-2 px-4 mr-2 flex-1"
            />
            <button
              onClick={fetchTicket}
              className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600"
            >
              Buscar
            </button>
          </div>
          {error && <p className="text-red-500 text-center">{error}</p>}
          {ticketData && (
            <div className="w-full mt-4 relative flex justify-center">
              <Progress
                {...getProgressProps()}
                className="max-w-md w-full md:w-2/3"
              />
              <div className="flex justify-between w-full max-w-md absolute -bottom-6 text-xs">
                <span className="transform -translate-x-1/2 font-bold">
                  Creado
                </span>
                <span className="transform translate-x-1/2 font-bold">
                  En proceso
                </span>
                <span className="transform translate-x-1/2 font-bold">
                  Solucionado
                </span>
              </div>
            </div>
          )}
          {ticketData && (
            <div className="mt-12 w-full">
              <Accordion>
                <AccordionItem
                  key="1"
                  aria-label="Estado del Ticket"
                  title="Estado del Ticket"
                >
                  <p>{ticketData.estado}</p>
                </AccordionItem>
                <AccordionItem
                  key="2"
                  aria-label="ID del Ticket"
                  title="ID del Ticket"
                >
                  <p>{ticketData.id}</p>
                </AccordionItem>
                <AccordionItem
                  key="3"
                  aria-label="Especialista Asignado"
                  title="Especialista Asignado"
                >
                  <p>{ticketData.especialista_nombre}</p>
                </AccordionItem>
                <AccordionItem
                  key="4"
                  aria-label="Tema del Ticket"
                  title="Tema del Ticket"
                >
                  <p>{ticketData.tema}</p>
                </AccordionItem>
                <AccordionItem
                  key="5"
                  aria-label="Descripción del Caso"
                  title="Descripción del Caso"
                >
                  <p>{ticketData.descripcion_caso}</p>
                </AccordionItem>
                {ticketData.estado === "Solucionado" && (
                  <AccordionItem
                    key="6"
                    aria-label="Solución del Caso"
                    title="Solución del Caso"
                  >
                    <p>{ticketData.solucion_caso}</p>
                  </AccordionItem>
                )}
                {ticketData.estado === "Solucionado" &&
                  ticketData.fecha_finalizacion && (
                    <AccordionItem
                      key="7"
                      aria-label="Fecha de Finalización"
                      title="Fecha de Finalización"
                    >
                      <p>{ticketData.fecha_finalizacion}</p>
                    </AccordionItem>
                  )}
              </Accordion>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
