import React from "react";

const columns = [
  { name: "ID", uid: "id", sortable: true },
  { name: "TERCERO", uid: "name", sortable: true },
  { name: "FECHA", uid: "date", sortable: true },
  { name: "TEMA", uid: "topic", sortable: true },
  { name: "ESPECIALISTA", uid: "specialist", sortable: true },
  { name: "EMAIL", uid: "email" },
  { name: "ESTADO", uid: "status", sortable: true },
  { name: "ACCIONES", uid: "actions" },
];

const statusOptions = [
  { name: "Creado", uid: "creado" },
  { name: "En proceso", uid: "en proceso" },
  { name: "Solucionado", uid: "solucionado" },
];

const users = [
  {
    id: 1,
    name: "Juan Pérez",
    date: "2024-03-26",
    topic: "GesDoc",
    specialist: "Ana Gómez",
    email: "juan.perez@example.com",
    status: "creado",
  },
  {
    id: 2,
    name: "María López",
    date: "2024-03-25",
    topic: "Red",
    specialist: "Carlos Ramírez",
    email: "maria.lopez@example.com",
    status: "En proceso",
  },
  {
    id: 3,
    name: "Pedro Gutiérrez",
    date: "2024-03-24",
    topic: "Insolución",
    specialist: "Laura Martínez",
    email: "pedro.gutierrez@example.com",
    status: "Solucionado",
  },
  {
    id: 4,
    name: "Ana Rodríguez",
    date: "2024-03-23",
    topic: "Impresoras",
    specialist: "Juan García",
    email: "ana.rodriguez@example.com",
    status: "creado",
  },
  {
    id: 5,
    name: "Luisa Fernández",
    date: "2024-03-22",
    topic: "GesDoc",
    specialist: "Pedro Sánchez",
    email: "luisa.fernandez@example.com",
    status: "En proceso",
  },
];

export { columns, users, statusOptions };
