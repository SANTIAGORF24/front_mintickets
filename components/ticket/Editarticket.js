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

  const [solucionImages, setSolucionImages] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const topicsResponse = await axios.get("http://127.0.0.1:5000/topics");
        setTopics(topicsResponse.data.topics);

        const statusesResponse = await axios.get(
          "http://127.0.0.1:5000/status"
        );
        setStatuses(statusesResponse.data.status);

        const tercerosResponse = await axios.get(
          "http://127.0.0.1:5000/terceros"
        );
        setTerceros(tercerosResponse.data.terceros);

        const usersResponse = await axios.get(
          "http://127.0.0.1:5000/auth/users/names"
        );
        setUsers(usersResponse.data.user_names);
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
        tema: selectedTopic ? selectedTopic.name : ticketData.tema,
        estado: selectedStatus ? selectedStatus.name : ticketData.estado,
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
      };

      await axios.patch(
        `http://127.0.0.1:5000/tickets/${ticketDataToUpdate.id}`,
        ticketDataToUpdate
      );

      toast.success("Tus cambios se han guardado correctamente");

      onTicketUpdate(ticketDataToUpdate); // Call the callback function with the updated ticket data

      setTimeout(() => {
        setIsOpen(false);
      }, 2000);
    } catch (error) {
      console.error("Error al actualizar el ticket:", error);
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
      };

      await axios.put(
        `http://127.0.0.1:5000/tickets/${ticketDataToUpdate.id}/finalize`,
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

  return (
    <>
      <Button className="bg-transparent" onPress={openModal}>
        <span className="text-lg cursor-pointer active:opacity-50 text-blue-600">
          <EditIcon />
        </span>
      </Button>

      <Modal isOpen={isOpen} onClose={closeModal} size="5xl">
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
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Tercero:
                    </label>
                    <Autocomplete
                      items={terceros}
                      label="Seleccionar tercero"
                      placeholder="Seleccionar tercero"
                      onSelect={(value) => {
                        setSelectedTercero(value);
                        setSelectedTerceroEmail(value.email);
                      }}
                      defaultValue={ticketData ? ticketData.tercero_nombre : ""}
                    />
                    {selectedTerceroEmail && (
                      <h3 className="text-[#4a53a0] text-lg mt-2">
                        {selectedTerceroEmail}
                      </h3>
                    )}
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Especialista:
                    </label>
                    <Autocomplete
                      items={users}
                      label="Seleccionar especialista"
                      placeholder="Seleccionar especialista"
                      onSelect={(value) => {
                        setSelectedUser(value);
                        setSelectedUserEmail(value.email);
                      }}
                      defaultValue={
                        ticketData ? ticketData.especialista_nombre : ""
                      }
                    />
                    {selectedUserEmail && (
                      <h3 className="text-[#4a53a0] text-lg mt-2">
                        {selectedUserEmail}
                      </h3>
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
                      value={solucionValue}
                      onChange={(e) => setSolucionValue(e.target.value)}
                    ></textarea>
                    {finalizeError && (
                      <div className="text-red-500 text-sm mt-1">
                        {finalizeError}
                      </div>
                    )}
                    <input
                      type="file"
                      ref={fileInputRef}
                      multiple
                      style={{ display: "none" }}
                      onChange={(e) =>
                        handleImageUpload(e.target.files, setSolucionImages)
                      }
                    />
                    <div
                      onDrop={(e) => handleDrop(e, setSolucionImages)}
                      onDragOver={handleDragOver}
                      className="border-2 border-dashed border-gray-400 rounded-lg p-4 mt-2"
                      style={{ cursor: "pointer" }}
                      onClick={handleSelectImagesClick}
                    >
                      <p className="text-center text-gray-500">
                        Arrastra y suelta las imágenes aquí o haz clic para
                        seleccionar
                      </p>
                    </div>
                    <div className="flex flex-wrap mt-2">
                      {solucionImages.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Solucion ${index}`}
                          className="w-24 h-24 object-cover m-1"
                        />
                      ))}
                    </div>
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
