import React, { useState } from "react";
import axios from "axios";
import { Input } from "@nextui-org/react";
import { EyeFilledIcon } from "../login/EyeFilledIcon";
import { EyeSlashFilledIcon } from "../login/EyeSlashFilledIcon";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function Register() {
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [foundUser, setFoundUser] = useState(null);

  const buscarUsuario = async () => {
    try {
      let response;
      if (username) {
        response = await axios.get(
          `backend_mintickets.railway.internal/auth/users/username/${username}`
        );
      } else if (email) {
        response = await axios.get(
          `backend_mintickets.railway.internal/auth/users/email/${email}`
        );
      } else if (firstName) {
        response = await axios.get(
          `backend_mintickets.railway.internal/auth/users/firstName/${firstName}`
        );
      } else if (lastName) {
        response = await axios.get(
          `backend_mintickets.railway.internal/auth/users/lastName/${lastName}`
        );
      } else {
        toast.error("Por favor, ingrese al menos un criterio de búsqueda");
        return;
      }

      setFoundUser(response.data);
      setUsername(response.data.username);
      setEmail(response.data.email);
      setFirstName(response.data.first_name);
      setLastName(response.data.last_name);
      toast.success("Usuario encontrado");
    } catch (error) {
      toast.error("Usuario no encontrado");
      setFoundUser(null);
      setUsername("");
      setPassword("");
      setEmail("");
      setFirstName("");
      setLastName("");
    }
  };

  const eliminarUsuario = async () => {
    try {
      if (foundUser) {
        await axios.delete(
          `backend_mintickets.railway.internal/auth/users/${foundUser.username}`
        );
        toast.success("Usuario eliminado con éxito");
        setFoundUser(null);
        setUsername("");
        setPassword("");
        setEmail("");
        setFirstName("");
        setLastName("");
      } else {
        toast.error("No se ha encontrado ningún usuario");
      }
    } catch (error) {
      toast.error("Hubo un problema al eliminar el usuario");
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password || !email || !firstName || !lastName) {
      toast.error("Por favor, complete todos los campos obligatorios");
      return;
    }

    try {
      const userData = {
        username,
        password,
        email,
        first_name: firstName,
        last_name: lastName,
      };

      if (foundUser) {
        const response = await axios.put(
          `backend_mintickets.railway.internal/auth/users/username/${foundUser.username}`,
          userData
        );
        toast.success("¡Usuario actualizado con éxito!");
        console.log(response.data.message);
      } else {
        const response = await axios.post(
          "backend_mintickets.railway.internal/auth/register",
          userData
        );
        toast.success("¡Usuario registrado con éxito!");
        console.log(response.data.message);
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        toast.error("El usuario ya existe");
      } else {
        toast.error("Hubo un problema al procesar tu solicitud");
      }
    }
  };

  const limpiarCampos = () => {
    setUsername("");
    setPassword("");
    setEmail("");
    setFirstName("");
    setLastName("");
    setFoundUser(null);
    toast.info("Campos limpiados");
  };

  return (
    <div className="flex justify-center items-center text-black py-10">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Registro de Usuario</h2>
        <ToastContainer />
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block font-bold mb-2">
              Usuario:
            </label>
            <Input
              type="text"
              label="Usuario"
              variant="bordered"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="max-w-xs text-black"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block font-bold mb-2">
              Contraseña:
            </label>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              label="Contraseña"
              variant="bordered"
              placeholder="Ingresa la contraseña"
              endContent={
                <button
                  className="focus:outline-none"
                  type="button"
                  onClick={toggleVisibility}
                >
                  {isVisible ? (
                    <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                  ) : (
                    <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                  )}
                </button>
              }
              type={isVisible ? "text" : "password"}
              className="max-w-xs"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block font-bold mb-2">
              Correo Electrónico:
            </label>
            <Input
              value={email}
              type="email"
              label="Email"
              variant="bordered"
              className="max-w-xs text-black"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="firstName" className="block font-bold mb-2">
              Nombre:
            </label>
            <Input
              value={firstName}
              type="text"
              label="Nombres"
              variant="bordered"
              onChange={(e) => setFirstName(e.target.value)}
              className="max-w-xs text-black"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="lastName" className="block font-bold mb-2">
              Apellido:
            </label>
            <Input
              value={lastName}
              type="text"
              label="Apellidos"
              variant="bordered"
              onChange={(e) => setLastName(e.target.value)}
              className="max-w-xs text-black"
            />
          </div>
          <button
            type="submit"
            className="bg-[#4a53a0] text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
          >
            {foundUser ? "Actualizar" : "Registrarse"}
          </button>
          <button
            type="button"
            className="bg-[#4a53a0] text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors ml-2"
            onClick={buscarUsuario}
          >
            Buscar
          </button>
          <button
            type="button"
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors ml-2"
            onClick={eliminarUsuario}
            disabled={!foundUser}
          >
            Eliminar
          </button>
          <button
            type="button"
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors ml-2"
            onClick={limpiarCampos}
          >
            Limpiar
          </button>
        </form>
      </div>
    </div>
  );
}
