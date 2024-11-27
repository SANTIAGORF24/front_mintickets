import React, { useState, useEffect, useCallback } from "react";
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
  const [userFullName, setUserFullName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userId, setUserId] = useState("");

  // Wrap fetchUserData in useCallback to memoize it
  const fetchUserData = useCallback(async () => {
    try {
      const token = localStorage.getItem("access_token");

      if (token) {
        const response = await fetch("http://127.0.0.1:5000/auth/user", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserFullName(data.full_name);
          setUserEmail(data.email);
          setUserId(data.id);
        } else {
          const errorData = await response.json();
          console.error("Error response:", errorData);
          if (response.status === 422) {
            localStorage.removeItem("access_token");
            router.push("/");
          }
        }
      } else {
        router.push("/");
      }
    } catch (error) {
      console.error("Error al obtener los datos del usuario:", error);
    }
  }, [router]); // Include router in dependencies since it's used inside fetchUserData

  // Now include fetchUserData in the useEffect dependencies
  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
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
            style={{ width: "auto", height: "auto" }}
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
              <p className="font-semibold">{userFullName}</p>
              <p className="text-gray-500">{userEmail}</p>
            </DropdownItem>
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
