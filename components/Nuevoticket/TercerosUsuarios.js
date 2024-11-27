import React, { useState, useEffect } from "react";
import { User, Mail, Building2, Search } from "lucide-react";

const TercerosUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);

  // Debounce para evitar múltiples llamadas al servidor
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (busqueda) {
        buscarUsuarios(busqueda);
      } else {
        setUsuarios([]);
      }
    }, 500); // Espera 500ms después de que el usuario deja de escribir

    return () => clearTimeout(delayDebounceFn);
  }, [busqueda]);

  const buscarUsuarios = async (termino) => {
    setCargando(true);
    try {
      const respuesta = await fetch(
        `http://127.0.0.1:5000/tercerosda?search=${termino}`
      );

      if (!respuesta.ok) {
        throw new Error("Error al buscar usuarios");
      }

      const data = await respuesta.json();
      setUsuarios(data);
    } catch (error) {
      console.error("Error:", error);
      setError("No se pudieron cargar los usuarios");
    } finally {
      setCargando(false);
    }
  };

  const handleSeleccionUsuario = async (username) => {
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

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-800 rounded-lg">{error}</div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl text-black">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-4 bg-gray-50 border-b flex items-center">
          <User className="mr-2 text-gray-600" />
          <h2 className="text-xl font-semibold text-gray-800">
            Usuarios del Directorio Activo
          </h2>
        </div>

        <div className="p-4">
          {/* Campo de búsqueda */}
          <div className="mb-4 relative">
            <input
              type="text"
              className="w-full p-3 pl-10 pr-6 border rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Buscar usuario por nombre"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Lista de usuarios */}
          {cargando ? (
            <div className="text-center text-gray-600">
              Cargando usuarios...
            </div>
          ) : (
            <select
              className="w-full p-3 pl-10 pr-6 border rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => handleSeleccionUsuario(e.target.value)}
            >
              <option value="">Selecciona un usuario</option>
              {usuarios.map((usuario) => (
                <option key={usuario.username} value={usuario.username}>
                  {usuario.fullName}
                </option>
              ))}
            </select>
          )}

          {/* Detalles del usuario seleccionado */}
          {usuarioSeleccionado && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {usuarioSeleccionado.fullName}
              </h3>

              <div className="space-y-3">
                <div className="flex items-center">
                  <Mail className="mr-3 text-blue-600" />
                  <span className="text-gray-700">
                    {usuarioSeleccionado.email || "Correo no disponible"}
                  </span>
                </div>

                <div className="flex items-center">
                  <User className="mr-3 text-green-600" />
                  <span className="text-gray-700">
                    Usuario: {usuarioSeleccionado.username}
                  </span>
                </div>

                <div className="flex items-center">
                  <Building2 className="mr-3 text-purple-600" />
                  <span className="text-gray-700">
                    Departamento: {usuarioSeleccionado.department}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TercerosUsuarios;
