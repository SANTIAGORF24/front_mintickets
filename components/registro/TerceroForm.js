import React, { useState, useEffect } from "react";
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
  Pagination,
} from "@nextui-org/react";

import { SearchIcon } from "../ticket/SearchIcon";
import { PlusIcon } from "../ticket/PlusIcon";
import { DeleteIcon, EditIcon, EyeIcon } from "../ticket/Iconsactions";

export function TerceroForm() {
  const [filterValue, setFilterValue] = useState("");
  const [newTercero, setNewTercero] = useState({ name: "", email: "" });
  const [terceros, setTerceros] = useState([]);
  const [editingTerceroId, setEditingTerceroId] = useState(null);
  const [updatedTercero, setUpdatedTercero] = useState({ name: "", email: "" });
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const fetchTerceros = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/terceros");
      if (response.ok) {
        const data = await response.json();
        setTerceros(data.terceros);
      } else {
        console.error("Failed to fetch terceros");
      }
    } catch (error) {
      console.error("Error fetching terceros:", error);
    }
  };

  useEffect(() => {
    fetchTerceros();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewTercero({ ...newTercero, [name]: value });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:5000/terceros", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTercero),
      });
      if (response.ok) {
        setNewTercero({ name: "", email: "" });
        fetchTerceros();
      } else {
        console.error("Failed to add new tercero");
      }
    } catch (error) {
      console.error("Error adding new tercero:", error);
    }
  };

  const handleDeleteTercero = async (terceroId) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/terceros/${terceroId}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        fetchTerceros();
      } else {
        console.error("Failed to delete tercero");
      }
    } catch (error) {
      console.error("Error deleting tercero:", error);
    }
  };

  const handleEditTercero = (terceroId, tercero) => {
    setEditingTerceroId(terceroId);
    setUpdatedTercero(tercero);
  };

  const handleInputChangeEdit = (event) => {
    const { name, value } = event.target;
    setUpdatedTercero({ ...updatedTercero, [name]: value });
  };

  const handleUpdateTercero = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/terceros/${editingTerceroId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedTercero),
        }
      );
      if (response.ok) {
        setEditingTerceroId(null);
        fetchTerceros();
      } else {
        console.error("Failed to update tercero");
      }
    } catch (error) {
      console.error("Error updating tercero:", error);
    }
  };

  const onSearchChange = (event) => {
    setFilterValue(event.target.value);
    setPage(1);
  };

  const filteredTerceros = terceros.filter(
    (tercero) =>
      tercero.name.toLowerCase().includes(filterValue.toLowerCase()) ||
      tercero.email.toLowerCase().includes(filterValue.toLowerCase())
  );

  const pages = Math.ceil(filteredTerceros.length / rowsPerPage);
  const paginatedTerceros = filteredTerceros.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  return (
    <div>
      <div className="flex justify-between items-end mb-4">
        <Input
          isClearable
          placeholder="Search by tercero name or email..."
          size="sm"
          startContent={<SearchIcon />}
          value={filterValue}
          onChange={onSearchChange}
        />
        <Dropdown>
          <DropdownTrigger>
            <Button
              variant="bordered"
              className="bg-primary text-white"
              size="sm"
            >
              <PlusIcon />
              Nuevo
            </Button>
          </DropdownTrigger>
          <DropdownMenu>
            <DropdownItem
              isReadOnly
              key="tercero"
              className="cursor-auto text-black"
            >
              <Input
                type="text"
                variant="bordered"
                placeholder="Enter new tercero name..."
                name="name"
                value={newTercero.name}
                onChange={handleInputChange}
              />
              <Input
                type="email"
                variant="bordered"
                placeholder="Enter new tercero email..."
                name="email"
                value={newTercero.email}
                onChange={handleInputChange}
              />
            </DropdownItem>
            <DropdownItem>
              <Button
                type="submit"
                variant="bordered"
                onClick={handleFormSubmit}
              >
                Agregar
              </Button>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      <Table
        aria-label="Terceros Table"
        isCompact
        removeWrapper
        bottomContentPlacement="outside"
        topContentPlacement="outside"
        emptyContent="No terceros found"
      >
        <TableHeader>
          <TableColumn>ID</TableColumn>
          <TableColumn>Nombre</TableColumn>
          <TableColumn>Email</TableColumn>
          <TableColumn>Acciones</TableColumn>
        </TableHeader>
        <TableBody>
          {paginatedTerceros.map((tercero) => (
            <TableRow key={tercero.id}>
              <TableCell className="text-black">{tercero.id}</TableCell>
              <TableCell className="text-black">
                {editingTerceroId === tercero.id ? (
                  <Input
                    type="text"
                    name="name"
                    value={updatedTercero.name}
                    onChange={handleInputChangeEdit}
                  />
                ) : (
                  tercero.name
                )}
              </TableCell>
              <TableCell className="text-black">
                {editingTerceroId === tercero.id ? (
                  <Input
                    type="email"
                    name="email"
                    value={updatedTercero.email}
                    onChange={handleInputChangeEdit}
                  />
                ) : (
                  tercero.email
                )}
              </TableCell>
              <TableCell>
                {editingTerceroId === tercero.id ? (
                  <Button onClick={handleUpdateTercero}>Actualizar</Button>
                ) : (
                  <div className="relative flex items-center gap-2">
                    <span
                      className="text-lg cursor-pointer active:opacity-50 text-sky-800"
                      onClick={() => handleEditTercero(tercero.id, tercero)}
                    >
                      <EditIcon />
                    </span>
                    <span
                      className="text-lg text-danger cursor-pointer active:opacity-50"
                      onClick={() => handleDeleteTercero(tercero.id)}
                    >
                      <DeleteIcon />
                    </span>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-between items-center mt-4">
        <Pagination total={pages} page={page} onChange={setPage} />
        <select
          className="text-black"
          value={rowsPerPage}
          onChange={(e) => {
            setRowsPerPage(Number(e.target.value));
            setPage(1);
          }}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
          <option value={10000}>Todos</option>
        </select>
      </div>
    </div>
  );
}
