// pages/home.js
import React from "react";
import Encuesta from "../../components/Encuesta/Encuesta";

export default function Home({ searchParams }) {
  const { id } = searchParams;

  return (
    <div>
      <Encuesta id={id} />
    </div>
  );
}
