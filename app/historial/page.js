"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Search,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  RefreshCw,
} from "lucide-react";

const Home = () => {
  const [ticketId, setTicketId] = useState("");
  const [ticketData, setTicketData] = useState(null);
  const [error, setError] = useState("");
  const [descriptionAttachments, setDescriptionAttachments] = useState([]);
  const [solutionAttachments, setSolutionAttachments] = useState([]);
  const [inputError, setInputError] = useState("");

  const validateTicketId = (value) => {
    // Only allow numbers
    const numericValue = value.replace(/\D/g, "");
    setTicketId(numericValue);

    // Check if input is empty
    if (numericValue.trim() === "") {
      setInputError("El ID del ticket es obligatorio");
    } else {
      setInputError("");
    }
  };

  const fetchTicket = async () => {
    // Validate before fetching
    if (ticketId.trim() === "") {
      setInputError("El ID del ticket es obligatorio");
      return;
    }

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/tickets/${ticketId}`
      );
      setTicketData(response.data);
      setError("");

      const toastOptions = {
        position: "top-right",
        autoClose: 5000,
        className: "rounded-lg",
      };

      switch (response.data.estado) {
        case "Creado":
          toast.error("Ticket iniciado", toastOptions);
          break;
        case "En proceso":
          toast.warning("Ticket en desarrollo", toastOptions);
          break;
        case "Solucionado":
          toast.success("Ticket finalizado", toastOptions);
          break;
        case "Devuelto":
          toast.info("Ticket devuelto", toastOptions);
          break;
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

          const descAttachments = response.data.filter(
            (attachment) => attachment.is_description_file
          );

          const solAttachments = response.data.filter(
            (attachment) => !attachment.is_description_file
          );

          setDescriptionAttachments(descAttachments);
          setSolutionAttachments(solAttachments);
        }
      } catch (error) {
        console.error("Error fetching attachments:", error);
        toast.error("No se pudieron cargar los archivos adjuntos");
      }
    };

    fetchAttachments();
  }, [ticketData]);

  const downloadAttachment = async (attachmentId, isDescriptionFile) => {
    try {
      const response = await axios({
        url: `${process.env.NEXT_PUBLIC_API_URL}/tickets/attachment/${attachmentId}`,
        method: "GET",
        responseType: "blob",
      });

      const attachment = isDescriptionFile
        ? descriptionAttachments.find((att) => att.id === attachmentId)
        : solutionAttachments.find((att) => att.id === attachmentId);

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

  const getTicketStatusIcon = () => {
    switch (ticketData?.estado) {
      case "Creado":
        return (
          <div className="bg-orange-100 text-orange-600 p-3 rounded-full">
            <AlertCircle className="w-6 h-6" />
          </div>
        );
      case "En proceso":
        return (
          <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
            <Clock className="w-6 h-6" />
          </div>
        );
      case "Solucionado":
        return (
          <div className="bg-green-100 text-green-600 p-3 rounded-full">
            <CheckCircle className="w-6 h-6" />
          </div>
        );
      case "Devuelto":
        return (
          <div className="bg-purple-100 text-purple-600 p-3 rounded-full">
            <RefreshCw className="w-6 h-6" />
          </div>
        );
      default:
        return null;
    }
  };

  const getStatusBarWidth = () => {
    switch (ticketData?.estado) {
      case "Creado":
        return "w-1/4";
      case "En proceso":
        return "w-1/2";
      case "Devuelto":
        return "w-1/4";
      case "Solucionado":
        return "w-full";
      default:
        return "w-0";
    }
  };

  const getStatusBarColor = () => {
    switch (ticketData?.estado) {
      case "Creado":
        return "bg-orange-500";
      case "En proceso":
        return "bg-blue-500";
      case "Devuelto":
        return "bg-purple-500";
      case "Solucionado":
        return "bg-green-500";
      default:
        return "bg-gray-300";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 text-black">
      <ToastContainer />
      <div className="w-full max-w-7xl bg-white shadow-xl rounded-2xl overflow-hidden">
        {/* Updated Header Section */}
        <div className="bg-gray-200 p-6 flex items-center justify-between text-black">
          <div className="flex items-center space-x-4">
            <div className="text-black">
              <h1 className="text-3xl font-bold  mb-2">
                Seguimiento de Ticket
              </h1>
              <p className=" text-opacity-80">
                Consulta el estado de tu solicitud
              </p>
            </div>
          </div>
          <Image
            src="/assets/img/avatar.png"
            alt="Logo"
            width={100}
            height={100}
          />
        </div>

        <div className="p-6">
          <div className="flex space-x-4 mb-6">
            <div className="flex-grow">
              <input
                type="text"
                placeholder="Ingrese ID del Ticket"
                value={ticketId}
                onChange={(e) => validateTicketId(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    fetchTicket();
                  }
                }}
                className={`w-full px-4 py-3 border-2 ${
                  inputError
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-300 focus:border-gray-500"
                } rounded-lg focus:outline-none transition-colors`}
              />
              {inputError && (
                <p className="text-red-500 text-sm mt-1">{inputError}</p>
              )}
            </div>
            <button
              onClick={fetchTicket}
              className="bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition-colors flex items-center space-x-2"
            >
              <Search className="w-5 h-5" />
              <span>Buscar</span>
            </button>
          </div>

          {error && (
            <div className="text-red-500 text-center mb-4">{error}</div>
          )}

          {ticketData && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4 bg-gray-100 p-4 rounded-lg">
                {getTicketStatusIcon()}
                <div className="flex-grow">
                  <h2 className="text-lg font-semibold mb-2">
                    Estado: {ticketData.estado}
                  </h2>
                  <div className="w-full bg-gray-200 rounded-full h-3.5">
                    <div
                      className={`h-3.5 rounded-full ${getStatusBarColor()} ${getStatusBarWidth()} transition-all duration-300`}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2 flex items-center">
                    <FileText className="mr-2 text-gray-600" size={20} />
                    Detalles del Ticket
                  </h3>
                  <p>
                    <strong>ID:</strong> {ticketData.id}
                  </p>
                  <p>
                    <strong>Especialista:</strong>{" "}
                    {ticketData.especialista_nombre}
                  </p>
                  <p>
                    <strong>Tema:</strong> {ticketData.tema}
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Descripción</h3>
                  <p className="text-sm">{ticketData.descripcion_caso}</p>
                </div>
              </div>

              {descriptionAttachments.length > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Archivos Adjuntos</h3>
                  {descriptionAttachments.map((attachment) => (
                    <div
                      key={attachment.id}
                      className="flex justify-between items-center bg-white p-3 rounded-lg mb-2 shadow-sm"
                    >
                      <span className="truncate flex-grow mr-2">
                        {attachment.file_name}
                      </span>
                      <button
                        onClick={() => downloadAttachment(attachment.id, true)}
                        className="text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        <Download size={20} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {ticketData.estado === "Solucionado" && (
                <div className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Solución</h3>
                    <p>{ticketData.solucion_caso}</p>
                  </div>

                  {solutionAttachments.length > 0 && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">
                        Archivos de Solución
                      </h3>
                      {solutionAttachments.map((attachment) => (
                        <div
                          key={attachment.id}
                          className="flex justify-between items-center bg-white p-3 rounded-lg mb-2 shadow-sm"
                        >
                          <span className="truncate flex-grow mr-2">
                            {attachment.file_name}
                          </span>
                          <button
                            onClick={() =>
                              downloadAttachment(attachment.id, false)
                            }
                            className="text-gray-600 hover:text-gray-900 transition-colors"
                          >
                            <Download size={20} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {ticketData.fecha_finalizacion && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">
                        Fecha de Finalización
                      </h3>
                      <p>{ticketData.fecha_finalizacion}</p>
                    </div>
                  )}
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
