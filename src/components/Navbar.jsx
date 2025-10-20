"use client";
import React, { useState } from "react";
import { developer, navLinks } from "../constants";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const NavItems = ({ setIsOpen }) => {
  const { status, data: session } = useSession();
  const router = useRouter();
  return (
    <ul className="nav-ul">
      {navLinks.map(({ id, href, name }) => (
        <li key={id} className="nav-li flex">
          <a
            className="nav-li_a w-full"
            onClick={() => {
              router.replace(href);
              setIsOpen(false);
            }}
          >
            {name}
          </a>
        </li>
      ))}
      {status === "authenticated" && (
        <li key={navLinks.length} className="nav-li">
          <a
            className="nav-li_a flex justify-between"
            onClick={() => {
              router.replace(`/profile`);
              setIsOpen(false);
            }}
          >
            <span className="sm:hidden block nav-li_a w-full">
              {session.user?.name ||
                `${session.user?.firstName} ${session.user?.lastName}`}
            </span>
            <img
              className="rounded-full w-8 h-8"
              src={session.user?.image}
              alt={session.user?.email}
            />
          </a>
        </li>
      )}
      {status === "loading" && (
        <li key={navLinks.length} className="nav-li">
          <a className="nav-li_a">Loading...</a>
        </li>
      )}
      {status === "unauthenticated" && (
        <li key={navLinks.length} className="nav-li">
          <a
            className="nav-li_a"
            onClick={() => {
              router.replace("/auth/login");
              setIsOpen(false);
            }}
          >
            Login
          </a>
        </li>
      )}
    </ul>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const toggleMenu = () => {
    setIsOpen((prevIsOpen) => !prevIsOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/90">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center py-5 mx-auto c-space">
          <a
            className="text-neutral-400 font-bold text-xl hover:text-white transition-colors cursor-pointer"
            onClick={() => router.replace("/")}
          >
            {developer}
          </a>
          <button
            onClick={toggleMenu}
            className="text-neutral-400 hover:text-white focus:outline-none sm:hidden flex"
            aria-label="Toggle menu"
          >
            <img
              src={isOpen ? "/assets/close.svg" : "/assets/menu.svg"}
              alt="toggle"
              className="w-6 h-6"
            />
          </button>

          <nav className="sm:flex hidden">
            <NavItems setIsOpen={setIsOpen} />
          </nav>
        </div>
      </div>
      <div className={`nav-sidebar ${isOpen ? "max-h-screen" : "max-h-0"}`}>
        <nav className="p-5">
          <NavItems setIsOpen={setIsOpen} />
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
