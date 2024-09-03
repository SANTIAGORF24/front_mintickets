import React, { useState, useEffect } from "react";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";

export function Especialistaticket() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("https://backend-mintickets.vercel.app/auth/users/names") // Nueva ruta para obtener solo los nombres de usuario
      .then((response) => response.json())
      .then((data) => {
        setUsers(data.user_names);
      })
      .catch((error) => {
        console.error("Error fetching user names:", error);
      });
  }, []);

  return (
    <div className="max-w-xs">
      <Autocomplete
        defaultItems={users}
        label="Especialista"
        placeholder="Selecciona un Especialista"
        className="max-w-xs"
      >
        {(user) => (
          <AutocompleteItem className="text-black" key={user.id}>
            {user.name}
          </AutocompleteItem>
        )}
      </Autocomplete>
    </div>
  );
}
