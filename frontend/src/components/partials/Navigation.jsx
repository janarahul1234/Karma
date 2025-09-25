import { NavLink } from "react-router-dom";
import { House, Target, Wallet } from "lucide-react";

import { cn } from "@/lib/utils";

const Links = [
  { label: "Home", icon: <House />, href: "/" },
  { label: "Goals", icon: <Target />, href: "/goals" },
  { label: "Finances", icon: <Wallet />, href: "/finances" },
];

export default function Navigation() {
  function activeLink({ isActive }) {
    return cn(
      "font-medium flex items-center justify-center gap-2 rounded-full transition",
      isActive
        ? "bg-primary/10 text-primary"
        : "text-muted-foreground hover:text-foreground"
    );
  }

  return (
    <nav className="w-full max-w-[480px] px-4 fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
      <div className="h-14 bg-card/70 backdrop-blur-lg grid grid-cols-3 p-1 border rounded-full shadow-xs">
        {Links.map(({ label, icon, href }) => (
          <NavLink key={href} to={href} className={activeLink}>
            {icon} <span className="hidden sm:block">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
