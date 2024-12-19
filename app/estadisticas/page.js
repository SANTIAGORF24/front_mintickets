"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Navbaruser } from "../../components/NavBar/Navbaruser";
import Statistics from "../../components/Statistics/Statistics";
import { ProtectedLayout } from "../../components/ProtectedLayout";

export default function Home() {
  const [ticketsData, setTicketsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filterValue, setFilterValue] = useState("");

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/tickets/`)
      .then((response) => {
        setTicketsData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);

  const filterTickets = (tickets) => {
    const filteredTickets = tickets.filter((ticket) => {
      const ticketDate = new Date(ticket.fecha_creacion);
      const matchesStartDate =
        !startDate ||
        ticketDate >= new Date(startDate.toISOString().split("T")[0]);
      const matchesEndDate =
        !endDate || ticketDate <= new Date(endDate.toISOString().split("T")[0]);
      const matchesFilterValue =
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

      return matchesStartDate && matchesEndDate && matchesFilterValue;
    });

    return filteredTickets;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <ProtectedLayout>
      <Navbaruser />
      <div className="w-full flex items-center justify-center pt-10">
        <div className="flex justify-between items-center gap-3 mb-4 text-black w-5/6">
          <input
            className="w-[44%] p-2 border border-gray-300 rounded"
            placeholder="Search..."
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
          />
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            placeholderText="Fecha de inicio"
            className="rounded-md border border-gray-300 p-2 text-black"
            dateFormat="yyyy-MM-dd"
            calendarClassName="rasta-stripes"
          />
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            placeholderText="Fecha de fin"
            className="rounded-md border border-gray-300 p-2 text-black"
            dateFormat="yyyy-MM-dd"
            calendarClassName="rasta-stripes"
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => {
              setStartDate(null);
              setEndDate(null);
              setFilterValue("");
            }}
          >
            Limpiar filtros
          </button>
        </div>
      </div>
      <Statistics ticketsData={filterTickets(ticketsData)} />
    </ProtectedLayout>
  );
}
