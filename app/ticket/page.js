"use client";

import { Navbaruser } from "../../components/NavBar/Navbaruser";
import { Tickets } from "../../components/ticket/Tickets";
import { ProtectedLayout } from "../../components/ProtectedLayout";
export default function Home() {
  return (
    <>
      <ProtectedLayout>
        <Navbaruser />
        <div className="px-20 flex items-center justify-center py-20">
          <Tickets />
        </div>
      </ProtectedLayout>
    </>
  );
}
