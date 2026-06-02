import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Home" },
  { to: "/memories", label: "Memories" },
  { to: "/scrapbook", label: "Scrapbook" },
  { to: "/games", label: "Games" },
  // { to: "/flowers", label: "Flowers" },
  { to: "/messages", label: "Messages" },
];

export const Navbar = () => {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 glass border-b border-primary/10">
      <nav className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 group">
          <Heart className="h-6 w-6 fill-primary text-primary group-hover:animate-pulse-soft" />
          <span className="font-script text-2xl text-gradient-rose font-bold">Forever Us</span>
        </Link>

        <ul className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <li key={l.to}>
              <Link
                to={l.to}
                className={cn(
                  "relative text-sm font-medium transition-colors hover:text-primary",
                  pathname === l.to ? "text-primary" : "text-foreground/70"
                )}
              >
                {l.label}
                {pathname === l.to && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-rose-grad rounded-full"
                  />
                )}
              </Link>
            </li>
          ))}
        </ul>

        <button
          className="md:hidden p-2 text-primary"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden border-t border-primary/10 glass"
          >
            <ul className="flex flex-col p-4 gap-3">
              {links.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "block py-2 px-3 rounded-lg transition-colors",
                      pathname === l.to ? "bg-secondary text-primary" : "hover:bg-secondary/50"
                    )}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
