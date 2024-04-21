import React, { useState, useEffect } from "react";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";

export function Tematicket() {
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/topics") // Ruta para obtener los temas desde tu aplicación Flask
      .then((response) => response.json())
      .then((data) => {
        setTopics(data.topics);
      })
      .catch((error) => {
        console.error("Error fetching topics:", error);
      });
  }, []);

  return (
    <div className="max-w-xs">
      <Autocomplete
        defaultItems={topics}
        label="Tema"
        placeholder="Seleccionar"
        className=""
      >
        {(topic) => (
          <AutocompleteItem className="text-black" key={topic.id}>
            {topic.name}
          </AutocompleteItem>
        )}
      </Autocomplete>
    </div>
  );
}
