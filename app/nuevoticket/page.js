"use client";

import { Navbaruser } from "../../components/NavBar/Navbaruser";
import { Nuevoticket } from "../../components/Nuevoticket/Nuevoticket";
import { ProtectedLayout } from "../../components/ProtectedLayout";

export default function Home() {
  return (
    <ProtectedLayout>
      <Navbaruser />
      <Nuevoticket />
    </ProtectedLayout>
  );
}
