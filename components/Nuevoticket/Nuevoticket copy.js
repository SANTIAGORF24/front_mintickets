import React, { useState, useEffect } from "react";
import { Autocomplete, AutocompleteItem, Button } from "@nextui-org/react";
import axios from "axios";

export function Nuevoticket() {
  const [descripcionValue, setDescripcionValue] = useState("");
  const [solucionValue, setSolucionValue] = useState("");
  const [topics, setTopics] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [terceros, setTerceros] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null); // Cambiado a null para evitar errores de inicialización
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedTercero, setSelectedTercero] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/topics")
      .then((response) => setTopics(response.data.topics))
      .catch((error) => console.error("Error fetching topics:", error));

    axios
      .get("http://127.0.0.1:5000/status")
      .then((response) => setStatuses(response.data.status))
      .catch((error) => console.error("Error fetching statuses:", error));

    axios
      .get("http://127.0.0.1:5000/terceros")
      .then((response) => setTerceros(response.data.terceros))
      .catch((error) => console.error("Error fetching terceros:", error));

    axios
      .get("http://127.0.0.1:5000/auth/users/names")
      .then((response) => setUsers(response.data.user_names))
      .catch((error) => console.error("Error fetching user names:", error));
  }, []);

  const handleSubmit = async () => {
    try {
      // Validar que se hayan seleccionado valores en los Autocompletes
      if (
        !selectedTopic ||
        !selectedStatus ||
        !selectedTercero ||
        !selectedUser
      ) {
        console.error("Por favor, selecciona valores en todos los campos.");
        return; // Detener la ejecución si faltan datos
      }

      // Enviar la solicitud POST con los datos completos
      const response = await axios.post(
        "http://127.0.0.1:5000/tickets/register",
        {
          fecha_creacion: new Date().toISOString(),
          tema: selectedTopic.name,
          estado: selectedStatus.name,
          tercero_nombre: selectedTercero.name,
          especialista_nombre: selectedUser.name,
          descripcion_caso: descripcionValue,
          solucion_caso: solucionValue,
        }
      );
      console.log("Ticket creado:", response.data);
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
            <div className="flex flex-col space-y-4 w-2/6">
              <div>
                <div className="max-w-xs mb-4">
                  <Autocomplete
                    defaultItems={topics}
                    label="Tema"
                    placeholder="Seleccionar"
                    onChange={(value) => setSelectedTopic(value)}
                  >
                    {(topic) => (
                      <AutocompleteItem className="text-black" key={topic.id}>
                        {topic.name}
                      </AutocompleteItem>
                    )}
                  </Autocomplete>
                </div>

                <div className="max-w-xs mb-4">
                  <Autocomplete
                    defaultItems={statuses}
                    label="Estado del ticket"
                    placeholder="Selecciona un estado del ticket"
                    onChange={(value) => setSelectedStatus(value)}
                  >
                    {(status) => (
                      <AutocompleteItem className="text-black" key={status.id}>
                        {status.name}
                      </AutocompleteItem>
                    )}
                  </Autocomplete>
                </div>

                <div className="max-w-xs mb-4">
                  <Autocomplete
                    defaultItems={terceros}
                    label="Seleccionar Tercero"
                    placeholder="Seleccionar"
                    onChange={(value) => setSelectedTercero(value)}
                  >
                    {(tercero) => (
                      <AutocompleteItem className="text-black" key={tercero.id}>
                        {tercero.name}
                      </AutocompleteItem>
                    )}
                  </Autocomplete>
                </div>

                <div className="max-w-xs">
                  <Autocomplete
                    defaultItems={users}
                    label="Especialista"
                    placeholder="Selecciona un Especialista"
                    onChange={(value) => setSelectedUser(value)}
                  >
                    {(user) => (
                      <AutocompleteItem className="text-black" key={user.id}>
                        {user.name}
                      </AutocompleteItem>
                    )}
                  </Autocomplete>
                </div>
              </div>
              <Button
                className="w-4/6 bg-[#4a53a0]"
                color="primary"
                onClick={handleSubmit}
              >
                Crear Ticket
              </Button>
            </div>
            <div className="w-4/6">
              <p className="text-[#4a53a0] font-bold text-xl">
                Descripcion del caso:
              </p>
              <textarea
                className="w-full h-[150px] p-2 border border-gray-300 rounded text-black"
                value={descripcionValue}
                onChange={(e) => setDescripcionValue(e.target.value)}
                placeholder="Descripcion del caso"
              />
              <p className="text-[#4a53a0] font-bold text-xl">
                Solucion al caso:
              </p>
              <textarea
                className="w-full h-[150px] p-2 border border-gray-300 rounded text-black"
                value={solucionValue}
                onChange={(e) => setSolucionValue(e.target.value)}
                placeholder="Solucion al caso"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
