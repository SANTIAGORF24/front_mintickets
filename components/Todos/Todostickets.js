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
  Button,
} from "@nextui-org/react";
import { capitalize } from "../ticket/Utils";
import { DeleteIcon, EditIcon, EyeIcon } from "../ticket/Iconsactions";
import * as XLSX from "xlsx"; // Importa la biblioteca XLSX

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
  { uid: "solucion_caso", name: "Solución" },
  { uid: "fecha_creacion", name: "Fecha de Creación" },
  { uid: "actions", name: "Acciones" }, // Nueva columna de acciones
];

export function Todostickets() {
  const [tickets, setTickets] = useState([]);

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
        // Recargar la página después de eliminar el ticket
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error deleting ticket:", error);
      });
  };

  const renderActions = (id) => {
    return (
      <div className="relative flex items-center gap-2">
        <span
          className="text-lg cursor-pointer active:opacity-50 text-black"
          onClick={() => deleteTicket(id)}
        >
          <EyeIcon />
        </span>
        <span className="text-lg cursor-pointer active:opacity-50 text-blue-600">
          <EditIcon />
        </span>
        <span
          className="text-lg cursor-pointer active:opacity-50 trash-icon text-red-500"
          onClick={() => deleteTicket(id)}
        >
          <DeleteIcon />
        </span>
      </div>
    );
  };

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(tickets);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Tickets");
    XLSX.writeFile(workbook, "tickets.xlsx");
  };

  return (
    <div className="w-full">
      <div className="flex items-end justify-end">
        <Button
          color="primary"
          onClick={downloadExcel}
          className="bg-[#4a53a0]"
        >
          Descarga Excel
        </Button>
      </div>
      <div className="py-5">
        <Table
          aria-label="Tabla de Tickets"
          isHeaderSticky
          selectedKeys={[]}
          selectionMode="multiple"
          classNames={{ cell: "text-black" }} // Aplicar color negro al texto de la tabla
        >
          <TableHeader columns={columns}>
            {(column) => {
              if (column.uid === "actions") {
                return (
                  <TableColumn key={column.uid} align="center">
                    {column.name}
                  </TableColumn>
                );
              }
              return (
                <TableColumn key={column.uid} align="start">
                  {column.name}
                </TableColumn>
              );
            }}
          </TableHeader>
          <TableBody emptyContent={"No se encontraron tickets"} items={tickets}>
            {(ticket) => (
              <TableRow key={ticket.id}>
                {(columnKey) => {
                  if (columnKey === "actions") {
                    return <TableCell>{renderActions(ticket.id)}</TableCell>;
                  }
                  if (columnKey === "estado") {
                    return (
                      <TableCell>
                        <Chip
                          color={statusColorMap[ticket[columnKey]]}
                          size="sm"
                          variant="flat"
                        >
                          {capitalize(ticket[columnKey])}
                        </Chip>
                      </TableCell>
                    );
                  }
                  return (
                    <TableCell style={{ color: "black" }}>
                      {ticket[columnKey]}
                    </TableCell>
                  );
                }}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
