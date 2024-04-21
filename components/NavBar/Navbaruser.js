import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
} from "@nextui-org/react";
import Image from "next/image";

export function Navbaruser() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState(""); // Estado para almacenar el correo del usuario

  useEffect(() => {
    fetchUserEmail();
  }, []);

  const fetchUserEmail = async () => {
    try {
      const token = localStorage.getItem("access_token"); // Obtener el token de acceso del almacenamiento local
      console.log("Token de acceso:", token); // Opción 2: Verifica el token de acceso

      if (token) {
        const response = await fetch("http://127.0.0.1:5000/auth/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Respuesta del servidor:", response); // Opción 1: Verifica la respuesta del servidor

        const data = await response.json();
        console.log("Datos recibidos del servidor:", data); // Opción 3: Verifica la estructura de la respuesta del servidor

        if (response.ok) {
          console.log("Correo del usuario:", data.email);
          setUserEmail(data.email);
        } else {
          console.error(data.message);
        }
      }
    } catch (error) {
      console.error("Error al obtener el correo del usuario:", error); // Opción 4: Verifica el manejo de errores
    }
  };

  // Función para cerrar sesión y redirigir a la página principal
  const handleLogout = () => {
    localStorage.removeItem("access_token"); // Eliminar el token de acceso del almacenamiento local al cerrar sesión
    router.push("/");
  };

  return (
    <Navbar>
      <NavbarBrand>
        <div className="flex space-x-10">
          <Image
            src="/assets/img/Colombia.png"
            className="w-100"
            width={120}
            height={120}
            style={{ width: "auto", height: "auto" }} // Agrega estos estilos
            alt="logo"
          />
          <Image
            src="/assets/img/mind.png"
            className="w-100"
            width={120}
            height={120}
            style={{ width: "auto", height: "auto" }} // Agrega estos estilos
            alt="logo"
          />
        </div>
      </NavbarBrand>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link href="/ticket" className="text-[#4a53a0] font-semibld">
            Casos
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="/nuevoticket" className="text-[#4a53a0] font-semibld">
            Nuevo Caso
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="#" className="text-[#4a53a0] font-semibld">
            Todos los Casos
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent as="div" justify="end">
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className="transition-transform"
              size="sm"
              src="/assets/img/avatar.png"
            />
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Profile Actions"
            variant="flat"
            className="text-black"
          >
            <DropdownItem key="profile" className="h-14 gap-2">
              <p className="font-semibold">Registrado como</p>
              <p className="font-semibold">{userEmail}</p>{" "}
              {/* Mostrar el correo del usuario */}
            </DropdownItem>
            <DropdownItem key="settings">Mi configuracion</DropdownItem>
            <DropdownItem key="team_settings">
              Configuracion de equipo
            </DropdownItem>
            <DropdownItem key="analytics">Estadisticas</DropdownItem>
            <DropdownItem key="configurations" href="/datos">
              Configuracion
            </DropdownItem>
            <DropdownItem key="help_and_feedback">Ayuda</DropdownItem>
            {/* Añadir DropdownItem para cerrar sesión con el manejador de eventos */}
            <DropdownItem key="logout" color="danger" onClick={handleLogout}>
              Cerrar sesión
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
    </Navbar>
  );
}
