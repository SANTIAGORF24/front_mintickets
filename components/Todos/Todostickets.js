import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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
import { capitalize } from "../ticket/Utils";
import { DeleteIcon, EditIcon, EyeIcon } from "../ticket/Iconsactions";
import { TicketModal } from "../ticket/TicketModal";
import { Editarticket } from "../ticket/Editarticket";
import * as XLSX from "xlsx";

const statusColorMap = {
  Creado: "danger",
  "En proceso": "warning",
  Solucionado: "success",
};

const columns = [
  { uid: "id", name: "ID" },
  { uid: "fecha_creacion", name: "Fecha de Creación" },
  { uid: "fecha_finalizacion", name: "Fecha de Finalización" },
  { uid: "tema", name: "Tema" },
  { uid: "estado", name: "Estado" },
  { uid: "tercero_nombre", name: "Tercero" },
  { uid: "especialista_nombre", name: "Especialista" },
  { uid: "descripcion_caso", name: "Descripción del Caso" },
  { uid: "solucion_caso", name: "Solución del Caso" },
  { uid: "tiempo_de_respuesta", name: "Tiempo de Respuesta" },
  { uid: "actitud", name: "Actitud" },
  { uid: "respuesta", name: "Respuesta" },
  { uid: "actions", name: "Acciones" },
];

export function Todostickets() {
  const [tickets, setTickets] = useState([]);
  const [filterValue, setFilterValue] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedTicketDescription, setSelectedTicketDescription] =
    useState("");
  const [selectedTicketId, setSelectedTicketId] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/tickets/`)
      .then((response) => {
        const cleanedTickets = response.data.map((ticket) => ({
          ...ticket,
          fecha_creacion: ticket.fecha_creacion
            ? new Date(ticket.fecha_creacion)
            : null,
          fecha_finalizacion: ticket.fecha_finalizacion
            ? new Date(ticket.fecha_finalizacion)
            : null,
        }));
        setTickets(cleanedTickets);
      })
      .catch((error) => {
        console.error("Error fetching tickets:", error);
      });
  }, []);

  const deleteTicket = (id) => {
    axios
      .delete(`${process.env.NEXT_PUBLIC_API_URL}/tickets/${id}/`)
      .then((response) => {
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

  const handleTicketUpdate = (updatedTicket) => {
    setTickets((prevTickets) =>
      prevTickets.map((ticket) =>
        ticket.id === updatedTicket.id ? updatedTicket : ticket
      )
    );
  };

  const renderActions = (ticket) => {
    return (
      <div className="relative flex items-center gap-2 ">
        <span
          className="text-lg cursor-pointer active:opacity-50 text-black"
          onClick={() =>
            openModalWithDescription(ticket.id, ticket.descripcion_caso)
          }
        >
          <EyeIcon />
        </span>
        <span className="text-lg cursor-pointer active:opacity-50 text-blue-600">
          <Editarticket
            ticketData={ticket}
            onTicketUpdate={handleTicketUpdate}
          />
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
    const value = parseInt(e.target.value);
    setRowsPerPage(value);
    setPage(1);
  };

  const clearFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setFilterValue("");
  };

  const downloadExcel = () => {
    const filteredTickets = getFilteredTickets();
    const worksheetData = filteredTickets.map((ticket) => [
      ticket.id,
      formatDate(ticket.fecha_creacion),
      formatDate(ticket.fecha_finalizacion),
      ticket.tema,
      ticket.estado,
      ticket.tercero_nombre,
      ticket.especialista_nombre,
      ticket.descripcion_caso,
      ticket.solucion_caso,
      ticket.tiempo_de_respuesta,
      ticket.actitud,
      ticket.respuesta,
    ]);

    // Añadir encabezados
    worksheetData.unshift([
      "ID",
      "Fecha de Creación",
      "Fecha de Finalización",
      "Tema",
      "Estado",
      "Tercero",
      "Especialista",
      "Descripción del Caso",
      "Solución del Caso",
      "Tiempo de Respuesta",
      "Actitud",
      "Respuesta",
    ]);

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Tickets");
    XLSX.writeFile(workbook, "tickets.xlsx");
  };

  const getFilteredTickets = () => {
    return tickets.filter((ticket) => {
      const matchesFilter =
        ticket.tema.toLowerCase().includes(filterValue.toLowerCase()) ||
        ticket.estado.toLowerCase().includes(filterValue.toLowerCase()) ||
        ticket.tercero_nombre
          .toLowerCase()
          .includes(filterValue.toLowerCase()) ||
        ticket.especialista_nombre
          .toLowerCase()
          .includes(filterValue.toLowerCase()) ||
        ticket.descripcion_caso
          .toLowerCase()
          .includes(filterValue.toLowerCase()) ||
        (ticket.solucion_caso &&
          ticket.solucion_caso
            .toLowerCase()
            .includes(filterValue.toLowerCase())) ||
        (ticket.tiempo_de_respuesta &&
          ticket.tiempo_de_respuesta
            .toString()
            .toLowerCase()
            .includes(filterValue.toLowerCase())) ||
        (ticket.actitud &&
          ticket.actitud
            .toString()
            .toLowerCase()
            .includes(filterValue.toLowerCase())) ||
        (ticket.respuesta &&
          ticket.respuesta
            .toString()
            .toLowerCase()
            .includes(filterValue.toLowerCase()));

      const matchesDateRange =
        (!startDate ||
          (ticket.fecha_creacion && ticket.fecha_creacion >= startDate)) &&
        (!endDate ||
          (ticket.fecha_finalizacion && ticket.fecha_finalizacion <= endDate));

      return matchesFilter && matchesDateRange;
    });
  };

  const filteredTickets = getFilteredTickets();
  const paginatedTickets = filteredTickets.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const formatDate = (date) => {
    if (!date) return "N/A";
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <div className="w-full">
      <div>
        <div className="flex justify-between items-center gap-3 mb-4 text-black">
          <Input
            className="w-[44%]"
            placeholder="Search..."
            value={filterValue}
            onValueChange={handleSearchChange}
            isClearable
            onClear={handleClearSearch}
          />
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            placeholderText="Fecha de inicio"
            className="rounded-md border border-gray-300 p-2 text-black"
            dateFormat="yyyy-MM-dd"
          />
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            placeholderText="Fecha de fin"
            className="rounded-md border border-gray-300 p-2"
            dateFormat="yyyy-MM-dd"
          />
          <Button color="primary" onClick={clearFilters}>
            Limpiar filtros
          </Button>
          <Button className="bg-green-500 text-white" onClick={downloadExcel}>
            Descargar Excel
          </Button>
        </div>
      </div>
      <Table className="text-black">
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
        <TableBody>
          {paginatedTickets.map((ticket) => (
            <TableRow key={ticket.id}>
              <TableCell>{ticket.id}</TableCell>
              <TableCell>{formatDate(ticket.fecha_creacion)}</TableCell>
              <TableCell>{formatDate(ticket.fecha_finalizacion)}</TableCell>
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
              <TableCell className="whitespace-pre-wrap break-words">
                {ticket.descripcion_caso}
              </TableCell>
              <TableCell className="whitespace-pre-wrap break-words">
                {ticket.solucion_caso}
              </TableCell>
              <TableCell>{ticket.tiempo_de_respuesta}</TableCell>
              <TableCell>{ticket.actitud}</TableCell>
              <TableCell>{ticket.respuesta}</TableCell>
              <TableCell>{renderActions(ticket)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination
        total={Math.ceil(filteredTickets.length / rowsPerPage)}
        initialPage={1}
        page={page}
        onChange={(page) => setPage(page)}
      />
      <div className="mt-4 text-black">
        <label className="mr-2">Filas por página:</label>
        <select
          value={rowsPerPage}
          onChange={handleRowsPerPageChange}
          className="p-1 border rounded"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
          <option value={20}>20</option>
          <option value={filteredTickets.length}>Todos</option>
        </select>
      </div>
    </div>
  );
}
