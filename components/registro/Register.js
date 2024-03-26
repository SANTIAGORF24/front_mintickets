import React, { useState } from "react";
import axios from "axios";
import { Input } from "@nextui-org/react";
import { EyeFilledIcon } from "../login/EyeFilledIcon";
import { EyeSlashFilledIcon } from "../login/EyeSlashFilledIcon";

export function Register() {
  const [isVisible, setIsVisible] = React.useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación de campos obligatorios
    if (!username || !password || !email || !firstName || !lastName) {
      setError("Por favor, complete todos los campos.");
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:5000/register", {
        username,
        password,
        email,
        first_name: firstName,
        last_name: lastName,
      });

      setSuccessMessage("¡Usuario registrado con éxito!");
      setError("");

      console.log(response.data.message);
      // Aquí puedes realizar acciones adicionales después del registro exitoso
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setError("El usuario ya existe");
      } else {
        setError("Hubo un problema al procesar tu solicitud");
      }
      setSuccessMessage("");
    }
  };

  return (
    <div className="flex justify-center items-center text-black py-10">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Registro de Usuario</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        {successMessage && (
          <div className="text-green-500 mb-4">{successMessage}</div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block font-bold mb-2">
              Usuario:
            </label>
            <Input
              type="username"
              label="Usuario"
              variant="bordered"
              onChange={(e) => setUsername(e.target.value)}
              className="max-w-xs text-black"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block font-bold mb-2">
              Contraseña:
            </label>
            <Input
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
              type="email"
              label="Email"
              variant="bordered"
              defaultValue="@mindeporte.gov.co"
              className="max-w-xs text-black"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="firstName" className="block font-bold mb-2">
              Nombre:
            </label>
            <Input
              type="username"
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
              type="username"
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
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
}
