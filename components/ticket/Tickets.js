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
  Pagination,
} from "@nextui-org/react";
import { capitalize } from "./Utils";
import { DeleteIcon, EditIcon, EyeIcon } from "./Iconsactions";
import { TicketModal } from "./TicketModal";
import { Editarticket } from "./Editarticket";
import { TicketCharts } from "./TicketCharts";

const BACKEND_URL = "https://backend-mintickets.vercel.app/";

const statusColorMap = {
  Creado: "danger",
  "En proceso": "warning",
  Solucionado: "success",
};

const columns = [
  { uid: "tema", name: "Tema" },
  { uid: "estado", name: "Estado" },
  { uid: "tercero_nombre", name: "Tercero" },
  { uid: "especialista_nombre", name: "Especialista" },
  { uid: "descripcion_caso", name: "Descripción del Caso" },
  { uid: "actions", name: "Acciones" },
];

export function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [filterValue, setFilterValue] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [userEmail, setUserEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [userFullName, setUserFullName] = useState("");
  const [selectedTicketDescription, setSelectedTicketDescription] =
    useState("");
  const [selectedTicketId, setSelectedTicketId] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (token) {
          const response = await fetch(`${BACKEND_URL}auth/user`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await response.json();
          if (response.ok) {
            setUserFullName(data.full_name);
            setUserEmail(data.email);
            setUserId(data.id);
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
    setIsLoading(true);
    fetch(`${BACKEND_URL}tickets`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setTickets(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching tickets:", error);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    const filtered = tickets.filter(
      (ticket) =>
        ticket.especialista_nombre.toLowerCase() ===
          userFullName.toLowerCase() &&
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
    setFilteredTickets(filtered);
  }, [tickets, filterValue, userFullName]);

  const deleteTicket = (id) => {
    axios
      .delete(`${BACKEND_URL}tickets/${id}`)
      .then(() => {
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
  };

  const renderActions = (ticket) => (
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
        <Editarticket ticketData={ticket} onTicketUpdate={handleTicketUpdate} />
      </span>
      <span
        className="text-lg cursor-pointer active:opacity-50 trash-icon text-red-500"
        onClick={() => deleteTicket(ticket.id)}
      >
        <DeleteIcon />
      </span>
    </div>
  );

  const handleSearchChange = (value) => {
    setFilterValue(value);
    setPage(1);
  };

  const handleClearSearch = () => {
    setFilterValue("");
    setPage(1);
  };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  };

  const handleTicketUpdate = (updatedTicket) => {
    setTickets((prevTickets) =>
      prevTickets.map((ticket) =>
        ticket.id === updatedTicket.id ? updatedTicket : ticket
      )
    );
  };

  if (isLoading) {
    return <div>Cargando tickets...</div>;
  }

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
          <TableHeader>
            {columns.map((column) => (
              <TableColumn
                key={column.uid}
                align={column.uid === "actions" ? "center" : "start"}
              >
                {column.name}
              </TableColumn>
            ))}
          </TableHeader>
          <TableBody
            emptyContent={"No se encontraron tickets"}
            items={filteredTickets.slice(
              (page - 1) * rowsPerPage,
              page * rowsPerPage
            )}
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
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
              </select>
            </label>
          </div>
          <Pagination
            total={Math.ceil(filteredTickets.length / rowsPerPage)}
            current={page}
            onChange={setPage}
          />
        </div>
      </div>
      <TicketModal
        isOpen={selectedTicketId !== ""}
        onClose={() => setSelectedTicketId("")}
        description={selectedTicketDescription}
      />
      {filteredTickets.length > 0 && (
        <div className="mt-8">
          <TicketCharts tickets={filteredTickets} />
        </div>
      )}
    </div>
  );
}
