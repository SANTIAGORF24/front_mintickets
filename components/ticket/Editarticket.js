import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  CircularProgress,
} from "@nextui-org/react";
import Autocomplete from "./Autocomplete";
import { EditIcon } from "./Iconsactions";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Search, Mail, User, Download } from "react-feather";
import { FileUp, Paperclip } from "lucide-react";

import TerceroAutocomplete from "./TerceroAutocomplete";
import SpecialistAutocomplete from "./SpecialistAutocomplete";

export function Editarticket({ ticketData, onTicketUpdate }) {
  const [descripcionValue, setDescripcionValue] = useState(
    ticketData && ticketData.descripcion_caso ? ticketData.descripcion_caso : ""
  );
  const [solucionValue, setSolucionValue] = useState(
    ticketData && ticketData.solucion_caso ? ticketData.solucion_caso : ""
  );
  const [topics, setTopics] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [terceros, setTerceros] = useState([]);
  const [users, setUsers] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [finalizeError, setFinalizeError] = useState("");
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [loadingFinalize, setLoadingFinalize] = useState(false);

  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedTercero, setSelectedTercero] = useState(null);
  const [selectedTerceroEmail, setSelectedTerceroEmail] = useState(
    ticketData ? ticketData.tercero_email : null
  );
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserEmail, setSelectedUserEmail] = useState(
    ticketData ? ticketData.especialista_email : null
  );
  const [descriptionAttachments, setDescriptionAttachments] = useState([]);
  const [solAttachments, setsolAttachments] = useState([]);

  const [attachments, setAttachments] = useState([]);

  const [solucionImages, setSolucionImages] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const topicsResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/topics`
        );
        setTopics(topicsResponse.data.topics);

        const statusesResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/status`
        );
        setStatuses(statusesResponse.data.status);

        const tercerosResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/tercerosda`
        );
        setTerceros(tercerosResponse.data.terceros);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (ticketData && ticketData.estado) {
      const initialStatus = statuses.find(
        (status) => status.name === ticketData.estado
      );
      setSelectedStatus(initialStatus || null);
    }
  }, [ticketData, statuses]);

  const handleImageUpload = (files, setter) => {
    const filePromises = Array.from(files).map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
      });
    });
    const filtered = tickets.filter(
      (ticket) =>
        ticket.especialista_nombre && // Add this check first
        ticket.especialista_nombre.toLowerCase() ===
          userFullName.toLowerCase() &&
        ticket.estado && // Add this check for estado as well
        !ticket.estado.toLowerCase().includes("solucionado") &&
        (filterValue === "" ||
          ticket.tema.toLowerCase().includes(filterValue.toLowerCase()))
    );

    Promise.all(filePromises).then((base64Images) => {
      setter((prevImages) => [...prevImages, ...base64Images]);
    });
  };

  const handleDrop = (event, setter) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    handleImageUpload(files, setter);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleUpdate = async () => {
    try {
      setLoadingUpdate(true);

      const ticketDataToUpdate = {
        id: ticketData.id,
        fecha_creacion: ticketData.fecha_creacion,
        tema: selectedTopic?.name || ticketData.tema || "",
        estado: selectedStatus?.name || ticketData.estado || "",
        tercero_nombre:
          selectedTercero?.name || ticketData.tercero_nombre || "",
        tercero_email: selectedTercero?.email || ticketData.tercero_email || "",
        especialista_nombre:
          selectedUser?.name || ticketData.especialista_nombre || "",
        especialista_email:
          selectedUser?.email || ticketData.especialista_email || "",
        descripcion_caso: descripcionValue || "",
        solucion_caso: solucionValue || "",
        solucion_images: solucionImages || [],
        attachments: attachments,
      };

      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/tickets/${ticketDataToUpdate.id}`,
        ticketDataToUpdate
      );

      toast.success("Tus cambios se han guardado correctamente");

      onTicketUpdate(ticketDataToUpdate);

      setTimeout(() => {
        setIsOpen(false);
      }, 2000);
    } catch (error) {
      console.error("Error al actualizar el ticket:", error);
      toast.error("No se pudieron guardar los cambios");
    } finally {
      setLoadingUpdate(false);
    }
  };

  const handleFinalize = async () => {
    try {
      setLoadingFinalize(true);

      if (!solucionValue) {
        setFinalizeError("Por favor, ingresa una solución al caso.");
        toast.error("Por favor, ingresa una solución al caso.");
        return;
      }

      const ticketDataToUpdate = {
        id: ticketData.id,
        fecha_creacion: ticketData.fecha_creacion,
        fecha_finalizacion: new Date().toISOString(),
        tema: selectedTopic ? selectedTopic.name : ticketData.tema,
        estado: "Solucionado",
        tercero_nombre: selectedTercero
          ? selectedTercero.name
          : ticketData.tercero_nombre,
        tercero_email: selectedTercero
          ? selectedTercero.email
          : ticketData.tercero_email,
        especialista_nombre: selectedUser
          ? selectedUser.name
          : ticketData.especialista_nombre,
        especialista_email: selectedUser
          ? selectedUser.email
          : ticketData.especialista_email,
        descripcion_caso: descripcionValue,
        solucion_caso: solucionValue,
        solucion_images: solucionImages,
        attachments: attachments,
      };

      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/tickets/${ticketDataToUpdate.id}/finalize`,
        ticketDataToUpdate
      );

      toast.success("El ticket se ha finalizado correctamente");

      onTicketUpdate(ticketDataToUpdate);

      setTimeout(() => {
        setIsOpen(false);
      }, 2000);
    } catch (error) {
      toast.error("Error al finalizar el ticket.");
      console.error("Error al finalizar el ticket:", error);
    } finally {
      setLoadingFinalize(false);
    }
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setFinalizeError("");
  };

  const handleSelectImagesClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Fetch attachments for a specific ticket

  useEffect(() => {
    const fetchAttachments = async () => {
      try {
        if (ticketData && ticketData.id) {
          // Cambia esta línea a la ruta general de attachments
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/tickets/${ticketData.id}/attachments`
          );

          // Filtrar archivos adjuntos de descripción
          const descAttachments = response.data.filter(
            (attachment) => attachment.is_description_file === true
          );

          // Filtrar archivos adjuntos de solución
          const solucionAttachments = response.data.filter(
            (attachment) => attachment.is_description_file === false
          );

          setDescriptionAttachments(descAttachments);
          setsolAttachments(solucionAttachments);

          // Si también necesitas guardar los archivos de solución
          // setSolucionAttachments(solucionAttachments);
        }
      } catch (error) {
        console.error("Error fetching attachments:", error);
        toast.error("No se pudieron cargar los archivos adjuntos");
      }
    };

    fetchAttachments();
  }, [ticketData]);

  // Download attachment function
  const downloadAttachment = async (attachmentId, isDescriptionFile) => {
    try {
      const response = await axios({
        url: `${process.env.NEXT_PUBLIC_API_URL}/tickets/attachment/${attachmentId}`,
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
  const handlePastedImage = (event) => {
    const items = event.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            setAttachments((prevAttachments) => [
              ...prevAttachments,
              {
                fileName: `pasted-image-${new Date().toISOString()}.png`,
                fileType: file.type,
                base64Content: e.target.result,
              },
            ]);
          };
          reader.readAsDataURL(file);
        }
      }
    }
  };

  // Handle file upload
  const handleFileUpload = (files) => {
    const newFiles = Array.from(files).map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve({
            fileName: file.name,
            fileType: file.type,
            base64Content: e.target.result,
          });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(newFiles).then((processedFiles) => {
      setAttachments((prevAttachments) => [
        ...prevAttachments,
        ...processedFiles,
      ]);
    });
  };

  // Remove attachment
  const removeAttachment = (index) => {
    setAttachments((prevAttachments) =>
      prevAttachments.filter((_, i) => i !== index)
    );
  };

  // Render method for attachments
  const renderAttachments = () => {
    return attachments.map((attachment, index) => {
      const fileIcon = getFileIcon(attachment.fileType);
      return (
        <div
          key={index}
          className="flex items-center bg-gray-100 p-2 rounded-lg mb-2"
        >
          {fileIcon}
          <span className="ml-2 flex-grow truncate">{attachment.fileName}</span>
          <button
            onClick={() => removeAttachment(index)}
            className="text-red-500 hover:text-red-700"
          >
            ✕
          </button>
        </div>
      );
    });
  };

  // Helper function to get file icon based on file type
  const getFileIcon = (fileType) => {
    if (fileType.startsWith("image/"))
      return <img src="/image-icon.svg" className="w-6 h-6" />;
    if (fileType === "application/pdf")
      return <img src="/pdf-icon.svg" className="w-6 h-6" />;
    if (
      fileType === "application/vnd.ms-powerpoint" ||
      fileType ===
        "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    )
      return <img src="/ppt-icon.svg" className="w-6 h-6" />;
    if (fileType.startsWith("video/"))
      return <img src="/video-icon.svg" className="w-6 h-6" />;
    return <Paperclip className="w-6 h-6 text-gray-500" />;
  };

  return (
    <>
      <Button className="bg-transparent" onPress={openModal}>
        <span className="text-lg cursor-pointer active:opacity-50 text-blue-600">
          <EditIcon />
        </span>
      </Button>

      <Modal isOpen={isOpen} onClose={closeModal} size="5xl" backdrop="blur">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1 text-blue-600">
            Editar ticket
          </ModalHeader>
          <ModalBody>
            <ToastContainer /> {/* ToastContainer dentro del ModalBody */}
            <div className="flex flex-col space-y-7">
              <div className="flex">
                <div className="w-1/2 pr-4">
                  <h2 className="text-blue-600 mb-2">Datos del ticket</h2>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Tema:
                    </label>
                    <Autocomplete
                      items={topics}
                      label="Tema"
                      placeholder="Seleccionar tema"
                      onSelect={(value) => setSelectedTopic(value)}
                      defaultValue={ticketData ? ticketData.tema : ""}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Estado:
                    </label>
                    <Autocomplete
                      items={statuses.filter(
                        (status) => status.name !== "Solucionado"
                      )}
                      label="Estado del ticket"
                      placeholder="Selecciona un estado del ticket"
                      onSelect={(value) => setSelectedStatus(value)}
                      defaultValue={ticketData ? ticketData.estado : ""}
                    />
                  </div>
                  <div className="text-black">
                    <label className="block text-[#4a53a0] font-semibold mb-2">
                      Tercero
                    </label>
                    <TerceroAutocomplete
                      usuarios={terceros}
                      onSelect={(value) => {
                        setSelectedTercero(value);
                        setSelectedTerceroEmail(value ? value.email : null);
                      }}
                      initialValue={
                        ticketData
                          ? {
                              name: ticketData.tercero_nombre,
                              fullName: ticketData.tercero_nombre,
                              email: ticketData.tercero_email,
                            }
                          : null
                      }
                    />
                    {selectedTerceroEmail && (
                      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg text-black mt-2">
                        <h3 className="text-lg font-bold text-blue-800 mb-3">
                          Detalles del Tercero
                        </h3>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <Mail className="mr-3 text-blue-600" />
                            <span className="text-gray-700">
                              {selectedTerceroEmail}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Especialista */}
                  <div className="text-black">
                    <label className="block text-[#4a53a0] font-semibold mb-2">
                      Especialista
                    </label>
                    <SpecialistAutocomplete
                      onSelect={(specialist) => {
                        setSelectedUser(specialist);
                        setSelectedUserEmail(
                          specialist ? specialist.email : null
                        );
                      }}
                      initialValue={
                        ticketData
                          ? {
                              name: ticketData.especialista_nombre,
                              fullName: ticketData.especialista_nombre,
                              email: ticketData.especialista_email,
                            }
                          : null
                      }
                    />
                    {selectedUserEmail && (
                      <p className="text-sm text-gray-500 mt-2">
                        Correo: {selectedUserEmail}
                      </p>
                    )}
                  </div>
                </div>
                <div className="w-1/2 pl-4">
                  <div>
                    <label
                      htmlFor="descripcion_caso"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Descripción del caso
                    </label>
                    <textarea
                      id="descripcion_caso"
                      name="descripcion_caso"
                      rows="3"
                      className="mt-1 block w-full rounded-md bg-slate-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-black p-3"
                      value={descripcionValue}
                      onChange={(e) => setDescripcionValue(e.target.value)}
                    ></textarea>
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
                                  downloadAttachment(attachment.id, true)
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
                  <div>
                    <label
                      htmlFor="solucion_caso"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Solución del caso
                    </label>
                    <textarea
                      id="solucion_caso"
                      name="solucion_caso"
                      rows="3"
                      className="mt-1 block w-full rounded-md bg-slate-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-black p-3"
                      placeholder="Escriba la solucion al caso... Puedes pegar imágenes directamente aquí."
                      value={solucionValue}
                      onPaste={handlePastedImage}
                      onChange={(e) => setSolucionValue(e.target.value)}
                    ></textarea>
                    {finalizeError && (
                      <div className="text-red-500 text-sm mt-1">
                        {finalizeError}
                      </div>
                    )}

                    {/* File Upload Section */}
                    <div className="mt-4">
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.ppt,.pptx,.mp4,.jpg,.jpeg,.png,.gif,.xls,.xlsx"
                        onChange={(e) => handleFileUpload(e.target.files)}
                        className="hidden"
                        id="fileInput"
                      />
                      <label
                        htmlFor="fileInput"
                        className="flex items-center justify-center p-3 bg-blue-50 border border-blue-200 rounded-lg cursor-pointer hover:bg-blue-100 transition text-black"
                      >
                        <FileUp className="mr-2 text-black" />+ Añadir archivos
                      </label>

                      {/* Uploaded Files Preview */}
                      {attachments.length > 0 && (
                        <div className="mt-4 space-y-2 text-black">
                          {renderAttachments()}
                        </div>
                      )}
                    </div>
                    {solAttachments.length > 0 && (
                      <div className="mt-4 text-black">
                        <h3 className="text-sm font-medium text-gray-700 mb-2">
                          Archivos adjuntos de la descripción
                        </h3>
                        <div className="space-y-2 text-black">
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
                      </div>
                    )}
                    {/* File Upload Section */}
                  </div>
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="flat" onPress={closeModal}>
              Cerrar
            </Button>
            {ticketData.estado === "En proceso" && (
              <Button
                color="primary"
                onPress={handleFinalize}
                disabled={loadingFinalize}
              >
                {loadingFinalize ? (
                  <CircularProgress size="sm" color="white" />
                ) : (
                  "Finalizar ticket"
                )}
              </Button>
            )}
            <Button
              color="success"
              onPress={handleUpdate}
              disabled={loadingUpdate}
            >
              {loadingUpdate ? (
                <CircularProgress size="sm" color="white" />
              ) : (
                "Guardar"
              )}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
