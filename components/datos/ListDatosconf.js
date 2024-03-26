import React from "react";
import { Accordion, AccordionItem } from "@nextui-org/react";
import { Register } from "../registro/Register";
import { Temas } from "./Temas";

export function ListDatosconf() {
  const defaultContent =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

  return (
    <div className="flex justify-center h-screen py-20">
      <div className="w-4/5">
        <Accordion variant="splitted">
          <AccordionItem key="1" aria-label="Temas" title="Temas">
            <Temas />
          </AccordionItem>

          <AccordionItem
            key="3"
            aria-label="Nuevo usuario"
            title="Nuevo usuario"
          >
            <Register />
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
