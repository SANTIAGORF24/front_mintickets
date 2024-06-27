"use client";

import { Navbaruser } from "../../components/NavBar/Navbaruser";
import { Tickets } from "../../components/ticket/Tickets";
export default function Home() {
  return (
    <>
      <Navbaruser />
      <div className="px-20 flex items-center justify-center py-20">
        <Tickets />
      </div>
    </>
  );
}
