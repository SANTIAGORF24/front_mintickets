import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, CircularProgress } from "@nextui-org/react";
import Autocomplete from "./Autocomplete";
import { User, Mail, Building2, ArrowDown } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function Nuevoticket() {
  const [descripcionValue, setDescripcionValue] = useState("");
  const [solucionValue, setSolucionValue] = useState("");
  const [topics, setTopics] = useState([]);
  const [users, setUsers] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedStatus] = useState({
    id: 1,
    name: "Creado",
  });
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserEmail, setSelectedUserEmail] = useState(null);

  const [descripcionImages, setDescripcionImages] = useState([]);
  const [solucionImages, setSolucionImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const topicsResponse = await axios.get("http://127.0.0.1:5000/topics");
        setTopics(topicsResponse.data.topics);

        const usersResponse = await axios.get(
          "http://127.0.0.1:5000/auth/users/names"
        );
        setUsers(usersResponse.data.user_names);

        const usuariosResponse = await fetch(
          "http://127.0.0.1:5000/tercerosda"
        );

        if (!usuariosResponse.ok) {
          throw new Error("Error al obtener usuarios");
        }

        const data = await usuariosResponse.json();
        setUsuarios(data);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Error al cargar los datos. Por favor, recarga la página.");
      }
    };

    fetchData();
  }, []);

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

  const handleSeleccionTercero = async (username) => {
    try {
      const respuesta = await fetch(
        `http://127.0.0.1:5000/tercerosda/${username}`
      );

      if (!respuesta.ok) {
        throw new Error("Error al obtener detalles del usuario");
      }

      const data = await respuesta.json();
      setUsuarioSeleccionado(data);
    } catch (error) {
      console.error("Error:", error);
      setError("No se pudieron cargar los detalles del usuario");
    }
  };

  const handleSubmit = async () => {
    try {
      if (!selectedTopic || !usuarioSeleccionado || !selectedUser) {
        toast.error("Por favor, selecciona todos los campos necesarios.");
        return;
      }

      setIsLoading(true);

      const ticketData = {
        fecha_creacion: new Date().toISOString(),
        tema: selectedTopic.name,
        estado: selectedStatus.name,
        tercero_nombre: usuarioSeleccionado.fullName,
        tercero_email: usuarioSeleccionado.email,
        especialista_nombre: selectedUser.name,
        especialista_email: selectedUserEmail,
        descripcion_caso: descripcionValue,
        solucion_caso: solucionValue,
        descripcion_images: descripcionImages,
        solucion_images: solucionImages,
      };

      const response = await axios.post(
        "http://127.0.0.1:5000/tickets/register",
        ticketData
      );

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

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-800 rounded-lg">{error}</div>
    );
  }

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
                <select
                  className="text-black w-full p-3 pl-10 pr-6 border rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => handleSeleccionTercero(e.target.value)}
                >
                  <option value="">Selecciona un usuario</option>
                  {usuarios.map((usuario) => (
                    <option key={usuario.username} value={usuario.username}>
                      {usuario.fullName}
                    </option>
                  ))}
                </select>
              </div>

              {usuarioSeleccionado && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Detalles del Tercero
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Mail className="mr-3 text-blue-600" />
                      <span className="text-gray-700">
                        {usuarioSeleccionado.email}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <User className="mr-3 text-green-600" />
                      <span className="text-gray-700">
                        {usuarioSeleccionado.fullName}
                      </span>
                    </div>
                  </div>
                </div>
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
              <div>
                <p className="text-[#4a53a0] font-bold text-xl mb-2">
                  Descripción del caso:
                </p>
                <div
                  onDrop={(e) => handleDrop(e, setDescripcionImages)}
                  onDragOver={handleDragOver}
                  className="border border-gray-300 rounded p-2"
                >
                  <textarea
                    className="w-full h-[150px] p-2 text-black bg-slate-100 border-none outline-none"
                    value={descripcionValue}
                    onChange={(e) => setDescripcionValue(e.target.value)}
                    placeholder="Descripción del caso"
                  />
                  <div className="mt-2 flex flex-wrap gap-2 ">
                    {descripcionImages.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={`Uploaded ${index}`}
                        className="w-20 h-20 object-cover"
                      />
                    ))}
                  </div>
                </div>
                <div
                  onDrop={(e) => handleDrop(e, setDescripcionImages)}
                  onDragOver={handleDragOver}
                  className="border border-dashed border-gray-300 rounded p-4 mt-2 text-center text-gray-500"
                >
                  <p>
                    Arrastra y suelta las imágenes aquí o selecciona las
                    imágenes
                  </p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) =>
                      handleImageUpload(e.target.files, setDescripcionImages)
                    }
                    className="hidden"
                    id="descripcionImageInput"
                  />
                  <label
                    htmlFor="descripcionImageInput"
                    className="cursor-pointer text-blue-500 underline"
                  >
                    Seleccionar imágenes
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center mt-4">
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

export default Nuevoticket;
