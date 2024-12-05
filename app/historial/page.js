"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Progress, Accordion, AccordionItem } from "@nextui-org/react";
import { Button } from "@nextui-org/react";

import "react-toastify/dist/ReactToastify.css";
import { Search, Mail, User, Download } from "react-feather";

const Home = () => {
  const [ticketId, setTicketId] = useState("");
  const [ticketData, setTicketData] = useState(null);
  const [error, setError] = useState("");
  const [descriptionAttachments, setDescriptionAttachments] = useState([]);
  // Agrega este nuevo estado
  const [solutionAttachments, setSolutionAttachments] = useState([]);

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
  useEffect(() => {
    const fetchAttachments = async () => {
      try {
        if (ticketData && ticketData.id) {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/tickets/${ticketData.id}/attachments`
          );

          // Filter description attachments
          const descAttachments = response.data.filter(
            (attachment) => attachment.is_description_file
          );

          // Filter solution attachments (nuevo)
          const solAttachments = response.data.filter(
            (attachment) => !attachment.is_description_file
          );

          setDescriptionAttachments(descAttachments);
          setSolutionAttachments(solAttachments); // Agrega esta línea
        }
      } catch (error) {
        console.error("Error fetching attachments:", error);
        toast.error("No se pudieron cargar los archivos adjuntos");
      }
    };

    fetchAttachments();
  }, [ticketData]);

  // Modifica la función de descarga para manejar ambos tipos de archivos
  const downloadAttachment = async (attachmentId) => {
    try {
      const response = await axios({
        url: `${process.env.NEXT_PUBLIC_API_URL}/tickets/attachment/${attachmentId}`,
        method: "GET",
        responseType: "blob",
      });

      // Busca en ambos arreglos de archivos adjuntos
      const attachment =
        descriptionAttachments.find((att) => att.id === attachmentId) ||
        solutionAttachments.find((att) => att.id === attachmentId);

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        attachment ? attachment.file_name : "download"
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading attachment:", error);
      toast.error("No se pudo descargar el archivo");
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
                  <div className="space-y-2">
                    {descriptionAttachments.length > 0 && (
                      <div className="mt-4">
                        <h3 className="text-sm font-medium text-gray-700 mb-2">
                          Archivos adjuntos de la descripción
                        </h3>
                        <div className="space-y-2">
                          {descriptionAttachments.map((attachment) => (
                            <div
                              key={attachment.id}
                              className="flex justify-between items-center bg-gray-100 p-2 rounded-md"
                            >
                              <span className="text-sm text-gray-700 truncate">
                                {attachment.file_name}
                              </span>
                              <Button
                                isIconOnly
                                size="sm"
                                variant="light"
                                color="primary"
                                onClick={() =>
                                  downloadAttachment(attachment.id)
                                }
                              >
                                <Download size={16} />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </AccordionItem>
                {ticketData.estado === "Solucionado" && (
                  <AccordionItem
                    key="6"
                    aria-label="Solución del Caso"
                    title="Solución del Caso"
                  >
                    <p>{ticketData.solucion_caso}</p>

                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                      Archivos adjuntos de la Solucion
                    </h3>
                    <div className="space-y-2">
                      {solutionAttachments.map((attachment) => (
                        <div
                          key={attachment.id}
                          className="flex justify-between items-center bg-gray-100 p-2 rounded-md"
                        >
                          <span className="text-sm text-gray-700 truncate">
                            {attachment.file_name}
                          </span>
                          <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            color="primary"
                            onClick={() => downloadAttachment(attachment.id)}
                          >
                            <Download size={16} />
                          </Button>
                        </div>
                      ))}
                    </div>
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
