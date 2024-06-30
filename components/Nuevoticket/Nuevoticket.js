import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, CircularProgress } from "@nextui-org/react";
import Autocomplete from "./Autocomplete";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function Nuevoticket() {
  const [descripcionValue, setDescripcionValue] = useState("");
  const [solucionValue, setSolucionValue] = useState("");
  const [topics, setTopics] = useState([]);
  const [terceros, setTerceros] = useState([]);
  const [users, setUsers] = useState([]);

  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState({
    id: 1,
    name: "Creado",
  });
  const [selectedTercero, setSelectedTercero] = useState(null);
  const [selectedTerceroEmail, setSelectedTerceroEmail] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserEmail, setSelectedUserEmail] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const topicsResponse = await axios.get("http://127.0.0.1:5000/topics");
        setTopics(topicsResponse.data.topics);

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
        toast.error("Error al cargar los datos. Por favor, recarga la página.");
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async () => {
    try {
      if (!selectedTopic || !selectedTercero || !selectedUser) {
        toast.error("Por favor, selecciona valores en todos los campos.");
        return;
      }

      setIsLoading(true);

      const ticketData = {
        fecha_creacion: new Date().toISOString(),
        tema: selectedTopic.name,
        estado: selectedStatus.name,
        tercero_nombre: selectedTercero.name,
        tercero_email: selectedTerceroEmail,
        especialista_nombre: selectedUser.name,
        especialista_email: selectedUserEmail,
        descripcion_caso: descripcionValue,
        solucion_caso: solucionValue,
      };

      console.log("Enviando datos del ticket:", ticketData);

      const response = await axios.post(
        "http://127.0.0.1:5000/tickets/register",
        ticketData
      );
      console.log(response.data);

      if (response.status === 201) {
        toast.success("Ticket creado exitosamente");
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      }
    } catch (error) {
      console.error("Error al crear el ticket:", error);
      toast.error("Error al crear el ticket. Por favor, intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex items-center justify-center w-full py-10">
        <div className="w-4/6">
          <div className="w-full flex items-center justify-center">
            <h2 className="text-[#4a53a0] text-3xl font-bold text-center mb-4">
              Nuevo ticket
            </h2>
          </div>
          <div className="flex space-x-10 items-center justify-center h-full py-10">
            <div className="flex flex-col space-y-7 w-2/6">
              <div>
                <label className="block text-[#4a53a0] font-semibold mb-2">
                  Tema del ticket
                </label>
                <Autocomplete
                  items={topics}
                  placeholder="Seleccionar tema"
                  onSelect={(value) => setSelectedTopic(value)}
                />
              </div>
              <div className="flex flex-col w-4/5">
                <label className="mb-2 text-[#4a53a0] font-semibold">
                  Estado del ticket
                </label>
                <input
                  type="text"
                  value="Creado"
                  readOnly
                  className="p-2 border border-gray-300 rounded text-black bg-slate-100"
                />
              </div>
              <div>
                <label className="block text-[#4a53a0] font-semibold mb-2">
                  Tercero
                </label>
                <Autocomplete
                  items={terceros}
                  placeholder="Seleccionar tercero"
                  onSelect={(value) => {
                    setSelectedTercero(value);
                    setSelectedTerceroEmail(value.email);
                  }}
                />
              </div>
              {selectedTerceroEmail && (
                <h3 className="text-[#4a53a0] text-lg mt-2">
                  Correo: {selectedTerceroEmail}
                </h3>
              )}
              <div>
                <label className="block text-[#4a53a0] font-semibold mb-2">
                  Especialista
                </label>
                <Autocomplete
                  items={users}
                  placeholder="Selecciona un Especialista"
                  onSelect={(value) => {
                    setSelectedUser(value);
                    setSelectedUserEmail(value.email);
                  }}
                />
              </div>
              {selectedUserEmail && (
                <h3 className="text-[#4a53a0] text-lg mt-2">
                  Correo: {selectedUserEmail}
                </h3>
              )}
            </div>
            <div className="w-4/6">
              <p className="text-[#4a53a0] font-bold text-xl mb-2">
                Descripción del caso:
              </p>
              <textarea
                className="w-full h-[150px] p-2 border border-gray-300 rounded text-black bg-slate-100"
                value={descripcionValue}
                onChange={(e) => setDescripcionValue(e.target.value)}
                placeholder="Descripción del caso"
              />
              <p className="text-[#4a53a0] font-bold text-xl mt-4 mb-2">
                Solución al caso:
              </p>
              <textarea
                className="w-full h-[150px] p-2 border border-gray-300 rounded text-black bg-slate-100"
                value={solucionValue}
                onChange={(e) => setSolucionValue(e.target.value)}
                placeholder="Solución al caso"
              />
            </div>
          </div>
          <div className="flex items-center justify-center">
            <Button
              onClick={handleSubmit}
              className="self-center bg-[#4a53a0] text-white w-full h-12 text-xl rounded-2xl hover:shadow-lg hover:bg-[#666eb5]"
              disabled={isLoading}
            >
              {isLoading ? (
                <CircularProgress
                  size="sm"
                  color="current"
                  aria-label="Loading..."
                />
              ) : (
                "Crear Ticket"
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
