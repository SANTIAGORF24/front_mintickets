"use client";

import { Navbaruser } from "../../components/NavBar/Navbaruser";
import { Tickets } from "../../components/ticket/Tickets";
import { ProtectedLayout } from "../../components/ProtectedLayout";
export default function Home() {
  return (
    <>
      <ProtectedLayout>
        <h1>Esta es una página protegida</h1>
        <Navbaruser />
        <div className="px-20 flex items-center justify-center py-20">
          <Tickets />
        </div>
      </ProtectedLayout>
    </>
  );
}
