"use client";
import { Navbaruser } from "../../components/NavBar/Navbaruser";
import ADUserEditor from "../../components/ADUserEditor/ADUserEditor";

export default function Home() {
  return (
    <>
      <Navbaruser />

      <div className="w-5/6 felx flex-col mx-auto">
        <ADUserEditor />
      </div>
    </>
  );
}
