import React, { useState } from "react";
import axios from "axios";
import { Input } from "@nextui-org/react";
import { EyeFilledIcon } from "../login/EyeFilledIcon";
import { EyeSlashFilledIcon } from "../login/EyeSlashFilledIcon";

export function TerceroForm() {
  const [isVisible, setIsVisible] = React.useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [foundTercero, setFoundTercero] = useState(null);

  const searchTercero = async () => {
    try {
      let response;
      if (name) {
        response = await axios.get(
          `http://127.0.0.1:5000/terceros/name/${name}`
        );
      } else if (email) {
        response = await axios.get(
          `http://127.0.0.1:5000/terceros/email/${email}`
        );
      } else {
        setError("Please enter at least one search criteria");
        return;
      }

      setFoundTercero(response.data);
      setName(response.data.name);
      setEmail(response.data.email);
      setSuccessMessage("");
      setError("");
    } catch (error) {
      setError("Tercero not found");
      setFoundTercero(null);
      setName("");
      setEmail("");
    }
  };

  const deleteTercero = async () => {
    try {
      if (foundTercero) {
        await axios.delete(`http://127.0.0.1:5000/terceros/${foundTercero.id}`);
        setSuccessMessage("Tercero deleted successfully");
        setFoundTercero(null);
        setName("");
        setEmail("");
        setError("");
      } else {
        setError("No Tercero found");
      }
    } catch (error) {
      setError("There was a problem deleting the Tercero");
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      const terceroData = {
        name,
        email,
      };

      if (foundTercero) {
        const response = await axios.put(
          `http://127.0.0.1:5000/terceros/${foundTercero.id}`,
          terceroData
        );
        setSuccessMessage("Tercero updated successfully!");
        setError("");
        console.log(response.data.message);
      } else {
        const response = await axios.post(
          "http://127.0.0.1:5000/terceros",
          terceroData
        );
        setSuccessMessage("Tercero registered successfully!");
        setError("");
        console.log(response.data.message);
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setError("Tercero already exists");
      } else {
        setError("There was a problem processing your request");
      }
      setSuccessMessage("");
    }
  };

  const clearFields = () => {
    setName("");
    setEmail("");
    setFoundTercero(null);
    setError("");
    setSuccessMessage("");
  };

  return (
    <div className="flex justify-center items-center text-black py-10">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Tercero Form</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        {successMessage && (
          <div className="text-green-500 mb-4">{successMessage}</div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block font-bold mb-2">
              Name:
            </label>
            <Input
              type="text"
              label="Name"
              variant="bordered"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="max-w-xs text-black"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block font-bold mb-2">
              Email:
            </label>
            <Input
              value={email}
              type="email"
              label="Email"
              variant="bordered"
              onChange={(e) => setEmail(e.target.value)}
              className="max-w-xs text-black"
            />
          </div>
          <button
            type="submit"
            className="bg-[#4a53a0] text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
          >
            {foundTercero ? "Update" : "Register"}
          </button>
          <button
            type="button"
            className="bg-[#4a53a0] text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors ml-2"
            onClick={searchTercero}
          >
            Search
          </button>
          <button
            type="button"
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors ml-2"
            onClick={deleteTercero}
            disabled={!foundTercero}
          >
            Delete
          </button>
          <button
            type="button"
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors ml-2"
            onClick={clearFields}
          >
            Clear
          </button>
        </form>
      </div>
    </div>
  );
}
