import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { APP_LOGO, APP_TITLE } from "@/const";
import { Menu, X, Settings } from "lucide-react";
import { useState } from "react";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: "Accueil", href: "/" },
    { label: "Services", href: "/services" },
    { label: "À propos", href: "/about" },
    { label: "Réalisations", href: "/projects" },
    { label: "Contact", href: "/contact" },
  ];

  const adminItem = { label: "Admin", href: "/admin", icon: Settings };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container flex items-center justify-between h-20">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 no-underline">
          <div className="flex items-center gap-2">
            {APP_LOGO && <img src={APP_LOGO} alt={APP_TITLE} className="h-10" />}
            <span className="font-bold text-xl text-primary hidden sm:inline">{APP_TITLE}</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button variant="ghost" className="text-foreground hover:text-primary">
                {item.label}
              </Button>
            </Link>
          ))}
          {/* Admin Link */}
          <Link href={adminItem.href}>
            <Button variant="ghost" className="text-foreground hover:text-primary flex items-center gap-2">
              <Settings size={18} />
              {adminItem.label}
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-border">
          <div className="container py-4 flex flex-col gap-2">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-foreground hover:text-primary"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Button>
              </Link>
            ))}
            {/* Admin Link Mobile */}
            <Link href={adminItem.href}>
              <Button
                variant="ghost"
                className="w-full justify-start text-foreground hover:text-primary flex items-center gap-2"
                onClick={() => setIsOpen(false)}
              >
                <Settings size={18} />
                {adminItem.label}
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
