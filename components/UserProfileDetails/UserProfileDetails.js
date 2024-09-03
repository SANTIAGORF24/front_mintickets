import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Button,
  Accordion,
  AccordionItem,
  Input,
} from "@nextui-org/react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { EyeFilledIcon } from "../login/EyeFilledIcon";
import { EyeSlashFilledIcon } from "../login/EyeSlashFilledIcon"; // Ajusta el path según la ubicación de los iconos

export function UserProfileDetails() {
  const [userInfo, setUserInfo] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [passwordValid, setPasswordValid] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (token) {
        const response = await fetch(
          "https://backend-mintickets.vercel.app/auth/user",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        if (response.ok) {
          setUserInfo(data);
        } else {
          console.error(data.message);
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handlePasswordChange = async () => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&+])[A-Za-z\d@$!%*?&+]{8,}$/;

    if (newPassword !== confirmPassword) {
      setPasswordsMatch(false);
      toast.error("Las contraseñas no coinciden");
      return;
    }
    setPasswordsMatch(true);

    if (!passwordRegex.test(newPassword)) {
      setPasswordValid(false);
      toast.error(
        "La contraseña debe tener al menos una letra mayúscula, un carácter especial, un número y una letra minúscula"
      );
      return;
    }
    setPasswordValid(true);

    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(
        `https://backend-mintickets.vercel.app/auth/users/${userInfo.id}`, // Usamos el ID del usuario
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ password: newPassword }),
        }
      );

      if (response.ok) {
        toast.success("Contraseña actualizada con éxito");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        const data = await response.json();
        toast.error(`Error al actualizar la contraseña: ${data.message}`);
      }
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error("Ocurrió un error al actualizar la contraseña");
    }
  };

  if (!userInfo) return <div>Cargando...</div>;

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <ToastContainer />
      <Card>
        <CardBody>
          <h2 className="text-3xl font-bold mb-6">
            Detalles del Perfil de Usuario
          </h2>
          <Accordion>
            <AccordionItem
              key="1"
              aria-label="Nombre Completo"
              title="Nombre Completo"
            >
              <p className="text-lg">{userInfo.full_name}</p>
            </AccordionItem>
            <AccordionItem key="2" aria-label="Email" title="Email">
              <p className="text-lg">{userInfo.email}</p>
            </AccordionItem>
            <AccordionItem
              key="3"
              aria-label="ID de Usuario"
              title="ID de Usuario"
            >
              <p className="text-lg">{userInfo.id}</p>
            </AccordionItem>
            <AccordionItem
              key="4"
              aria-label="Cambiar Contraseña"
              title="Cambiar Contraseña"
            >
              <div className="relative mb-2">
                <Input
                  type={showPassword ? "text" : "password"}
                  label="Nueva Contraseña"
                  placeholder="Ingrese nueva contraseña"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  endAdornment={
                    <Button
                      size="xs"
                      auto
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeSlashFilledIcon />
                      ) : (
                        <EyeFilledIcon />
                      )}
                    </Button>
                  }
                />
              </div>
              <div className="relative mb-2">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  label="Confirmar Contraseña"
                  placeholder="Confirme nueva contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  endAdornment={
                    <Button
                      size="xs"
                      auto
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeSlashFilledIcon />
                      ) : (
                        <EyeFilledIcon />
                      )}
                    </Button>
                  }
                />
              </div>
              {!passwordsMatch && (
                <p className="text-red-500 text-sm">
                  Las contraseñas no coinciden
                </p>
              )}
              {!passwordValid && (
                <p className="text-red-500 text-sm">
                  La contraseña debe tener al menos una letra mayúscula, un
                  carácter especial, un número y una letra minúscula
                </p>
              )}
              <Button color="primary" onClick={handlePasswordChange}>
                Actualizar Contraseña
              </Button>
            </AccordionItem>
          </Accordion>
        </CardBody>
      </Card>
    </div>
  );
}
