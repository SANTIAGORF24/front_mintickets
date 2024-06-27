"use client";

import { Navbaruser } from "../../components/NavBar/Navbaruser";
import { Todostickets } from "../../components/Todos/Todostickets";
export default function Home() {
  return (
    <>
      <Navbaruser />
      <div className="px-20 flex items-center justify-center py-20">
        <Todostickets />
      </div>
    </>
  );
}
