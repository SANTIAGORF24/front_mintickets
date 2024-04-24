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
  Creado: "danger", // Rojo
  "En proceso": "warning", // Naranja
  Solucionado: "success", // Verde
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
  { uid: "actions", name: "Acciones" }, // Nueva columna de acciones
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
        window.location.reload();
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
    const value = e.target.value;
    setRowsPerPage(value);
    setPage(1); // Reinicia la página al cambiar el número de filas por página
    if (value === "todos") {
      setRowsPerPage(filteredTickets.length); // Muestra todos los tickets sin paginación
    }
  };

  const clearFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setFilterValue("");
  };

  const downloadExcel = () => {
    const filteredStartDate = startDate ? new Date(startDate) : null;
    const filteredEndDate = endDate ? new Date(endDate) : null;

    const filteredTickets = tickets.filter((ticket) => {
      const ticketStartDate = new Date(ticket.fecha_creacion);
      const ticketEndDate = new Date(ticket.fecha_finalizacion);
      return (
        (!filteredStartDate || ticketStartDate >= filteredStartDate) &&
        (!filteredEndDate || ticketEndDate <= filteredEndDate) &&
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
            .includes(filterValue.toLowerCase()) ||
          ticket.solucion_caso
            .toLowerCase()
            .includes(filterValue.toLowerCase()))
      );
    });

    const orderedTickets = filteredTickets.map((ticket) => ({
      id: ticket.id,
      fecha_creacion: ticket.fecha_creacion,
      fecha_finalizacion: ticket.fecha_finalizacion,
      tema: ticket.tema,
      estado: ticket.estado,
      tercero: ticket.tercero_nombre,
      especialista: ticket.especialista_nombre,
      descripcion_caso: ticket.descripcion_caso,
      solucion_caso: ticket.solucion_caso,
    }));

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(orderedTickets);

    XLSX.utils.book_append_sheet(workbook, worksheet, "Tickets");

    XLSX.writeFile(workbook, "tickets.xlsx");
  };

  const headerColumns = columns.map((column) => (
    <TableColumn
      key={column.uid}
      align={column.uid === "actions" ? "center" : "start"}
    >
      {column.name}
    </TableColumn>
  ));

  const filteredTickets = tickets.filter((ticket) => {
    const ticketStartDate = new Date(ticket.fecha_creacion);
    const ticketEndDate = new Date(ticket.fecha_finalizacion);
    return (
      (!startDate || ticketStartDate >= startDate) &&
      (!endDate || ticketEndDate <= endDate) &&
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
          .includes(filterValue.toLowerCase()) ||
        (ticket.solucion_caso &&
          ticket.solucion_caso
            .toLowerCase()
            .includes(filterValue.toLowerCase()))) // Verificación de solucion_caso
    );
  });

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
          <div className="text-black">
            <div className="flex items-center justify-center space-x-3">
              <div className="text-black border-black">
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  placeholderText="Fecha de inicio"
                  className="bg-slate-100 p-3 rounded-lg"
                />
              </div>
              <div className="text-black border-black">
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                  placeholderText="Fecha de fin"
                  className="bg-slate-100 p-3 rounded-lg"
                />
              </div>
              <div>
                <Button
                  variant="text"
                  onClick={clearFilters}
                  className="bg-rose-400 text-white"
                >
                  Limpiar Filtro
                </Button>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button color="primary" variant="flat" onClick={downloadExcel}>
              Descargar Excel
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
                <TableCell>{ticket.descripcion_caso}</TableCell>
                <TableCell>{ticket.solucion_caso}</TableCell>
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
                <option value="todos">Todos</option>
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

const formatDate = (dateString) => {
  if (!dateString) return ""; // Verifica si dateString es null o undefined

  // Ajusta el formato según el de tu base de datos
  return dateString.split(" ")[0]; // Toma solo la parte de la fecha
};
