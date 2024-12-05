import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, CircularProgress } from "@nextui-org/react";
import { User, Mail, Search } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TerceroAutocomplete from "./TerceroAutocomplete";

// Custom Autocomplete Component for Specialists
const SpecialistAutocomplete = ({ onSelect }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [specialists, setSpecialists] = useState([]);
  const [filteredSpecialists, setFilteredSpecialists] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchSpecialists = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/tercerosda/especialistas`
        );
        setSpecialists(response.data);
      } catch (error) {
        console.error("Error fetching specialists:", error);
        toast.error("Error al cargar especialistas");
      }
    };

    fetchSpecialists();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = specialists
        .filter(
          (specialist) =>
            specialist.fullName
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            specialist.username.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .slice(0, 5);
      setFilteredSpecialists(filtered);
      setIsOpen(filtered.length > 0);
    } else {
      setFilteredSpecialists([]);
      setIsOpen(false);
    }
  }, [searchTerm, specialists]);

  const handleSelect = (specialist) => {
    onSelect(specialist);
    setSearchTerm(specialist.fullName);

    // Use setTimeout to ensure the dropdown closes immediately
    setTimeout(() => {
      setIsOpen(false);
    }, 0);
  };

  return (
    <div className="relative w-full" onClick={(e) => e.stopPropagation()}>
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={20}
        />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar especialista"
          className="w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          onFocus={() => setIsOpen(filteredSpecialists.length > 0)}
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(filteredSpecialists.length > 0);
          }}
        />
      </div>
      {isOpen && (
        <ul
          className="absolute z-10 w-full bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {filteredSpecialists.map((specialist) => (
            <li
              key={specialist.username}
              onClick={(e) => {
                e.stopPropagation(); // Prevent event bubbling
                handleSelect(specialist);
              }}
              className="p-3 hover:bg-gray-100 cursor-pointer flex items-center"
            >
              <div>
                <p className="font-semibold">{specialist.fullName}</p>
                <p className="text-sm text-gray-500">
                  {specialist.username} - {specialist.department}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SpecialistAutocomplete;
