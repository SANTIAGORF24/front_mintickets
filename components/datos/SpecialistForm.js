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
import { DeleteIcon, EditIcon } from "../ticket/Iconsactions";

export function SpecialistForm() {
  const [filterValue, setFilterValue] = useState("");
  const [specialists, setSpecialists] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const fetchSpecialists = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/tercerosda/especialistas/`
      );
      if (response.ok) {
        const data = await response.json();
        // Filter specialists with state 260 or 307
        const filteredSpecialists = data.filter(
          (specialist) =>
            specialist.state === "260" || specialist.state === "307"
        );
        setSpecialists(filteredSpecialists);
      } else {
        console.error("Failed to fetch specialists");
      }
    } catch (error) {
      console.error("Error fetching specialists:", error);
    }
  };

  useEffect(() => {
    fetchSpecialists();
  }, []);

  const onSearchChange = (event) => {
    setFilterValue(event.target.value);
    setPage(1);
  };

  // Filter specialists based on search input
  const filteredSpecialists = specialists.filter((specialist) => {
    const fullName = specialist.fullName
      ? specialist.fullName.toLowerCase()
      : "";
    const email = specialist.email ? specialist.email.toLowerCase() : "";
    const department = specialist.department
      ? specialist.department.toLowerCase()
      : "";
    const filterText = filterValue.toLowerCase();

    return (
      fullName.includes(filterText) ||
      email.includes(filterText) ||
      department.includes(filterText)
    );
  });

  // Pagination logic
  const pages = Math.ceil(filteredSpecialists.length / rowsPerPage);
  const paginatedSpecialists = filteredSpecialists.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  return (
    <div>
      <div className="flex justify-between items-end mb-4">
        <Input
          isClearable
          placeholder="Search by name, email, or department..."
          size="sm"
          startContent={<SearchIcon />}
          value={filterValue}
          onChange={onSearchChange}
        />
      </div>
      <Table
        aria-label="Specialists Table"
        isCompact
        removeWrapper
        bottomContentPlacement="outside"
        topContentPlacement="outside"
        emptyContent="No specialists found"
      >
        <TableHeader>
          <TableColumn>Username</TableColumn>
          <TableColumn>Nombre</TableColumn>
          <TableColumn>Email</TableColumn>
          <TableColumn>Departamento</TableColumn>
          <TableColumn>Título</TableColumn>
          <TableColumn>Estado</TableColumn>
        </TableHeader>
        <TableBody>
          {paginatedSpecialists.map((specialist) => (
            <TableRow key={specialist.username}>
              <TableCell className="text-black">
                {specialist.username}
              </TableCell>
              <TableCell className="text-black">
                {specialist.fullName}
              </TableCell>
              <TableCell className="text-black">{specialist.email}</TableCell>
              <TableCell className="text-black">
                {specialist.department}
              </TableCell>
              <TableCell className="text-black">{specialist.title}</TableCell>
              <TableCell className="text-black">{specialist.state}</TableCell>
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
          <option value={20}>20</option>
        </select>
      </div>
    </div>
  );
}
