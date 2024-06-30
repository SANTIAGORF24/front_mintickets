import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Pagination,
} from "@nextui-org/react";
import { capitalize } from "./Utils";
import { DeleteIcon, EditIcon, EyeIcon } from "./Iconsactions";
import { TicketModal } from "./TicketModal";
import { Editarticket } from "./Editarticket";

const statusColorMap = {
  Creado: "danger", // Rojo
  "En proceso": "warning", // Naranja
  Solucionado: "success", // Verde
};

const columns = [
  { uid: "tema", name: "Tema" },
  { uid: "estado", name: "Estado" },
  { uid: "tercero_nombre", name: "Tercero" },
  { uid: "especialista_nombre", name: "Especialista" },
  { uid: "descripcion_caso", name: "Descripción del Caso" },
  { uid: "actions", name: "Acciones" }, // Nueva columna de acciones
];

export function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [filterValue, setFilterValue] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [userEmail, setUserEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [userFullName, setUserFullName] = useState(""); // Nuevo estado para el nombre completo del usuario
  const [selectedTicketDescription, setSelectedTicketDescription] =
    useState(""); // Estado para almacenar la descripción del ticket seleccionado
  const [selectedTicketId, setSelectedTicketId] = useState(""); // Estado para almacenar el ID del ticket seleccionado

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("access_token");

        if (token) {
          const response = await fetch("http://127.0.0.1:5000/auth/user", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const data = await response.json();

          if (response.ok) {
            setUserFullName(data.full_name); // Almacenar el nombre completo del usuario
            setUserEmail(data.email);
            setUserId(data.id);
            console.log("Nombre completo del usuario:", data.full_name);
            console.log("Correo del usuario:", data.email);
            console.log("ID del usuario:", data.id);
          } else {
            console.error(data.message);
          }
        }
      } catch (error) {
        console.error("Error al obtener los datos del usuario:", error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/tickets")
      .then((response) => {
        setTickets(response.data);
      })
      .catch((error) => {
        console.error("Error fetching tickets:", error);
      });
  }, []);

  const deleteTicket = (id) => {
    axios
      .delete(`http://127.0.0.1:5000/tickets/${id}`)
      .then((response) => {
        // Actualiza el estado local de tickets excluyendo el ticket eliminado
        setTickets((prevTickets) =>
          prevTickets.filter((ticket) => ticket.id !== id)
        );
      })
      .catch((error) => {
        console.error("Error deleting ticket:", error);
      });
  };

  const openModalWithDescription = (id, description) => {
    setSelectedTicketId(id);
    setSelectedTicketDescription(description);
    // Abre el modal aquí
  };

  const renderActions = (ticket) => {
    return (
      <div className="relative flex items-center gap-2">
        <span
          className="text-lg cursor-pointer active:opacity-50 text-black"
          onClick={() =>
            openModalWithDescription(ticket.id, ticket.descripcion_caso)
          }
        >
          <EyeIcon />
        </span>
        <span className="text-lg cursor-pointer active:opacity-50 text-blue-600">
          <Editarticket ticketData={ticket} />
        </span>
        <span
          className="text-lg cursor-pointer active:opacity-50 trash-icon text-red-500"
          onClick={() => deleteTicket(ticket.id)}
        >
          <DeleteIcon />
        </span>
      </div>
    );
  };

  const handleSearchChange = (value) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  };

  const handleClearSearch = () => {
    setFilterValue("");
    setPage(1);
  };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  };

  const headerColumns = columns.map((column) => (
    <TableColumn
      key={column.uid}
      align={column.uid === "actions" ? "center" : "start"}
    >
      {column.name}
    </TableColumn>
  ));

  const filteredTickets = tickets.filter(
    (ticket) =>
      ticket.especialista_nombre.toLowerCase() === userFullName.toLowerCase() &&
      !ticket.estado.toLowerCase().includes("solucionado") &&
      (ticket.tema.toLowerCase().includes(filterValue.toLowerCase()) ||
        ticket.estado.toLowerCase().includes(filterValue.toLowerCase()) ||
        ticket.tercero_nombre
          .toLowerCase()
          .includes(filterValue.toLowerCase()) ||
        ticket.especialista_nombre
          .toLowerCase()
          .includes(filterValue.toLowerCase()) ||
        ticket.descripcion_caso
          .toLowerCase()
          .includes(filterValue.toLowerCase()))
  );

  const paginatedTickets = filteredTickets.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  return (
    <div className="w-full">
      <div>
        <div className="flex justify-between items-center gap-3 mb-4">
          <Input
            className="w-[44%]"
            placeholder="Search..."
            value={filterValue}
            onValueChange={handleSearchChange}
            isClearable
            onClear={handleClearSearch}
          />
          <div className="flex gap-3">
            <Button
              color="primary"
              variant="flat"
              onClick={() => (window.location.href = "/nuevoticket")}
            >
              Nuevo Ticket
            </Button>
          </div>
        </div>
        <Table
          aria-label="Tabla de Tickets"
          isHeaderSticky
          selectedKeys={[]}
          selectionMode="multiple"
          style={{ color: "black" }}
        >
          <TableHeader>{headerColumns}</TableHeader>
          <TableBody
            emptyContent={"No se encontraron tickets"}
            items={paginatedTickets}
          >
            {(ticket) => (
              <TableRow key={ticket.id}>
                <TableCell>{ticket.tema}</TableCell>
                <TableCell>
                  <Chip
                    color={statusColorMap[ticket.estado]}
                    size="sm"
                    variant="flat"
                  >
                    {capitalize(ticket.estado)}
                  </Chip>
                </TableCell>
                <TableCell>{ticket.tercero_nombre}</TableCell>
                <TableCell>{ticket.especialista_nombre}</TableCell>
                <TableCell>
                  {ticket.descripcion_caso.split(" ").slice(0, 10).join(" ")}
                </TableCell>
                <TableCell>{renderActions(ticket)}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="flex justify-between items-center mt-4 text-black">
          <div>
            <label>
              Rows por pagina:
              <select value={rowsPerPage} onChange={handleRowsPerPageChange}>
                <option value="20">20</option>
                <option value="30">30</option>
                <option value="45">45</option>
              </select>
            </label>
            <Pagination
              total={Math.ceil(filteredTickets.length / rowsPerPage)}
              current={page}
              onChange={setPage}
            />
          </div>
        </div>
      </div>
      {/* Aquí se incluye el Modal con la descripción del ticket */}
      <TicketModal
        isOpen={selectedTicketId !== ""}
        onClose={() => setSelectedTicketId("")}
        description={selectedTicketDescription}
      />
    </div>
  );
}
