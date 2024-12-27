"use client";
import { Navbaruser } from "../../components/NavBar/Navbaruser";
import DirectorioActivo from "../../components/ADUserEditor/DirectorioActivo";

export default function Home() {
  return (
    <>
      <Navbaruser />

      <div className="w-5/6 felx flex-col mx-auto">
        <DirectorioActivo />
      </div>
    </>
  );
}
