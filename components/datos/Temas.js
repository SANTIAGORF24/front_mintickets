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

export function Temas() {
  const [filterValue, setFilterValue] = useState("");
  const [newTopic, setNewTopic] = useState("");
  const [topics, setTopics] = useState([]);
  const [editingTopicId, setEditingTopicId] = useState(null);
  const [updatedTopicName, setUpdatedTopicName] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const fetchTopics = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/topics/`
      );
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

  useEffect(() => {
    fetchTopics();
  }, []);

  const handleInputChange = (event) => {
    setNewTopic(event.target.value);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/topics/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: newTopic }),
        }
      );
      if (response.ok) {
        setNewTopic("");
        fetchTopics();
      } else {
        console.error("Failed to add new topic");
      }
    } catch (error) {
      console.error("Error adding new topic:", error);
    }
  };

  const handleDeleteTopic = async (topicId) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/topics/${topicId}/`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        fetchTopics();
      } else {
        console.error("Failed to delete topic");
      }
    } catch (error) {
      console.error("Error deleting topic:", error);
    }
  };

  const handleEditTopic = (topicId, topicName) => {
    setEditingTopicId(topicId);
    setUpdatedTopicName(topicName);
  };

  const handleUpdateTopic = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/topics/${editingTopicId}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: updatedTopicName }),
        }
      );
      if (response.ok) {
        setEditingTopicId(null);
        fetchTopics();
      } else {
        console.error("Failed to update topic");
      }
    } catch (error) {
      console.error("Error updating topic:", error);
    }
  };

  const onSearchChange = (event) => {
    setFilterValue(event.target.value);
    setPage(1);
  };

  const filteredTopics = topics.filter((topic) =>
    topic.name.toLowerCase().includes(filterValue.toLowerCase())
  );

  const pages = Math.ceil(filteredTopics.length / rowsPerPage);
  const paginatedTopics = filteredTopics.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

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
        <TableBody>
          {paginatedTopics.map((topic) => (
            <TableRow key={topic.id}>
              <TableCell className="text-black">{topic.id}</TableCell>
              <TableCell className="text-black">
                {editingTopicId === topic.id ? (
                  <Input
                    type="text"
                    value={updatedTopicName}
                    onChange={(e) => setUpdatedTopicName(e.target.value)}
                  />
                ) : (
                  topic.name
                )}
              </TableCell>
              <TableCell>
                {editingTopicId === topic.id ? (
                  <Button onClick={handleUpdateTopic}>Actualizar</Button>
                ) : (
                  <div className="relative flex items-center gap-2">
                    <span
                      className="text-lg cursor-pointer active:opacity-50 text-sky-800"
                      onClick={() => handleEditTopic(topic.id, topic.name)}
                    >
                      <EditIcon />
                    </span>
                    <span
                      className="text-lg text-danger cursor-pointer active:opacity-50"
                      onClick={() => handleDeleteTopic(topic.id)}
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
