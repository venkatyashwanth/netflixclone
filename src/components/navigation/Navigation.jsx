"use client";
// import { useAuth } from "../contexts/Authcontext";
import { useAuth } from "../contexts/Authcontext";
import MobileNav from "./MobileNav";
import TabletNav from "./TabletNav";
import DesktopNav from "./DesktopNav";

export default function Navigation() {
  const { isAuthenticated } = useAuth();
  return (
    <>
      <MobileNav isAuthenticated={isAuthenticated} />
      <TabletNav isAuthenticated={isAuthenticated} />
      <DesktopNav isAuthenticated={isAuthenticated} />
    </>
  );
}
