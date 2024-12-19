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

  useEffect(() => {
    // Retrieve user information from localStorage when the component mounts
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserFullName(parsedUser.fullName || parsedUser.full_name || "");
        setUserEmail(parsedUser.email || "");
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    } else {
      // Redirect to login if no user data is found
      router.push("/");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
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
            x
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
