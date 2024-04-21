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

  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedTercero, setSelectedTercero] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleSubmit = async () => {
    try {
      const ticketDataToUpdate = {
        id: ticketData.id,
        fecha_creacion: ticketData.fecha_creacion,
        fecha_finalizacion: new Date().toISOString(), // Actualizar la fecha de finalización
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
      setIsUpdated(true);
      setTimeout(() => {
        setIsUpdated(false);
        setIsOpen(false); // Cerrar modal después de actualizar
        window.location.reload();
      }, 2000); // Ocultar mensaje después de 2 segundos y recargar la página
    } catch (error) {
      console.error("Error al actualizar el ticket:", error);
    }
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Button className="bg-trnasparent" onPress={openModal}>
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
                items={statuses}
                label="Estado del ticket"
                placeholder="Selecciona un estado del ticket"
                onSelect={(value) => setSelectedStatus(value)}
                defaultValue={ticketData ? ticketData.estado : ""}
              />
              <Autocomplete
                items={terceros}
                label="Seleccionar tercero"
                placeholder="Seleccionar tercero"
                onSelect={(value) => setSelectedTercero(value)}
                defaultValue={ticketData ? ticketData.tercero_nombre : ""}
              />
              <Autocomplete
                items={users}
                label="Especialista"
                placeholder="Selecciona un Especialista"
                onSelect={(value) => setSelectedUser(value)}
                defaultValue={ticketData ? ticketData.especialista_nombre : ""}
              />
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
            {isUpdated && (
              <div className="text-green-600 font-bold text-center">
                Ticket actualizado
              </div>
            )}
            <Button color="danger" variant="light" onPress={closeModal}>
              Cerrar
            </Button>
            <Button color="primary" onPress={handleSubmit}>
              Actualizar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
