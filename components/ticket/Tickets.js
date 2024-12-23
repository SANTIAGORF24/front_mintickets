"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Chip,
  Pagination,
} from "@nextui-org/react";
import { capitalize } from "./Utils";
import { DeleteIcon, EditIcon, EyeIcon } from "./Iconsactions";
import { TicketModal } from "./TicketModal";
import { Editarticket } from "./Editarticket";
import { TicketCharts } from "./TicketCharts";
import { SearchIcon, ChevronDownIcon, PlusIcon } from "./Icons"; // Assuming you have these icons
import { Download } from "react-feather"; // Asegúrate de tener importados los íconos necesarios

// Status color map
const statusColorMap = {
  Creado: "danger",
  "En proceso": "warning",
  Solucionado: "success",
};

// Status options based on your existing states
const statusOptions = [
  { name: "Creado", uid: "Creado", sortable: true },
  { name: "En proceso", uid: "En proceso", sortable: true },
  { name: "Devuelto", uid: "Devuelto", sortable: true },
  { name: "Solucionado", uid: "Solucionado" },
];

// Columns definition
const columns = [
  { name: "TEMA", uid: "tema", sortable: true },
  { name: "ESTADO", uid: "estado", sortable: true },
  { name: "TERCERO", uid: "tercero_nombre", sortable: true },
  { name: "ESPECIALISTA", uid: "especialista_nombre" },
  { name: "DESCRIPCIÓN", uid: "descripcion_caso", sortable: true },
  { name: "ACCIONES", uid: "actions", sortable: true },
];

const INITIAL_VISIBLE_COLUMNS = columns.map((column) => column.uid);
const INITIAL_STATUS_FILTER = new Set(["Creado", "En proceso", "Devuelto"]);

export function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));
  const [visibleColumns, setVisibleColumns] = useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [statusFilter, setStatusFilter] = useState(INITIAL_STATUS_FILTER);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "tema",
    direction: "ascending",
  });
  const [page, setPage] = useState(1);
  const [userEmail, setUserEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [userFullName, setUserFullName] = useState("");
  const [selectedTicketDescription, setSelectedTicketDescription] =
    useState("");
  const [selectedTicketId, setSelectedTicketId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [descriptionAttachments, setDescriptionAttachments] = useState([]);

  // User data retrieval
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUserFullName(userData.fullName);
      setUserEmail(userData.email);
      setUserId(userData.username);
    }
  }, []);

  // Ticket fetching
  const fetchTickets = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/tickets/`
      );
      setTickets(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // Filtering logic
  const filteredItems = useMemo(() => {
    let filteredTickets = tickets.filter(
      (ticket) =>
        ticket.especialista_nombre.toLowerCase() === userFullName.toLowerCase()
    );

    if (filterValue) {
      filteredTickets = filteredTickets.filter((ticket) =>
        Object.values(ticket).some(
          (value) =>
            value &&
            value.toString().toLowerCase().includes(filterValue.toLowerCase())
        )
      );
    }

    if (
      statusFilter !== "all" &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      filteredTickets = filteredTickets.filter((ticket) =>
        Array.from(statusFilter).includes(ticket.estado)
      );
    }

    return filteredTickets;
  }, [tickets, filterValue, statusFilter, userFullName]);

  // Pagination calculations
  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  // Sorting logic
  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  // Render cell logic
  const renderCell = useCallback((ticket, columnKey) => {
    const cellValue = ticket[columnKey];

    switch (columnKey) {
      case "estado":
        return (
          <Chip
            className="capitalize"
            color={statusColorMap[ticket.estado]}
            size="sm"
            variant="flat"
          >
            {cellValue}
          </Chip>
        );
      case "descripcion_caso":
        return cellValue.split(" ").slice(0, 10).join(" ") + "...";
      case "actions":
        return (
          <div className="relative flex justify-end items-center gap-2">
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
      default:
        return cellValue;
    }
  }, []);

  // Handlers
  const deleteTicket = (id) => {
    axios
      .delete(`${process.env.NEXT_PUBLIC_API_URL}/tickets/${id}/`)
      .then(() => {
        setTickets((prevTickets) =>
          prevTickets.filter((ticket) => ticket.id !== id)
        );
      })
      .catch((error) => {
        console.error("Error deleting ticket:", error);
      });
  };

  const openModalWithDescription = async (id, description) => {
    setSelectedTicketId(id);
    setSelectedTicketDescription(description);
    await fetchAttachments(id);
  };

  const fetchAttachments = async (ticketId) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/tickets/${ticketId}/attachments/`
      );
      const descAttachments = response.data.filter(
        (attachment) => attachment.is_description_file === true
      );
      setDescriptionAttachments(descAttachments);
    } catch (error) {
      console.error("Error fetching attachments:", error);
    }
  };

  const downloadAttachment = async (attachmentId) => {
    try {
      const response = await axios({
        url: `${process.env.NEXT_PUBLIC_API_URL}/tickets/attachment/${attachmentId}/`,
        method: "GET",
        responseType: "blob",
      });
      const attachment = descriptionAttachments.find(
        (att) => att.id === attachmentId
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        attachment ? attachment.file_name : "download"
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading attachment:", error);
    }
  };

  const handleTicketUpdate = (updatedTicket) => {
    setTickets((prevTickets) =>
      prevTickets.map((ticket) =>
        ticket.id === updatedTicket.id ? updatedTicket : ticket
      )
    );
  };

  const onRowsPerPageChange = useCallback((e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onSearchChange = useCallback((value) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const changeStatusToInProcess = async () => {
    const updatedTickets = tickets.map((ticket) => {
      if (selectedKeys.has(ticket.id)) {
        return { ...ticket, estado: "En proceso" };
      }
      return ticket;
    });

    setTickets(updatedTickets);

    await Promise.all(
      Array.from(selectedKeys).map((id) =>
        axios
          .patch(`${process.env.NEXT_PUBLIC_API_URL}/tickets/${id}/`, {
            estado: "En proceso",
          })
          .catch((error) => {
            console.error("Error updating ticket status:", error);
          })
      )
    );

    setSelectedKeys(new Set());
    fetchTickets(); // Recargar los tickets después de actualizar el estado
  };

  // Top content (search and filters)
  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col ">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Buscar tickets..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            {selectedKeys.size > 0 && (
              <Button color="primary" onClick={changeStatusToInProcess}>
                Cambiar a estado En proceso
              </Button>
            )}
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex text-black">
                <Button
                  endContent={
                    <ChevronDownIcon className="text-small text-black" />
                  }
                  variant="flat"
                >
                  Estado
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Estado de Tickets"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={setStatusFilter}
                className="text-black"
              >
                {statusOptions.map((status) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {capitalize(status.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="flat"
                >
                  Columnas
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Columnas de Tabla"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
                className="text-black"
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button
              color="primary"
              endContent={<PlusIcon />}
              onClick={() => (window.location.href = "/nuevoticket")}
            >
              Nuevo Ticket
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {filteredItems.length} tickets
          </span>
          <label className="flex items-center text-default-400 text-small">
            Filas por página:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
              value={rowsPerPage}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    statusFilter,
    visibleColumns,
    onRowsPerPageChange,
    filteredItems.length,
    onSearchChange,
    onClear, // <-- Añadido
    rowsPerPage, // <-- Añadido
    selectedKeys, // <-- Añadido
  ]);

  // Bottom content (pagination)
  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-full text-small text-default-400">
          {selectedKeys === "all"
            ? "Todos los elementos seleccionados"
            : `${selectedKeys.size} de ${filteredItems.length} seleccionados`}
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={() => setPage(page - 1)}
          >
            Anterior
          </Button>
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={() => setPage(page + 1)}
          >
            Siguiente
          </Button>
        </div>
      </div>
    );
  }, [selectedKeys, filteredItems.length, page, pages]);

  // Header columns based on visible columns
  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  if (isLoading) {
    return <div>Cargando tickets...</div>;
  }

  return (
    <div className="flex flex-col gap-4 w-full text-black">
      {" "}
      {/* Added flex column and gap */}
      <Table
        isHeaderSticky
        aria-label="Tabla de Tickets"
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        selectedKeys={selectedKeys}
        selectionMode="multiple"
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        onSelectionChange={setSelectedKeys}
        onSortChange={setSortDescriptor}
        className="w-full"
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          emptyContent={"No se encontraron tickets"}
          items={sortedItems}
        >
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <TicketModal
        isOpen={selectedTicketId !== ""}
        onClose={() => setSelectedTicketId("")}
        description={selectedTicketDescription}
        descriptionAttachments={descriptionAttachments}
        downloadAttachment={downloadAttachment}
      />
      {filteredItems.length > 0 && (
        <div className="w-full">
          {" "}
          {/* Added full width */}
          <TicketCharts tickets={filteredItems} />
        </div>
      )}
    </div>
  );
}
