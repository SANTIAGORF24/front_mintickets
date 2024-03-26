"use client";
import { Tickets } from "@/components/ticket/Tickets";
import { Navbaruser } from "@/components/NavBar/Navbaruser";
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
