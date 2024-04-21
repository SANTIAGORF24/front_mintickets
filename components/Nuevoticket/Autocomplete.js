import React, { useState, useEffect } from "react";

const Autocomplete = ({ items, label, placeholder, onSelect }) => {
  const [filteredItems, setFilteredItems] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isRotated, setIsRotated] = useState(false);

  useEffect(() => {
    setFilteredItems(items);
  }, [items]);

  const handleInputChange = (event) => {
    const value = event.target.value;
    setInputValue(value);
    const filtered = items.filter((item) =>
      item.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredItems(filtered);
  };

  const handleItemClick = (item) => {
    setInputValue(item.name);
    onSelect(item);
    setIsOpen(false);
    setIsRotated(true); // Rotating the SVG
    setTimeout(() => setIsRotated(false), 500); // Reset rotation after 500ms
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    setIsRotated(!isRotated);
  };

  return (
    <div className="max-w-xs relative">
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
        className="w-full p-2 border border-gray-300 text-black rounded-lg bg-slate-100"
      />
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 ${isRotated ? "rotate-180" : ""}`} // Adding rotation class dynamically
          viewBox="0 0 20 20"
          fill="#4a53a0" // Changing SVG color to #4a53a0
          onClick={toggleDropdown}
          style={{
            cursor: "pointer",
            transition: "transform 0.3s ease-in-out",
          }} // Adding transition for rotation
        >
          <path
            fillRule="evenodd"
            d="M10 3a1 1 0 00-.707.293l-7 7a1 1 0 101.414 1.414L10 5.414l6.293 6.293a1 1 0 101.414-1.414l-7-7A1 1 0 0010 3z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      {isOpen && (
        <ul className="absolute left-0 z-10 w-full bg-slate-100 border border-gray-300 rounded mt-1 transition-opacity duration-300 ease-in-out opacity-100">
          {filteredItems.map((item) => (
            <li
              key={item.id}
              className="p-2 cursor-pointer hover:bg-gray-200 text-black"
              onClick={() => handleItemClick(item)}
            >
              {item.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Autocomplete;
