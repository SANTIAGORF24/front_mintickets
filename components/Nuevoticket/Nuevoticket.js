import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@nextui-org/react";
import Autocomplete from "./Autocomplete"; // Importa el componente Autocomplete personalizado

export function Nuevoticket() {
  const [descripcionValue, setDescripcionValue] = useState("");
  const [solucionValue, setSolucionValue] = useState("");
  const [topics, setTopics] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [terceros, setTerceros] = useState([]);
  const [users, setUsers] = useState([]);
  const [ticketCreated, setTicketCreated] = useState(false);

  // Llamadas a la API para obtener los datos iniciales
  useEffect(() => {
    // Función para obtener los datos de la API y establecer los estados correspondientes
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

    // Llamada a la función para obtener los datos
    fetchData();
  }, []);

  // Manejadores de estado para los valores seleccionados
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedTercero, setSelectedTercero] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  // Lógica para manejar la presentación y envío del formulario
  const handleSubmit = async () => {
    try {
      // Validación de que se hayan seleccionado todos los campos
      if (
        !selectedTopic ||
        !selectedStatus ||
        !selectedTercero ||
        !selectedUser
      ) {
        console.error("Por favor, selecciona valores en todos los campos.");
        return;
      }

      // Crear los datos de envío del ticket usando los valores seleccionados
      const ticketData = {
        fecha_creacion: new Date().toISOString(),
        tema: selectedTopic.name,
        estado: selectedStatus.name,
        tercero_nombre: selectedTercero.name,
        especialista_nombre: selectedUser.name,
        descripcion_caso: descripcionValue,
        solucion_caso: solucionValue,
      };

      // Enviar los datos del ticket a tu API backend para su registro
      const response = await axios.post(
        "http://127.0.0.1:5000/tickets/register",
        ticketData
      );
      console.log("Ticket creado:", response.data);
      setTicketCreated(true);
      setTimeout(() => {
        window.location.reload();
      }, 2000); // Recargar la página después de 3 segundos
    } catch (error) {
      console.error("Error al crear el ticket:", error);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center w-full py-10">
        <div className="w-4/6 ">
          <div className="w-full flex items-center justify-center">
            <h2 className="text-[#4a53a0] text-3xl font-bold text-center mb-4">
              Nuevo ticket
            </h2>
          </div>
          <div className="flex space-x-10 items-center justify-center h-full py-10">
            <div className="flex flex-col space-y-7 w-2/6">
              <Autocomplete
                items={topics}
                label="Tema"
                placeholder="Seleccionar tema"
                onSelect={(value) => setSelectedTopic(value)}
              />
              <Autocomplete
                items={statuses}
                label="Estado del ticket"
                placeholder="Selecciona un estado del ticket"
                onSelect={(value) => setSelectedStatus(value)}
              />
              <Autocomplete
                items={terceros}
                label="Seleccionar tercero"
                placeholder="Seleccionar tercero"
                onSelect={(value) => setSelectedTercero(value)}
              />
              <Autocomplete
                items={users}
                label="Especialista"
                placeholder="Selecciona un Especialista"
                onSelect={(value) => setSelectedUser(value)}
              />
            </div>
            <div className="w-4/6">
              <p className="text-[#4a53a0] font-bold text-xl ">
                Descripcion del caso:
              </p>
              <textarea
                className="w-full h-[150px] p-2 border border-gray-300 rounded text-black bg-slate-100"
                value={descripcionValue}
                onChange={(e) => setDescripcionValue(e.target.value)}
                placeholder="Descripcion del caso"
              />
              <p className="text-[#4a53a0] font-bold text-xl">
                Solucion al caso:
              </p>
              <textarea
                className="w-full h-[150px] p-2 border border-gray-300 rounded text-black bg-slate-100"
                value={solucionValue}
                onChange={(e) => setSolucionValue(e.target.value)}
                placeholder="Solucion al caso"
              />
            </div>
          </div>
          {ticketCreated && (
            <div className="text-green-600 font-bold text-center">
              Caso creado
            </div>
          )}
          <Button
            className="w-full  bg-[#4a53a0]"
            color="primary"
            onClick={handleSubmit}
          >
            Crear Ticket
          </Button>
        </div>
      </div>
    </>
  );
}
