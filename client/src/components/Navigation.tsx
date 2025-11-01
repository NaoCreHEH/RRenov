import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Settings,
  Menu,
} from "lucide-react";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: "Accueil", href: "/" },
    { label: "Services", href: "/services" },
    { label: "Réalisations", href: "/realisations" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <nav className="flex items-center justify-between p-4 border-b border-border bg-background">
      <div className="flex items-center space-x-4">
        <Link href="/" className="text-xl font-semibold">
          RRénov
        </Link>
      </div>

      {/* --- MENU DESKTOP --- */}
      <div className="hidden md:flex items-center space-x-4">
        {navItems.map((item) => (
          <Button
            key={item.href}
            variant="ghost"
            asChild
            className="text-foreground hover:text-primary"
          >
            <Link href={item.href}>{item.label}</Link>
          </Button>
        ))}

        <Button
          variant="ghost"
          asChild
          className="text-foreground hover:text-primary flex items-center gap-2"
        >
          <Link href="/admin">
            <Settings size={18} />
            Admin
          </Link>
        </Button>
      </div>

      {/* --- MENU MOBILE --- */}
      <div className="md:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="p-4 space-y-2">
            {navItems.map((item) => (
              <Button
                key={item.href}
                variant="ghost"
                asChild
                className="w-full justify-start text-foreground hover:text-primary"
                onClick={() => setIsOpen(false)}
              >
                <Link href={item.href}>{item.label}</Link>
              </Button>
            ))}

            <Button
              variant="ghost"
              asChild
              className="w-full justify-start text-foreground hover:text-primary flex items-center gap-2"
              onClick={() => setIsOpen(false)}
            >
              <Link href="/admin">
                <Settings size={18} />
                Admin
              </Link>
            </Button>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
