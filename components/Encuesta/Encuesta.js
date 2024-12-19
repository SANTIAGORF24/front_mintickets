// components/Encuesta.js
"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Accordion, AccordionItem } from "@nextui-org/react";
import { Download } from "react-feather";
import { Button } from "@nextui-org/react";

export default function Encuesta({ id }) {
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [surveySubmitted, setSurveySubmitted] = useState(false);
  const [surveyResult, setSurveyResult] = useState(null);

  // State for attachments
  const [descriptionAttachments, setDescriptionAttachments] = useState([]);
  const [solAttachments, setSolAttachments] = useState([]);

  // Survey ratings state
  const [ratings, setRatings] = useState({
    question1: 0,
    question2: 0,
    question3: 0,
    solutionApproval: "",
  });

  // Fetch ticket information
  useEffect(() => {
    const fetchTicketAndAttachments = async () => {
      if (!id) {
        setError("No se proporcionó un ID de ticket válido");
        setLoading(false);
        return;
      }

      try {
        // Fetch ticket details
        const ticketResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/tickets/${id}/`
        );
        setTicket(ticketResponse.data);

        // Fetch attachments
        const attachmentsResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/tickets/${id}/attachments/`
        );

        // Separate description and solution attachments
        const descAttachments = attachmentsResponse.data.filter(
          (attachment) => attachment.is_description_file === true
        );

        const solutionAttachments = attachmentsResponse.data.filter(
          (attachment) => attachment.is_description_file === false
        );

        setDescriptionAttachments(descAttachments);
        setSolAttachments(solutionAttachments);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching ticket or attachments:", error);
        setError(
          error.response?.data?.message ||
            "No se pudo cargar la información del ticket. Por favor, intente más tarde."
        );
        setLoading(false);
      }
    };

    fetchTicketAndAttachments();
  }, [id]);

  // Download attachment function
  const downloadAttachment = async (attachmentId, isDescriptionFile) => {
    try {
      const response = await axios({
        url: `${process.env.NEXT_PUBLIC_API_URL}/tickets/attachment/${attachmentId}/`,
        method: "GET",
        responseType: "blob",
      });

      // Buscar el archivo en el array correcto basado en isDescriptionFile
      const attachments = isDescriptionFile
        ? descriptionAttachments
        : solAttachments;

      const attachment = attachments.find((att) => att.id === attachmentId);

      // Crear un enlace y activar la descarga
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

  // Rating change handler
  const handleRatingChange = (question, value) => {
    setRatings((prevRatings) => ({
      ...prevRatings,
      [question]: value,
    }));
  };

  // Submit survey
  const handleSubmit = () => {
    const { question1, question2, question3, solutionApproval } = ratings;

    // Validate all fields are filled
    if (question1 && question2 && question3 && solutionApproval) {
      axios
        .post(`${process.env.NEXT_PUBLIC_API_URL}/tickets/${id}/rate/`, {
          tiempo_de_respuesta: ratings.question1,
          actitud: ratings.question2,
          respuesta: ratings.question3,
          solutionApproval: ratings.solutionApproval,
        })
        .then((response) => {
          setSurveyResult(solutionApproval);
          setSurveySubmitted(true);
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

  // Render loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center py-10 text-black">Cargando...</div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center py-10 text-red-500">{error}</div>
      </div>
    );
  }

  // Render thank you page after survey submission
  if (surveySubmitted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-blue-200">
        <div className="text-center p-10 bg-white rounded-xl shadow-2xl max-w-md">
          <Image
            src="/assets/img/avatar.png"
            alt="Soporte TICS Logo"
            className="mx-auto mb-6 h-24 w-24"
            width={100}
            height={100}
          />

          {surveyResult === "Sí" ? (
            <>
              <h1 className="text-3xl font-bold text-green-600 mb-4">
                ¡Caso Cerrado Exitosamente!
              </h1>
              <p className="text-gray-700 mb-6 text-lg">
                Gracias por confirmar la solución. El caso ha sido cerrado
                satisfactoriamente. Apreciamos su colaboración y esperamos haber
                resuelto su inconveniente.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold text-red-500 mb-4">
                Seguimiento del Caso
              </h1>
              <p className="text-gray-700 mb-6 text-lg">
                El especialista se comunicará con usted internamente. Por favor,
                esté pendiente de las plataformas de Teams y Outlook para
                validar por qué no se cerró el caso y poder solucionar su
                inconveniente.
              </p>
            </>
          )}

          <div className="flex justify-center">
            <div className="w-16 h-1 bg-blue-500 rounded-full"></div>
          </div>
          <p className="text-sm text-gray-500 mt-6">
            Juntos construimos un mejor servicio.
          </p>
        </div>
      </div>
    );
  }

  // Render survey form
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <ToastContainer />
      <div className="p-6 bg-white text-black rounded-lg shadow-lg w-5/6">
        {/* Logo and Title Section */}
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

        {/* Ticket Details Accordion */}
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
            {/* Attachments */}
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
                        onClick={() => downloadAttachment(attachment.id, true)}
                      >
                        <Download size={16} />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </AccordionItem>
          <AccordionItem
            key="4"
            aria-label="Solución"
            title={<span>Solución</span>}
          >
            <p className="font-normal">{ticket.solucion_caso}</p>
            {/* Attachments */}
            {solAttachments.length > 0 && (
              <>
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Archivos adjuntos de la Solución
                </h3>
                <div className="space-y-2">
                  {solAttachments.map((attachmentSol) => (
                    <div
                      key={attachmentSol.id}
                      className="flex justify-between items-center bg-gray-100 p-2 rounded-md"
                    >
                      <span className="text-sm text-gray-700 truncate">
                        {attachmentSol.file_name}
                      </span>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color="primary"
                        onClick={() =>
                          downloadAttachment(attachmentSol.id, false)
                        }
                      >
                        <Download size={16} />
                      </Button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </AccordionItem>
        </Accordion>

        {/* Survey Section */}
        <h2 className="text-xl font-bold mb-4 pt-8 text-center text-black">
          SEGÚN SU RESPUESTA CALIFIQUE LO SIGUIENTE:
        </h2>

        <div className="text-center text-black">
          {/* Response Time Rating */}
          <div>
            <h2 className="text-lg font-semibold mb-2">
              Tiempo en el que se le atendió
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

          {/* Specialist Attitude Rating */}
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

          {/* Specialist Response Rating */}
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

          {/* Solution Approval */}
          <div>
            <h2 className="text-lg font-semibold mb-2">
              ¿Aprueba la solución del ticket?
            </h2>
            <div className="flex justify-center space-x-4 mb-6">
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
            </div>
          </div>
        </div>

        {/* Submit Button */}
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
