"use client";

import { Navbaruser } from "../../components/NavBar/Navbaruser";
import { ProtectedLayout } from "../../components/ProtectedLayout";
import { UserExpiration } from "components/UserExpiration/UserExpiration";

export default function Home() {
  return (
    <>
      <ProtectedLayout>
        <UserExpiration />
      </ProtectedLayout>
    </>
  );
}
