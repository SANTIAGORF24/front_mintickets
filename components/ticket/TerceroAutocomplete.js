import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Search, Mail, User } from "react-feather";

const TerceroAutocomplete = ({ onSelect, initialValue = null }) => {
  const [searchTerm, setSearchTerm] = useState(
    initialValue ? initialValue.fullName || initialValue.name || "" : ""
  );
  const [terceros, setTerceros] = useState([]);
  const [filteredTerceros, setFilteredTerceros] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTercero, setSelectedTercero] = useState(initialValue);

  useEffect(() => {
    const fetchTerceros = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/tercerosda`
        );
        const tercerosData = response.data.terceros || response.data;

        const processedTerceros = tercerosData.map((tercero) => ({
          id: tercero.id || tercero.username,
          name: tercero.fullName || tercero.name || "",
          fullName: tercero.fullName || tercero.name || "",
          email: tercero.email || "",
          username: tercero.username || "",
        }));

        setTerceros(processedTerceros);

        // If initial value is provided, find and set it
        if (initialValue) {
          const matchedTercero = processedTerceros.find(
            (t) =>
              t.name === (initialValue.name || initialValue.fullName) ||
              t.fullName === (initialValue.name || initialValue.fullName)
          );
          if (matchedTercero) {
            setSelectedTercero(matchedTercero);
            setSearchTerm(matchedTercero.fullName);
          }
        }
      } catch (error) {
        console.error("Error fetching terceros:", error);
        toast.error("No se pudieron cargar los terceros");
        setTerceros([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTerceros();
  }, [initialValue]);

  useEffect(() => {
    if (searchTerm && !selectedTercero) {
      const filtered = terceros
        .filter((tercero) => {
          const fullName = tercero.fullName?.toLowerCase() || "";
          const username = tercero.username?.toLowerCase() || "";
          const searchTermLower = searchTerm.toLowerCase();

          return (
            fullName.includes(searchTermLower) ||
            username.includes(searchTermLower)
          );
        })
        .slice(0, 5);

      setFilteredTerceros(filtered);
      setIsOpen(filtered.length > 0);
    } else {
      setFilteredTerceros([]);
      setIsOpen(false);
    }
  }, [searchTerm, terceros, selectedTercero]);

  const handleSelect = (tercero) => {
    setSelectedTercero(tercero);
    onSelect(tercero);
    setSearchTerm(tercero.fullName || tercero.name || "");
    setTimeout(() => {
      setIsOpen(false);
    }, 0);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setSelectedTercero(null);

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
          placeholder="Buscar tercero"
          className="w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          onFocus={() =>
            !selectedTercero && setIsOpen(filteredTerceros.length > 0)
          }
          onClick={(e) => {
            e.stopPropagation();
            !selectedTercero && setIsOpen(filteredTerceros.length > 0);
          }}
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            Cargando...
          </div>
        )}
      </div>
      {!selectedTercero && isOpen && (
        <ul
          className="absolute z-10 w-full bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {filteredTerceros.map((tercero) => (
            <li
              key={tercero.id || tercero.username}
              onClick={(e) => {
                e.stopPropagation();
                handleSelect(tercero);
              }}
              className="p-3 hover:bg-gray-100 cursor-pointer flex items-center"
            >
              <div>
                <p className="font-semibold">
                  {tercero.fullName || tercero.name}
                </p>
                <p className="text-sm text-gray-500">{tercero.username}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TerceroAutocomplete;
