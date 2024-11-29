import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, CircularProgress } from "@nextui-org/react";
import { User, Mail, Search } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Custom Autocomplete Component for Terceros
const TerceroAutocomplete = ({ usuarios, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (searchTerm) {
      const filtered = usuarios
        .filter(
          (usuario) =>
            usuario.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            usuario.username.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .slice(0, 5);
      setFilteredUsers(filtered);
      setIsOpen(filtered.length > 0);
    } else {
      setFilteredUsers([]);
      setIsOpen(false);
    }
  }, [searchTerm, usuarios]);

  const handleSelect = (usuario) => {
    onSelect(usuario);
    setSearchTerm(usuario.fullName);

    // Use setTimeout to ensure the dropdown closes immediately
    setTimeout(() => {
      setIsOpen(false);
    }, 0);
  };

  return (
    <div className="relative w-full" onClick={(e) => e.stopPropagation()}>
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={20}
        />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar tercero"
          className="w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          onFocus={() => setIsOpen(filteredUsers.length > 0)}
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(filteredUsers.length > 0);
          }}
        />
      </div>
      {isOpen && (
        <ul
          className="absolute z-10 w-full bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {filteredUsers.map((usuario) => (
            <li
              key={usuario.username}
              onClick={(e) => {
                e.stopPropagation(); // Prevent event bubbling
                handleSelect(usuario);
              }}
              className="p-3 hover:bg-gray-100 cursor-pointer flex items-center"
            >
              <div>
                <p className="font-semibold">{usuario.fullName}</p>
                <p className="text-sm text-gray-500">{usuario.username}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// Custom Autocomplete Component for Specialists
const SpecialistAutocomplete = ({ onSelect }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [specialists, setSpecialists] = useState([]);
  const [filteredSpecialists, setFilteredSpecialists] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchSpecialists = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:5000/tercerosda/especialistas"
        );
        setSpecialists(response.data);
      } catch (error) {
        console.error("Error fetching specialists:", error);
        toast.error("Error al cargar especialistas");
      }
    };

    fetchSpecialists();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = specialists
        .filter(
          (specialist) =>
            specialist.fullName
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            specialist.username.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .slice(0, 5);
      setFilteredSpecialists(filtered);
      setIsOpen(filtered.length > 0);
    } else {
      setFilteredSpecialists([]);
      setIsOpen(false);
    }
  }, [searchTerm, specialists]);

  const handleSelect = (specialist) => {
    onSelect(specialist);
    setSearchTerm(specialist.fullName);

    // Use setTimeout to ensure the dropdown closes immediately
    setTimeout(() => {
      setIsOpen(false);
    }, 0);
  };

  return (
    <div className="relative w-full" onClick={(e) => e.stopPropagation()}>
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={20}
        />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar especialista"
          className="w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          onFocus={() => setIsOpen(filteredSpecialists.length > 0)}
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(filteredSpecialists.length > 0);
          }}
        />
      </div>
      {isOpen && (
        <ul
          className="absolute z-10 w-full bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {filteredSpecialists.map((specialist) => (
            <li
              key={specialist.username}
              onClick={(e) => {
                e.stopPropagation(); // Prevent event bubbling
                handleSelect(specialist);
              }}
              className="p-3 hover:bg-gray-100 cursor-pointer flex items-center"
            >
              <div>
                <p className="font-semibold">{specialist.fullName}</p>
                <p className="text-sm text-gray-500">
                  {specialist.username} - {specialist.department}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

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

  const handleSeleccionTercero = (usuario) => {
    setUsuarioSeleccionado(usuario);
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
        especialista_nombre: selectedUser.fullName,
        especialista_email: selectedUser.email,
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
    <div className="bg-gray-50  flex items-center justify-center p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="bg-white shadow-2xl rounded-2xl w-5/6 p-8 ">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-extrabold text-[#4a53a0]">
            Crear Nuevo Ticket
          </h2>
          <p className="text-gray-500 mt-2">
            Complete todos los campos para registrar su ticket
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Columna Izquierda: Información Principal */}
          <div className="space-y-6">
            {/* Tema del Ticket */}
            <div>
              <label className="block text-[#4a53a0] font-semibold mb-2">
                Tema del Ticket
              </label>
              <select
                value={selectedTopic?.name || ""}
                onChange={(e) => {
                  const selected = topics.find(
                    (t) => t.name === e.target.value
                  );
                  setSelectedTopic(selected);
                }}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              >
                <option value="">Seleccionar Tema</option>
                {topics.map((topic) => (
                  <option key={topic.name} value={topic.name}>
                    {topic.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Estado del Ticket */}
            <div>
              <label className="block text-[#4a53a0] font-semibold mb-2">
                Estado del Ticket
              </label>
              <input
                type="text"
                value="Creado"
                readOnly
                className="w-full p-3 border rounded-lg bg-gray-100 text-gray-700"
              />
            </div>

            {/* Tercero */}
            <div className="text-black">
              <label className="block text-[#4a53a0] font-semibold mb-2">
                Tercero
              </label>
              <TerceroAutocomplete
                usuarios={usuarios}
                onSelect={handleSeleccionTercero}
              />
            </div>

            {/* Detalles del Tercero */}
            {usuarioSeleccionado && (
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg text-black">
                <h3 className="text-lg font-bold text-blue-800 mb-3">
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

            {/* Especialista */}
            <div className="text-black">
              <label className="block text-[#4a53a0] font-semibold mb-2">
                Especialista
              </label>
              <SpecialistAutocomplete
                onSelect={(specialist) => {
                  setSelectedUser(specialist);
                  setSelectedUserEmail(specialist.email);
                }}
              />
              {selectedUserEmail && (
                <p className="text-sm text-gray-500 mt-2">
                  Correo: {selectedUserEmail}
                </p>
              )}
            </div>
          </div>

          {/* Columna Derecha: Descripción y Solución */}
          <div className="md:col-span-2 space-y-6 text-black">
            {/* Descripción del Caso */}
            <div>
              <label className="block text-[#4a53a0] font-semibold mb-2">
                Descripción del Caso
              </label>
              <div
                onDrop={(e) => handleDrop(e, setDescripcionImages)}
                onDragOver={handleDragOver}
                className="border-2 border-dashed border-gray-300 rounded-lg p-4"
              >
                <textarea
                  className="w-full h-48 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  value={descripcionValue}
                  onChange={(e) => setDescripcionValue(e.target.value)}
                  placeholder="Describe el caso detalladamente..."
                />

                {/* Image Upload Section */}
                <div className="mt-4">
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
                    className="block text-center p-3 bg-blue-50 border border-blue-200 rounded-lg cursor-pointer hover:bg-blue-100 transition"
                  >
                    + Añadir imágenes
                  </label>

                  {/* Uploaded Images Preview */}
                  {descripcionImages.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {descripcionImages.map((img, index) => (
                        <img
                          key={index}
                          src={img}
                          alt={`Uploaded ${index}`}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Botón de Crear Ticket */}
            <div className="mt-6">
              <Button
                onClick={handleSubmit}
                className="w-full bg-[#4a53a0] text-white py-4 text-lg rounded-xl hover:bg-[#666eb5] transition duration-300 ease-in-out"
                disabled={isLoading}
              >
                {isLoading ? (
                  <CircularProgress
                    size="sm"
                    color="current"
                    aria-label="Creando ticket..."
                  />
                ) : (
                  "Crear Ticket"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Nuevoticket;
