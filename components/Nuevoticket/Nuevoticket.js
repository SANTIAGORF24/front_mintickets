import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@nextui-org/react";
import Autocomplete from "./Autocomplete";
import emailjs from "emailjs-com"; // Importa EmailJS

export function Nuevoticket() {
  const [descripcionValue, setDescripcionValue] = useState("");
  const [solucionValue, setSolucionValue] = useState("");
  const [topics, setTopics] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [terceros, setTerceros] = useState([]);
  const [users, setUsers] = useState([]);
  const [ticketCreated, setTicketCreated] = useState(false);

  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedTercero, setSelectedTercero] = useState(null);
  const [selectedTerceroEmail, setSelectedTerceroEmail] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserEmail, setSelectedUserEmail] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const topicsResponse = await axios.get("http://127.0.0.1:5000/topics");
        setTopics(topicsResponse.data.topics);

        const statusesResponse = await axios.get(
          "http://127.0.0.1:5000/status"
        );
        // Filtrar las opciones de estado para excluir "Solucionado"
        const filteredStatuses = statusesResponse.data.status.filter(
          (status) => status.name !== "Solucionado"
        );
        setStatuses(filteredStatuses);

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

  const sendEmail = (
    toEmail,
    ccEmail,
    toName,
    message,
    terceroNombre,
    tema
  ) => {
    const templateParams = {
      to_name: toName,
      to_email: toEmail,
      cc_email: ccEmail,
      message: message,
      tercero_nombre: terceroNombre,
      tema: tema,
    };

    emailjs
      .send(
        "mintickets",
        "template_8ift73p",
        templateParams,
        "v8J_dI_u1ZC3-Gp8l"
      )
      .then(
        (response) => {
          console.log("SUCCESS!", response.status, response.text);
        },
        (error) => {
          console.log("FAILED...", error);
        }
      );
  };

  const handleSubmit = async () => {
    try {
      if (
        !selectedTopic ||
        !selectedStatus ||
        !selectedTercero ||
        !selectedUser
      ) {
        console.error("Por favor, selecciona valores en todos los campos.");
        return;
      }

      const ticketData = {
        fecha_creacion: new Date().toISOString(),
        tema: selectedTopic.name,
        estado: selectedStatus.name,
        tercero_nombre: selectedTercero.name,
        especialista_nombre: selectedUser.name,
        descripcion_caso: descripcionValue,
        solucion_caso: solucionValue,
      };

      const response = await axios.post(
        "http://127.0.0.1:5000/tickets/register",
        ticketData
      );
      console.log("Ticket creado:", response.data);
      setTicketCreated(true);

      // Enviar correo electrónico
      sendEmail(
        selectedUserEmail,
        selectedTerceroEmail,
        selectedUser.name,
        descripcionValue,
        selectedTercero.name,
        selectedTopic.name
      );

      setTimeout(() => {
        window.location.reload();
      }, 2000);
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
                onSelect={(value) => {
                  setSelectedTercero(value);
                  setSelectedTerceroEmail(value.email);
                }}
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
              />
              {selectedUserEmail && (
                <h3 className="text-[#4a53a0] text-lg mt-2">
                  Correo: {selectedUserEmail}
                </h3>
              )}
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
                disabled
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
