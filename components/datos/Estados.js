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
} from "@nextui-org/react";

import { SearchIcon } from "../ticket/SearchIcon";
import { PlusIcon } from "../ticket/PlusIcon";
import { DeleteIcon, EditIcon, EyeIcon } from "../ticket/Iconsactions";

export function Estados() {
  const [filterValue, setFilterValue] = useState("");
  const [newStatu, setNewStatu] = useState("");
  const [status, setStatus] = useState([]);
  const [editingStatuId, setEditingStatuId] = useState(null);
  const [updatedStatuName, setUpdatedStatuName] = useState("");

  const fetchStatus = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/status");
      if (response.ok) {
        const data = await response.json();
        setStatus(data.status);
      } else {
        console.error("Failed to fetch status");
      }
    } catch (error) {
      console.error("Error fetching status:", error);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleInputChange = (event) => {
    setNewStatu(event.target.value);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:5000/status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newStatu }),
      });
      if (response.ok) {
        setNewStatu("");
        fetchStatus();
      } else {
        console.error("Failed to add new statu");
      }
    } catch (error) {
      console.error("Error adding new statu:", error);
    }
  };

  const handleDeleteStatu = async (statuId) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/status/${statuId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchStatus();
      } else {
        console.error("Failed to delete statu");
      }
    } catch (error) {
      console.error("Error deleting statu:", error);
    }
  };

  const handleEditStatu = (statuId, statuName) => {
    setEditingStatuId(statuId);
    setUpdatedStatuName(statuName);
  };

  const handleUpdateStatu = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/status/${editingStatuId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: updatedStatuName }),
        }
      );
      if (response.ok) {
        setEditingStatuId(null);
        fetchStatus();
      } else {
        console.error("Failed to update statu");
      }
    } catch (error) {
      console.error("Error updating statu:", error);
    }
  };

  const onSearchChange = (event) => {
    setFilterValue(event.target.value);
  };

  return (
    <div>
      <div className="flex justify-between items-end mb-4">
        <Input
          isClearable
          placeholder="Search by statu..."
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
              key="theme"
              className="cursor-auto text-black"
            >
              <Input
                type="text"
                variant="bordered"
                placeholder="Ingrese un nuevo tema..."
                value={newStatu}
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
        aria-label="Status Table"
        isCompact
        removeWrapper
        bottomContentPlacement="outside"
        topContentPlacement="outside"
        emptyContent="No status found"
      >
        <TableHeader>
          <TableColumn>ID</TableColumn>
          <TableColumn>Nombre</TableColumn>
          <TableColumn>Acciones</TableColumn>
        </TableHeader>
        <TableBody>
          {status.map((statu) => (
            <TableRow key={statu.id}>
              <TableCell className="text-black">{statu.id}</TableCell>
              <TableCell className="text-black">
                {editingStatuId === statu.id ? (
                  <Input
                    type="text"
                    value={updatedStatuName}
                    onChange={(e) => setUpdatedStatuName(e.target.value)}
                  />
                ) : (
                  statu.name
                )}
              </TableCell>
              <TableCell>
                {editingStatuId === statu.id ? (
                  <Button onClick={handleUpdateStatu}>Actualizar</Button>
                ) : (
                  <div className="relative flex items-center gap-2">
                    <span
                      className="text-lg cursor-pointer active:opacity-50 text-sky-800"
                      onClick={() => handleEditStatu(statu.id, statu.name)}
                    >
                      <EditIcon />
                    </span>
                    <span
                      className="text-lg text-danger cursor-pointer active:opacity-50"
                      onClick={() => handleDeleteStatu(statu.id)}
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
    </div>
  );
}
