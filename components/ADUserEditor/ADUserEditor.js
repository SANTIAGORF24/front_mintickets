import React, { useState, useEffect } from "react";
import { User, Mail, Search, Edit3, Save, Eye, EyeOff } from "lucide-react";
import { Card, CardBody, CardHeader, Button, Input } from "@nextui-org/react";
import axios from "axios";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { parseISO } from "date-fns"; // Añadimos parseISO para manejar fechas ISO
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Keeping the original TerceroAutocomplete component
const TerceroAutocomplete = ({ onSelect }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/ad/`
        );
        setUsuarios(response.data);
      } catch (error) {
        console.error("Error fetching usuarios:", error);
      }
    };

    fetchUsuarios();
  }, []);

  useEffect(() => {
    if (searchTerm && usuarios) {
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
                e.stopPropagation();
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

const descriptionOptions = [
  "Contratista",
  "Profesional Especializado",
  "Coordinador Profesional Especializado",
];

const officeOptions = {
  100: "DESPACHO DEL MINISTRO",
  101: "G.I.T. Comunicaciones",
  102: "G.I.T. Organización Nacional Antidopaje",
  110: "OFICINA DE CONTROL INTERNO",
  120: "Oficina Juridica",
  130: "OFICINA ASESORA DE PLANEACION",
  131: "G.I.T. Planeación y Gestión",
  132: "G.I.T. De Seguimiento",
  133: "G.I.T. De Gestión del Conocimiento e Innovación",
  140: "OFICINA DE CONTROL INTERNO DISCIPLINARIO",
  200: "SECRETARIA GENERAL",
  210: "G.I.T. Gestión Financiera y Presupuestal",
  303: "G.I.T. Gestión Presupuestal",
  308: "G.I.T. Gestión Contable",
  220: "G.I.T. Gestión Administrativa",
  230: "G.I.T. Talento Humano",
  240: "G.I.T. Tesoreria",
  250: "G.I.T. Servicio Integral al Ciudadano",
  260: "G.I.T. Tecnología de la Información y las Comunicaciones - TICS",
  270: "G.I.T. Contratación",
  300: "DESPACHO DEL VICEMINISTERIO DEL DEPORTE",
  310: "DIRECCION DE POSICIONAMIENTO Y LIDERAZGO DEPORTIVO",
  311: "G.I.T. Deporte de Rendimiento Convencional",
  312: "G.I.T. Deporte de Rendimiento Paralimpico",
  313: "G.I.T. Centro de Ciencias del Deporte (CCD)",
  315: "G.I.T. Talento y Reserva Deportiva",
  316: "G.I.T. Juegos y Eventos Deportivos",
  317: "G.I.T. Desarrollo Psicosocial",
  343: "G.I.T. Centro de Alto Rendimiento - CAR",
  320: "DIRECCION DE FOMENTO Y DESARROLLO",
  321: "G.I.T. Recreación",
  322: "G.I.T. Deporte Escolar",
  323: "G.I.T. Actividad Física",
  324: "G.I.T. Deporte Social Comunitario",
  330: "DIRECCION DE INSPECCION, VIGILANCIA Y CONTROL",
  331: "G.I.T. Deporte Profesional",
  332: "G.I.T. Deporte Aficionado",
  333: "G.I.T. Actuaciones Administrativas",
  340: "DIRECCIÓN DE RECURSOS Y HERRAMIENTAS DEL SISTEMA NACIONAL DEL DEPORTE - SND",
  342: "G.I.T. Laboratorio Control al Dopaje",
  344: "G.I.T Infraestructura",
};

const generatePassword = () => {
  const lowerChars = "abcdefghijklmnopqrstuvwxyz";
  const upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const symbols = "$%.*";
  const allChars = lowerChars + upperChars + numbers + symbols;

  let password = "";
  password += lowerChars.charAt(Math.floor(Math.random() * lowerChars.length));
  password += upperChars.charAt(Math.floor(Math.random() * upperChars.length));
  password += numbers.charAt(Math.floor(Math.random() * numbers.length));
  password += symbols.charAt(Math.floor(Math.random() * symbols.length));

  for (let i = 4; i < 12; i++) {
    password += allChars.charAt(Math.floor(Math.random() * allChars.length));
  }

  password = password
    .split("")
    .sort(() => 0.5 - Math.random())
    .join("");

  // Convertir la contraseña a UTF-16-LE
  const utf16lePassword = new TextEncoder("utf-16le").encode(password);
  return String.fromCharCode(...utf16lePassword);
};

const ADUserEditor = ({ onSelect, isDrawerOpen, setIsDrawerOpen }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [editableUser, setEditableUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [stateSearchTerm, setStateSearchTerm] = useState("");
  const [officeSearchTerm, setOfficeSearchTerm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  const handleSeleccionTercero = (usuario) => {
    if (typeof onSelect === "function") {
      onSelect(usuario);
    }
    setSelectedUser(usuario);
    setEditableUser({
      ...usuario,
      state: usuario.state || "",
      office: usuario.office || "",
    });
    setIsEditing(false);
    setIsDrawerOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableUser((prev) => ({ ...prev, [name]: value }));

    if (name === "state") {
      const office = officeOptions[value] || "";
      setEditableUser((prev) => ({
        ...prev,
        office,
      }));
      setStateSearchTerm(value); // Actualizar el término de búsqueda del estado
    } else if (name === "office") {
      const officeCode = Object.keys(officeOptions).find(
        (key) => officeOptions[key] === value
      );
      setEditableUser((prev) => ({
        ...prev,
        state: officeCode || "",
        department: value, // Actualizar también el campo "department" con el valor de "office"
      }));
      setOfficeSearchTerm(value); // Actualizar el término de búsqueda de la oficina
    } else if (name === "description") {
      setEditableUser((prev) => ({
        ...prev,
        description: value,
        title: value, // Actualizar también el campo "title" con el valor de "description"
      }));
    }
  };

  const handleDateChange = (date) => {
    if (date) {
      date.setDate(date.getDate()); // Ajustar la fecha sumando 3 días
    }
    setEditableUser((prev) => ({
      ...prev,
      accountExpires: date ? date.toISOString().split("T")[0] : "",
    }));
  };

  const formatAccountExpires = (date) => {
    if (!date || date === "0") {
      return "Nunca expira";
    }
    try {
      const dateObj = typeof date === "string" ? parseISO(date) : date;
      dateObj.setDate(dateObj.getDate()); // Ajustar la fecha restando 3 días
      return format(dateObj, "yyyy-MM-dd", { locale: es });
    } catch (e) {
      return date; // Si hay error en el parseo, retornamos la fecha original
    }
  };

  const handleUpdate = async () => {
    try {
      const updatedUser = { ...editableUser };

      // Manejo mejorado de la fecha
      if (updatedUser.accountExpires === "Nunca expira") {
        updatedUser.accountExpires = "";
      } else if (updatedUser.accountExpires) {
        const dateToFormat = new Date(updatedUser.accountExpires);
        if (!isNaN(dateToFormat.getTime())) {
          const year = dateToFormat.getFullYear();
          const month = String(dateToFormat.getMonth() + 1).padStart(2, "0");
          const day = String(dateToFormat.getDate()).padStart(2, "0");
          updatedUser.accountExpires = `${year}-${month}-${day}`;
        } else {
          updatedUser.accountExpires = "";
        }
      }

      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/ad/${editableUser.username}/`,
        updatedUser
      );
      setSelectedUser(editableUser);
      setIsEditing(false);
      toast.success("Datos actualizados correctamente");
    } catch (error) {
      console.error("Error actualizando datos:", error);
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(`Error actualizando datos: ${error.response.data.error}`);
      } else {
        toast.error("Error actualizando datos");
      }
    }
  };

  const handleUpdateStatus = async () => {
    try {
      const newStatus = !editableUser.isActive;
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/ad/${editableUser.username}/status`,
        { isActive: newStatus }
      );
      setEditableUser((prev) => ({ ...prev, isActive: newStatus }));
      toast.success(
        `Usuario ${newStatus ? "activado" : "desactivado"} correctamente`
      );
    } catch (error) {
      console.error("Error actualizando estado del usuario:", error);
      toast.error("Error actualizando estado del usuario");
    }
  };

  const handlePasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleGeneratePassword = () => {
    const password = generatePassword();
    setNewPassword(password);
  };

  const handleUpdatePassword = async () => {
    try {
      if (!newPassword) {
        alert("Por favor ingrese una contraseña");
        return;
      }

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/ad/${editableUser.username}/password`,
        { newPassword }, // Cambiar 'password' a 'newPassword'
        {
          timeout: 30000, // 30 segundos de timeout
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.message) {
        toast.success("Contraseña actualizada correctamente");
        setNewPassword("");
        setShowPassword(false);
      }
    } catch (error) {
      console.error("Error actualizando contraseña:", error);

      let errorMessage = "Error actualizando contraseña";

      if (error.code === "ECONNABORTED") {
        errorMessage =
          "La operación ha excedido el tiempo de espera. Por favor, inténtelo de nuevo.";
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }

      toast.error(errorMessage);
    }
  };

  const userFields = [
    { label: "Nombre Completo", name: "fullName" },
    { label: "Nombre de Usuario", name: "username" },
    { label: "Descripción", name: "description" },
    { label: "Oficina", name: "office" },
    { label: "Correo Electrónico", name: "email" },
    { label: "Apartado Postal", name: "postOfficeBox" },
    { label: "Estado o Provincia", name: "state" },
    { label: "Fecha de Expiración", name: "accountExpires", type: "text" },
  ];

  return (
    <Card className="w-full h-dvh">
      <CardHeader className="px-6 pt-6">
        <TerceroAutocomplete onSelect={handleSeleccionTercero} />
      </CardHeader>
      {selectedUser && (
        <CardBody className="px-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Detalles del Usuario</h2>
            <Button
              color={isEditing ? "success" : "primary"}
              variant="flat"
              onClick={() => {
                if (isEditing) {
                  handleUpdate();
                } else {
                  setIsEditing(true);
                }
              }}
              startContent={
                isEditing ? <Save size={20} /> : <Edit3 size={20} />
              }
              className="mt-4 md:mt-0"
            >
              {isEditing ? "Guardar" : "Editar"}
            </Button>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center mb-4">
            <span
              className={`text-lg font-semibold ${
                editableUser.isActive ? "text-green-500" : "text-red-500"
              }`}
            >
              {editableUser.isActive ? "Activo" : "Inactivo"}
            </span>
            <Button
              color={editableUser.isActive ? "error" : "success"}
              variant="flat"
              onClick={handleUpdateStatus}
              className={`mt-4 md:mt-0 ${
                editableUser.isActive ? "bg-red-500" : "bg-green-500"
              }`}
            >
              {editableUser.isActive ? "Desactivar" : "Activar"}
            </Button>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center mb-4">
            <Button
              color="primary"
              variant="flat"
              onClick={() => setShowPassword(!showPassword)}
              startContent={
                showPassword ? <EyeOff size={20} /> : <Eye size={20} />
              }
              className="mt-4 md:mt-0"
            >
              {showPassword ? "Ocultar Contraseña" : "Cambiar Contraseña"}
            </Button>
          </div>
          {showPassword && (
            <div className="flex flex-col md:flex-row items-center mb-4">
              <input
                type="text"
                value={newPassword}
                onChange={handlePasswordChange}
                placeholder="Nueva Contraseña"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button
                color="primary"
                variant="flat"
                onClick={handleGeneratePassword}
                className="mt-4 md:mt-0 md:ml-2"
              >
                Generar
              </Button>
              <Button
                color="success"
                variant="flat"
                onClick={handleUpdatePassword}
                className="mt-4 md:mt-0 md:ml-2"
              >
                Actualizar Contraseña
              </Button>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userFields.map(({ label, name, type = "text" }) => {
              if (name === "description") {
                return isEditing ? (
                  <select
                    key={name}
                    name={name}
                    value={editableUser[name]}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {descriptionOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <Input
                    key={name}
                    type={type}
                    label={label}
                    name={name}
                    value={editableUser[name]}
                    isReadOnly={!isEditing}
                    variant="bordered"
                    className="max-w-full"
                  />
                );
              } else if (name === "state") {
                return isEditing ? (
                  <div key={name} className="relative">
                    <input
                      type="text"
                      value={editableUser[name]}
                      onChange={(e) => {
                        setEditableUser((prev) => ({
                          ...prev,
                          [name]: e.target.value,
                          office: officeOptions[e.target.value] || prev.office,
                        }));
                        setStateSearchTerm(e.target.value);
                      }}
                      placeholder="Buscar estado o provincia"
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      list="stateOptions"
                    />
                    <datalist id="stateOptions">
                      {Object.keys(officeOptions)
                        .filter((key) =>
                          key
                            .toLowerCase()
                            .includes(stateSearchTerm.toLowerCase())
                        )
                        .map((key) => (
                          <option key={key} value={key}>
                            {key}
                          </option>
                        ))}
                    </datalist>
                  </div>
                ) : (
                  <Input
                    key={name}
                    type={type}
                    label={label}
                    name={name}
                    value={editableUser[name]}
                    isReadOnly={!isEditing}
                    variant="bordered"
                    className="max-w-full"
                  />
                );
              } else if (name === "office") {
                return isEditing ? (
                  <div key={name} className="relative">
                    <input
                      type="text"
                      value={editableUser[name]}
                      onChange={(e) => {
                        setEditableUser((prev) => ({
                          ...prev,
                          [name]: e.target.value,
                          state:
                            Object.keys(officeOptions).find(
                              (key) => officeOptions[key] === e.target.value
                            ) || prev.state,
                        }));
                        setOfficeSearchTerm(e.target.value);
                      }}
                      placeholder="Buscar oficina"
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      list="officeOptions"
                    />
                    <datalist id="officeOptions">
                      {Object.keys(officeOptions)
                        .filter((key) =>
                          officeOptions[key]
                            .toLowerCase()
                            .includes(officeSearchTerm.toLowerCase())
                        )
                        .map((key) => (
                          <option key={key} value={officeOptions[key]}>
                            {officeOptions[key]}
                          </option>
                        ))}
                    </datalist>
                  </div>
                ) : (
                  <Input
                    key={name}
                    type={type}
                    label={label}
                    name={name}
                    value={editableUser[name]}
                    isReadOnly={!isEditing}
                    variant="bordered"
                    className="max-w-full"
                  />
                );
              } else if (name === "accountExpires") {
                return isEditing ? (
                  <div key={name} className="relative">
                    <DatePicker
                      selected={
                        editableUser[name] &&
                        editableUser[name] !== "Nunca expira"
                          ? new Date(editableUser[name])
                          : null
                      }
                      onChange={handleDateChange}
                      dateFormat="yyyy-MM-dd"
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholderText="Seleccionar fecha de expiración"
                      isClearable
                    />
                  </div>
                ) : (
                  <Input
                    key={name}
                    type={type}
                    label={label}
                    name={name}
                    value={formatAccountExpires(editableUser[name])}
                    isReadOnly={!isEditing}
                    variant="bordered"
                    className="max-w-full"
                  />
                );
              } else {
                return (
                  <Input
                    key={name}
                    type={type}
                    label={label}
                    name={name}
                    value={
                      name === "accountExpires"
                        ? formatAccountExpires(editableUser[name])
                        : editableUser[name]
                    }
                    onChange={handleInputChange}
                    isReadOnly={!isEditing}
                    variant="bordered"
                    className="max-w-full"
                  />
                );
              }
            })}
          </div>
          <ToastContainer position="top-right" autoClose={3000} />
        </CardBody>
      )}
    </Card>
  );
};

export default ADUserEditor;
