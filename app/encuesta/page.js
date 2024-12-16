// pages/home.js
import React, { useEffect, useState } from "react";
import Encuesta from "../../components/Encuesta/Encuesta";

export default function Home() {
  const [id, setId] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const idFromSearch = params.get("id");
    setId(idFromSearch);
  }, []);

  if (!id) return <div>Loading...</div>; // or show a loading spinner

  return (
    <div>
      <Encuesta id={id} />
    </div>
  );
}
