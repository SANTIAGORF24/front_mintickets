"use client";

import { Navbaruser } from "../../components/NavBar/Navbaruser";
import { UserProfileDetails } from "../../components/UserProfileDetails/UserProfileDetails";
import { ProtectedLayout } from "../../components/ProtectedLayout";

export default function Home() {
  return (
    <ProtectedLayout>
      <Navbaruser />
      <UserProfileDetails />
    </ProtectedLayout>
  );
}
