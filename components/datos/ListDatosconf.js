import React from "react";
import { Accordion, AccordionItem } from "@nextui-org/react";
import { Temas } from "./Temas";
import { Estados } from "./Estados";
import { TerceroForm } from "./TerceroForm";
import { SpecialistForm } from "./SpecialistForm";

export function ListDatosconf() {
  return (
    <div className="flex justify-center h-screen py-20">
      <div className="w-4/5">
        <Accordion variant="splitted">
          <AccordionItem key="1" aria-label="Temas" title="Temas">
            <Temas />
          </AccordionItem>
          <AccordionItem key="2" aria-label="Estados" title="Estados">
            <Estados />
          </AccordionItem>
          <AccordionItem key="3" aria-label="Terceros" title="Terceros">
            <TerceroForm />
          </AccordionItem>
          <AccordionItem key="4" aria-label="Usuarios" title="Usuarios">
            <SpecialistForm />
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
