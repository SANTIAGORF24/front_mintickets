import React, { useState, useEffect } from "react";
import { User, Mail, Search } from "lucide-react";

import "react-toastify/dist/ReactToastify.css";

// Custom Autocomplete Component for Terceros
const TerceroAutocomplete = ({ usuarios, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (searchTerm) {
      const filtered = usuarios
        .filter(
          (usuario) =>
            usuario.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            usuario.username.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .slice(0, 5);
      setFilteredUsers(filtered);
      setIsOpen(filtered.length > 0);
    } else {
      setFilteredUsers([]);
      setIsOpen(false);
    }
  }, [searchTerm, usuarios]);

  const handleSelect = (usuario) => {
    onSelect(usuario);
    setSearchTerm(usuario.fullName);

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
          placeholder="Buscar tercero"
          className="w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          onFocus={() => setIsOpen(filteredUsers.length > 0)}
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(filteredUsers.length > 0);
          }}
        />
      </div>
      {isOpen && (
        <ul
          className="absolute z-10 w-full bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {filteredUsers.map((usuario) => (
            <li
              key={usuario.username}
              onClick={(e) => {
                e.stopPropagation(); // Prevent event bubbling
                handleSelect(usuario);
              }}
              className="p-3 hover:bg-gray-100 cursor-pointer flex items-center"
            >
              <div>
                <p className="font-semibold">{usuario.fullName}</p>
                <p className="text-sm text-gray-500">{usuario.username}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TerceroAutocomplete;
