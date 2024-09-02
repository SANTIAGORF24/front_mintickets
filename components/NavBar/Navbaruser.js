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
  const [userFullName, setUserFullName] = useState(""); // Estado para almacenar el nombre completo del usuario
  const [userEmail, setUserEmail] = useState(""); // Estado para almacenar el correo del usuario
  const [userId, setUserId] = useState(""); // Estado para almacenar el ID del usuario

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        console.error("No se encontró el token de acceso.");
        return;
      }

      const response = await fetch(
        "https://backend-mintickets.vercel.app/auth/user",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      console.log("Datos de la respuesta:", data);

      if (response.ok) {
        setUserFullName(data.full_name);
        setUserEmail(data.email);
        setUserId(data.id);
        console.log("Nombre completo del usuario:", data.full_name);
        console.log("Correo del usuario:", data.email);
        console.log("ID del usuario:", data.id);
      } else {
        console.error("Error:", data.message);
      }
    } catch (error) {
      console.error("Error al obtener los datos del usuario:", error);
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
            src="/assets/img/avatar.png"
            className="w-50"
            width={60}
            height={60}
            style={{ width: "auto", height: "auto" }} // Agrega estos estilos
            alt="logo"
          />
        </div>
      </NavbarBrand>

      <NavbarContent
        className="hidden sm:flex gap-4 space-x-20"
        justify="center"
      >
        <NavbarItem>
          <Link href="/ticket" className="text-[#4a53a0] font-bold">
            Mis tickets
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="/nuevoticket" className="text-[#4a53a0] font-bold">
            Nuevo ticket
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="/todostickets" className="text-[#4a53a0] font-bold">
            Todos los tickets
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
            />
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Profile Actions"
            variant="flat"
            className="text-black"
          >
            <DropdownItem key="profile" className="h-14 gap-2">
              <p className="font-semibold">Registrado como</p>
              <p className="font-semibold">{userFullName}</p>{" "}
              <p className="text-gray-500">{userEmail}</p>{" "}
            </DropdownItem>
            S
            <DropdownItem key="settings" href="/perfil">
              Mi configuracion
            </DropdownItem>
            <DropdownItem key="analytics" href="/estadisticas">
              Estadisticas
            </DropdownItem>
            <DropdownItem key="configurations" href="/datos">
              Configuracion
            </DropdownItem>
            <DropdownItem key="logout" color="danger" onClick={handleLogout}>
              Cerrar sesión
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
    </Navbar>
  );
}
