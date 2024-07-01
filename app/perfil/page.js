"use client";
import { Navbaruser } from "../../components/NavBar/Navbaruser";
import { UserProfileDetails } from "../../components/UserProfileDetails/UserProfileDetails";
export default function Home() {
  return (
    <>
      <Navbaruser />
      <UserProfileDetails />
    </>
  );
}
