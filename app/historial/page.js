"use client";
import React, { useState } from "react";
import axios from "axios";
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Home = () => {
  const [ticketId, setTicketId] = useState("");
  const [ticketData, setTicketData] = useState(null);
  const [error, setError] = useState("");

  const fetchTicket = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/tickets/${ticketId}`
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

  // Función para determinar la clase de color del estado
  const getColorClass = () => {
    if (ticketData && ticketData.estado === "Solucionado") {
      return "bg-green-500";
    } else if (ticketData && ticketData.estado === "En proceso") {
      return "bg-orange-500";
    } else if (ticketData && ticketData.estado === "Creado") {
      return "bg-red-500";
    }
    return "";
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <ToastContainer />
      <div className="w-5/6 p-6 shadow-lg bg-white rounded-md flex">
        <div className="mr-10">
          <Image
            src="/assets/img/avatar.png"
            alt="Logo"
            className="h-20 w-25"
            width={100}
            height={100}
          />
        </div>
        <div className="flex-1">
          <h3 className="text-2xl mb-4 text-black">Buscar Ticket</h3>
          <div className="flex items-center mb-4 text-black">
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
          {error && <p className="text-red-500">{error}</p>}
          {ticketData && (
            <div className="mt-4 text-black flex flex-col items-center">
              <div
                className={`py-5 w-1/6 rounded-md text-center ${getColorClass()}`}
              >
                <p className="font-bold">Estado del Ticket:</p>
                <p>{ticketData.estado}</p>
              </div>
              <div className="py-5 text-center">
                <p className="font-bold">ID del Ticket:</p>
                <p>{ticketData.id}</p>
              </div>
              <div className="py-5 text-center">
                <p className="font-bold">Especialista Asignado:</p>
                <p>{ticketData.especialista_nombre}</p>
              </div>
              <div className="py-5 text-center">
                <p className="font-bold">Tema del Ticket:</p>
                <p>{ticketData.tema}</p>
              </div>
              <div className="py-5 text-center">
                <p className="font-bold">Descripción del Caso:</p>
                <p>{ticketData.descripcion_caso}</p>
              </div>
              {ticketData.estado === "Solucionado" && (
                <div className="py-5 text-center">
                  <p className="font-bold">Solución del Caso:</p>
                  <p>{ticketData.solucion_caso}</p>
                </div>
              )}
              {ticketData.estado === "Solucionado" &&
                ticketData.fecha_finalizacion && (
                  <div className="py-5 text-center">
                    <p className="font-bold">Fecha de Finalización:</p>
                    <p>{ticketData.fecha_finalizacion}</p>
                  </div>
                )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
