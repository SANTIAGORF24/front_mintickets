"use client";

import { Navbaruser } from "../../components/NavBar/Navbaruser";
import { Todostickets } from "../../components/Todos/Todostickets";
import { ProtectedLayout } from "../../components/ProtectedLayout";

export default function Home() {
  return (
    <ProtectedLayout>
      <Navbaruser />
      <div className="px-20 flex items-center justify-center py-20">
        <Todostickets />
      </div>
    </ProtectedLayout>
  );
}
