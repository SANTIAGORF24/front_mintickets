import React, { useState, useEffect } from "react";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";

export function Estadoticket() {
  const [statuses, setStatuses] = useState([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/status/`) // Ruta para obtener los estados desde tu aplicación Flask
      .then((response) => response.json())
      .then((data) => {
        setStatuses(data.status);
      })
      .catch((error) => {
        console.error("Error fetching statuses:", error);
      });
  }, []);

  return (
    <div className="max-w-xs">
      <Autocomplete
        defaultItems={statuses}
        label="Estado del ticket"
        placeholder="Selecciona un estado del ticket"
        className=""
      >
        {(status) => (
          <AutocompleteItem className="text-black" key={status.id}>
            {status.name}
          </AutocompleteItem>
        )}
      </Autocomplete>
    </div>
  );
}
