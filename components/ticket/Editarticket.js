import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import Autocomplete from "./Autocomplete";
import { EditIcon } from "./Iconsactions";
import emailjs from "emailjs-com";

export function Editarticket({ ticketData }) {
  const [descripcionValue, setDescripcionValue] = useState(
    ticketData ? ticketData.descripcion_caso : ""
  );
  const [solucionValue, setSolucionValue] = useState(
    ticketData ? ticketData.solucion_caso : ""
  );
  const [topics, setTopics] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [terceros, setTerceros] = useState([]);
  const [users, setUsers] = useState([]);
  const [isUpdated, setIsUpdated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [finalizeMessage, setFinalizeMessage] = useState("");
  const [finalizeError, setFinalizeError] = useState("");

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

  const handleSubmit = async () => {
    try {
      const ticketDataToUpdate = {
        id: ticketData.id,
        fecha_creacion: ticketData.fecha_creacion,
        fecha_finalizacion: new Date().toISOString(),
        tema: selectedTopic ? selectedTopic.name : ticketData.tema,
        estado: selectedStatus ? selectedStatus.name : ticketData.estado,
        tercero_nombre: selectedTercero
          ? selectedTercero.name
          : ticketData.tercero_nombre,
        especialista_nombre: selectedUser
          ? selectedUser.name
          : ticketData.especialista_nombre,
        descripcion_caso: descripcionValue,
        solucion_caso: solucionValue,
      };

      const response = await axios.put(
        `http://127.0.0.1:5000/tickets/${ticketDataToUpdate.id}`,
        ticketDataToUpdate
      );
      console.log("Ticket actualizado:", response.data);
      setSuccessMessage("Tus cambios se han guardado.");

      setTimeout(() => {
        setSuccessMessage("");
        setIsOpen(false);
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Error al actualizar el ticket:", error);
    }
  };

  const handleFinalize = async () => {
    try {
      if (!solucionValue) {
        setFinalizeError("Por favor, ingresa una solución al caso.");
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
      };

      const response = await axios.put(
        `http://127.0.0.1:5000/tickets/${ticketDataToUpdate.id}/finalize`,
        ticketDataToUpdate
      );
      console.log("Ticket solucionado:", response.data);

      setFinalizeMessage("El ticket se ha finalizado.");

      setTimeout(() => {
        setFinalizeMessage("");
        setIsOpen(false);
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Error al finalizar el ticket:", error);
    }
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setFinalizeError("");
  };

  const handleUpdate = async () => {
    try {
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
      };

      console.log("Datos a actualizar:", ticketDataToUpdate);

      await axios.patch(
        `http://127.0.0.1:5000/tickets/${ticketDataToUpdate.id}`,
        ticketDataToUpdate
      );

      setSuccessMessage("Tus cambios se han guardado.");

      setTimeout(() => {
        setSuccessMessage("");
        setIsOpen(false);
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Error al actualizar el ticket:", error);
    }
  };

  return (
    <>
      <Button className="bg-transparent" onPress={openModal}>
        <span className="text-lg cursor-pointer active:opacity-50 text-blue-600">
          <EditIcon />
        </span>
      </Button>

      <Modal isOpen={isOpen} onClose={closeModal}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Editar ticket
          </ModalHeader>
          <ModalBody>
            <div className="flex flex-col space-y-7">
              <Autocomplete
                items={topics}
                label="Tema"
                placeholder="Seleccionar tema"
                onSelect={(value) => setSelectedTopic(value)}
                defaultValue={ticketData ? ticketData.tema : ""}
              />
              <Autocomplete
                items={statuses.filter(
                  (status) => status.name !== "Solucionado"
                )}
                label="Estado del ticket"
                placeholder="Selecciona un estado del ticket"
                onSelect={(value) => setSelectedStatus(value)}
                defaultValue={ticketData ? ticketData.estado : ""}
              />
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
                  Correo: {selectedTerceroEmail}
                </h3>
              )}
              <Autocomplete
                items={users}
                label="Especialista"
                placeholder="Selecciona un Especialista"
                onSelect={(value) => {
                  setSelectedUser(value);
                  setSelectedUserEmail(value.email);
                }}
                defaultValue={ticketData ? ticketData.especialista_nombre : ""}
              />
              {selectedUserEmail && (
                <h3 className="text-[#4a53a0] text-lg mt-2">
                  Correo: {selectedUserEmail}
                </h3>
              )}
            </div>
            <div>
              <p className="text-[#4a53a0] font-bold text-xl">
                Descripción del caso:
              </p>
              <textarea
                className="w-full h-[150px] p-2 border border-gray-300 rounded text-black bg-slate-100"
                value={descripcionValue}
                onChange={(e) => setDescripcionValue(e.target.value)}
                placeholder="Descripción del caso"
              />
              <p className="text-[#4a53a0] font-bold text-xl">
                Solución al caso:
              </p>
              <textarea
                className="w-full h-[150px] p-2 border border-gray-300 rounded text-black bg-slate-100"
                value={solucionValue}
                onChange={(e) => setSolucionValue(e.target.value)}
                placeholder="Solución al caso"
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={closeModal}>
              Cancelar
            </Button>
            <Button color="primary" onClick={handleUpdate}>
              Guardar
            </Button>
            {selectedStatus && selectedStatus.name === "En proceso" && (
              <Button color="success" onPress={handleFinalize}>
                Finalizar
              </Button>
            )}
          </ModalFooter>
          {successMessage && (
            <div className="text-green-600 text-center">{successMessage}</div>
          )}
          {finalizeMessage && (
            <div className="text-green-600 text-center">{finalizeMessage}</div>
          )}
          {finalizeError && (
            <div className="text-red-600 text-center">{finalizeError}</div>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
