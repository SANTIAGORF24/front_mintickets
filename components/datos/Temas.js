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

import { SearchIcon, EditIcon, DeleteIcon } from "../ticket/SearchIcon";
import { PlusIcon } from "../ticket/PlusIcon";

export function Temas() {
  const [filterValue, setFilterValue] = useState("");
  const [newTopic, setNewTopic] = useState("");
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      const response = await fetch("/topics");
      if (response.ok) {
        const data = await response.json();
        setTopics(data.topics);
      } else {
        console.error("Failed to fetch topics");
      }
    } catch (error) {
      console.error("Error fetching topics:", error);
    }
  };

  const handleInputChange = (event) => {
    setNewTopic(event.target.value);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:5000/topics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newTopic }),
      });
      if (response.ok) {
        setNewTopic(""); // Clear input after successful submission
        fetchTopics(); // Refresh topics list
      } else {
        console.error("Failed to add new topic");
      }
    } catch (error) {
      console.error("Error adding new topic:", error);
    }
  };

  const onSearchChange = (value) => {
    setFilterValue(value);
  };

  return (
    <div>
      <div className="flex justify-between items-end mb-4">
        <Input
          isClearable
          placeholder="Search by topic..."
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
                value={newTopic}
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
        aria-label="Topics Table"
        isCompact
        removeWrapper
        bottomContentPlacement="outside"
        topContentPlacement="outside"
        emptyContent="No topics found"
      >
        <TableHeader>
          <TableColumn>ID</TableColumn>
          <TableColumn>Nombre</TableColumn>
          <TableColumn>Acciones</TableColumn>
        </TableHeader>
        <TableBody items={topics}>
          {(topic) => (
            <TableRow key={topic.id}>
              <TableCell>{topic.id}</TableCell>
              <TableCell>{topic.name}</TableCell>
              <TableCell>
                <div className="relative flex items-center gap-2">
                  <span className="text-lg cursor-pointer active:opacity-50 text-black">
                    <EyeIcon />
                  </span>
                  <span className="text-lg cursor-pointer active:opacity-50 text-blue-600">
                    <EditIcon />
                  </span>
                  <span className="text-lg text-danger cursor-pointer active:opacity-50">
                    <DeleteIcon />
                  </span>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
