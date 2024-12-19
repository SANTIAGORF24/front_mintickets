import React, { useState } from "react";
import Image from "next/image";
import { Input, Button, CircularProgress } from "@nextui-org/react";
import { EyeFilledIcon } from "./EyeFilledIcon";
import { EyeSlashFilledIcon } from "./EyeSlashFilledIcon";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function Loginpys() {
  const [isVisible, setIsVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleLogin = async () => {
    if (!username || !password) {
      toast.error("Por favor ingrese usuario y contraseña");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/authpazysalvo/login/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("user", JSON.stringify(data.user));
        console.log("Inicio de sesión exitoso");
        router.push("/certificados");
      } else {
        if (response.status === 401) {
          toast.error("Usuario no autorizado o credenciales inválidas");
        } else {
          toast.error(data.message || "Error al iniciar sesión");
        }
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      toast.error("Error de conexión. Intente nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <>
      <div className="w-full h-svh flex items-center justify-center">
        <div className="w-5/6 h-[80%] sm:h-[90%] rounded-lg border-2">
          <div className="flex items-center justify-center h-[90%]">
            <div className="w-5/6 h-full flex items-center justify-center">
              <div className="flex flex-col justify-between h-[50%] w-full">
                <div>
                  <h1 className="text-[#4a53a0] text-3xl font-bold">
                    PAZ Y SALVO MINDEPORTE TICS
                  </h1>
                </div>
                <div>
                  <h1 className="text-black text-xl font-extrabold w-5/6">
                    🎉 Bienvenidos a generar su certificado de paz y salvo para
                    tics
                  </h1>
                  <p className="text-black text-lg w-5/6">
                    Por favor ingrese con su:
                  </p>
                  <ul className="text-black text-lg w-5/6 list-disc list-inside">
                    <li>
                      <span className="text-blue-600 font-semibold">
                        nombre de usuario
                      </span>
                      (sin el{" "}
                      <span className="text-red-600">@mindeporte.gov.co</span>)
                    </li>
                    <li>
                      <span className="text-blue-600 font-semibold">
                        contraseña
                      </span>
                      (la misma del correo y gesdoc)
                    </li>
                  </ul>
                  <p className="text-gray-500 text-md w-5/6">
                    📧 En caso de problemas contacte a
                    <span className="text-green-600 font-semibold">
                      soportetics@mindeporte.gov.co
                    </span>
                    .
                  </p>
                </div>
                <div>
                  <Input
                    type="text"
                    value={username}
                    variant="bordered"
                    label="Usuario"
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="max-w-xs text-black"
                  />
                </div>
                <div>
                  <Input
                    label="Contraseña"
                    variant="bordered"
                    placeholder="Ingresa la contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                    onKeyPress={handleKeyPress}
                    className="max-w-xs text-black"
                  />
                </div>
                <div>
                  <Button
                    onClick={handleLogin}
                    className="bg-[#4a53a0] text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <CircularProgress size="sm" color="current" />
                    ) : (
                      "Iniciar sesión"
                    )}
                  </Button>
                </div>
              </div>

              <div className="hidden sm:block">
                <Image
                  src="/assets/img/fondo.png"
                  className="w-100"
                  width={1000}
                  height={1000}
                  alt="login"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}
