import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  CircularProgress,
} from "@nextui-org/react";
import Autocomplete from "./Autocomplete";
import { EditIcon } from "./Iconsactions";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Search, Mail, User } from "react-feather";
import TerceroAutocomplete from "./TerceroAutocomplete";

const SpecialistAutocomplete = ({ onSelect, initialValue = null }) => {
  const [searchTerm, setSearchTerm] = useState(
    initialValue ? initialValue.fullName || initialValue.name : ""
  );
  const [specialists, setSpecialists] = useState([]);
  const [filteredSpecialists, setFilteredSpecialists] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSpecialist, setSelectedSpecialist] = useState(initialValue);

  useEffect(() => {
    const fetchSpecialists = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:5000/tercerosda/especialistas"
        );
        setSpecialists(response.data);

        // If initial value is provided, find and set it
        if (initialValue) {
          const matchedSpecialist = response.data.find(
            (s) => s.fullName === initialValue.name
          );
          if (matchedSpecialist) {
            setSelectedSpecialist(matchedSpecialist);
            setSearchTerm(matchedSpecialist.fullName);
          }
        }
      } catch (error) {
        console.error("Error fetching specialists:", error);
        toast.error("Error al cargar especialistas");
      }
    };

    fetchSpecialists();
  }, [initialValue]);

  useEffect(() => {
    if (searchTerm && !selectedSpecialist) {
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
  }, [searchTerm, specialists, selectedSpecialist]);

  const handleSelect = (specialist) => {
    setSelectedSpecialist(specialist);
    onSelect(specialist);
    setSearchTerm(specialist.fullName);
    setTimeout(() => {
      setIsOpen(false);
    }, 0);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setSelectedSpecialist(null);

    if (value === "") {
      onSelect(null);
    }
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
          onChange={handleInputChange}
          placeholder="Buscar especialista"
          className="w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          onFocus={() =>
            !selectedSpecialist && setIsOpen(filteredSpecialists.length > 0)
          }
          onClick={(e) => {
            e.stopPropagation();
            !selectedSpecialist && setIsOpen(filteredSpecialists.length > 0);
          }}
        />
      </div>
      {!selectedSpecialist && isOpen && (
        <ul
          className="absolute z-10 w-full bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {filteredSpecialists.map((specialist) => (
            <li
              key={specialist.username}
              onClick={(e) => {
                e.stopPropagation();
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
