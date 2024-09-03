import React, { useState, useEffect } from "react";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";

export function Terceroticket() {
  const [terceros, setTerceros] = useState([]);

  useEffect(() => {
    fetch("https://backend-mintickets.vercel.app/terceros") // Ruta para obtener los terceros desde tu aplicación Flask
      .then((response) => response.json())
      .then((data) => {
        setTerceros(data.terceros);
      })
      .catch((error) => {
        console.error("Error fetching terceros:", error);
      });
  }, []);

  return (
    <div className="max-w-xs">
      <Autocomplete
        defaultItems={terceros}
        label="Seleccionar Tercero"
        placeholder="Seleccionar"
        className=""
      >
        {(tercero) => (
          <AutocompleteItem className="text-black" key={tercero.id}>
            {tercero.name}
          </AutocompleteItem>
        )}
      </Autocomplete>
    </div>
  );
}
