import React, { useState, useEffect } from "react";
import axios from "axios";
import { User, Lock, Check, AlertTriangle, X } from "lucide-react";

const ResetPasswordForm = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [nuevaContrasena, setNuevaContrasena] = useState("");
  const [confirmacionContrasena, setConfirmacionContrasena] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [mostrarListaUsuarios, setMostrarListaUsuarios] = useState(false);

  // Cargar usuarios desde el backend
  useEffect(() => {
    const cargarUsuarios = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/tercerosda");
        setUsuarios(response.data);
      } catch (error) {
        console.error("Error cargando usuarios:", error);
        setError("No se pudieron cargar los usuarios");
      }
    };

    cargarUsuarios();
  }, []);

  // Filtrar usuarios por nombre o nombre de usuario
  const usuariosFiltrados = usuarios.filter(
    (usuario) =>
      usuario.fullName.toLowerCase().includes(busqueda.toLowerCase()) ||
      usuario.username.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Manejar selección de usuario
  const handleSeleccionUsuario = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setBusqueda(usuario.fullName);
    setMostrarListaUsuarios(false);
    setError("");
    setSuccess("");
  };

  // Manejar cambios en la búsqueda
  const handleCambioBusqueda = (e) => {
    const valorBusqueda = e.target.value;
    setBusqueda(valorBusqueda);
    setMostrarListaUsuarios(valorBusqueda.length > 0);
    setUsuarioSeleccionado(null);
  };

  // Limpiar selección de usuario
  const limpiarSeleccion = () => {
    setUsuarioSeleccionado(null);
    setBusqueda("");
    setMostrarListaUsuarios(false);
    setError("");
    setSuccess("");
  };

  // Validar y restablecer contraseña
  const handleRestablecerContrasena = async () => {
    // Validaciones
    if (!usuarioSeleccionado) {
      setError("Debe seleccionar un usuario");
      return;
    }

    if (nuevaContrasena !== confirmacionContrasena) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (nuevaContrasena.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/tercerosda/reset-password",
        {
          username: usuarioSeleccionado.username,
          new_password: nuevaContrasena,
        }
      );

      setSuccess(
        `Contraseña restablecida exitosamente para ${usuarioSeleccionado.fullName}`
      );
      setNuevaContrasena("");
      setConfirmacionContrasena("");
      limpiarSeleccion();
    } catch (error) {
      console.error("Error restableciendo contraseña:", error);
      setError(
        error.response?.data?.error || "Error al restablecer la contraseña"
      );
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md text-black">
      <h2 className="text-2xl font-bold text-blue-800 mb-6">
        Restablecer Contraseña
      </h2>

      {/* Búsqueda de usuario */}
      <div className="relative mb-4">
        <label className="block text-gray-700 font-semibold mb-2">
          Buscar Usuario
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={busqueda}
            onChange={handleCambioBusqueda}
            onFocus={() => setMostrarListaUsuarios(busqueda.length > 0)}
            placeholder="Nombre o nombre de usuario"
            className="w-full pl-10 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {busqueda && (
            <button
              onClick={limpiarSeleccion}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Lista de usuarios filtrados */}
        {mostrarListaUsuarios && usuariosFiltrados.length > 0 && (
          <ul className="absolute z-10 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
            {usuariosFiltrados.map((usuario) => (
              <li
                key={usuario.username}
                onClick={() => handleSeleccionUsuario(usuario)}
                className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
              >
                {usuario.fullName} ({usuario.username})
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Detalles del Usuario */}
      {usuarioSeleccionado && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg mb-4 relative">
          <button
            onClick={limpiarSeleccion}
            className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
          >
            <X size={20} />
          </button>
          <h3 className="text-lg font-bold text-blue-800 mb-3">
            Detalles del Usuario
          </h3>
          <div className="space-y-2">
            <div className="flex items-center">
              <User className="mr-3 text-green-600" />
              <span className="text-gray-700">
                {usuarioSeleccionado.fullName}
              </span>
            </div>
            <div className="flex items-center">
              <Lock className="mr-3 text-blue-600" />
              <span className="text-gray-700">
                {usuarioSeleccionado.username}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Formulario de Contraseña */}
      {usuarioSeleccionado && (
        <div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Nueva Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="password"
                value={nuevaContrasena}
                onChange={(e) => setNuevaContrasena(e.target.value)}
                placeholder="Ingrese nueva contraseña"
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Confirmar Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="password"
                value={confirmacionContrasena}
                onChange={(e) => setConfirmacionContrasena(e.target.value)}
                placeholder="Confirme la nueva contraseña"
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Mensajes de Error y Éxito */}
          {error && (
            <div className="mb-4 text-red-600 bg-red-50 p-3 rounded-md flex items-center">
              <AlertTriangle className="mr-2 text-red-600" />
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 text-green-700 bg-green-50 p-3 rounded-md flex items-center">
              <Check className="mr-2 text-green-600" />
              {success}
            </div>
          )}

          {/* Botón de Restablecer */}
          <button
            onClick={handleRestablecerContrasena}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300 flex items-center justify-center"
          >
            Restablecer Contraseña
          </button>
        </div>
      )}
    </div>
  );
};

export default ResetPasswordForm;
