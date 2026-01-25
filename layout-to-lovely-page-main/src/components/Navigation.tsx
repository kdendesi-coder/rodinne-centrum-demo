import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, username, logout } = useAuth();
  const navigate = useNavigate();

  //pridane ---------------------------
  // // Add this useEffect to force state synchronization
  // const [forceUpdate, setForceUpdate] = useState(0);
  
  // useEffect(() => {
  //   console.log('Auth state changed in Navigation:', { isAuthenticated, username });
  //   // This will force a re-render when auth state changes
  //   setForceUpdate(prev => prev + 1);
  // }, [isAuthenticated, username]);
  //pridane ---------------------------

  const navLinks = [
    { label: "O firme", href: "#about" },
    { label: "Ľudia", href: "#team" },
    { label: "Aktivity", href: "#activities" },
    { label: "Galéria", href: "#gallery" },
    { label: "Kontakt", href: "#contact" },
  ];

  const handleAuthClick = () => {
    if (isAuthenticated) {
      logout();
      navigate("/");
    } else {
      navigate("/login");
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="#" className="text-2xl font-bold text-foreground">
              Logo
            </a>
            {isAuthenticated && username && (
              <span className="text-sm font-medium text-muted-foreground">
                {username}
              </span>
            )}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </a>
            ))}
            <Button variant="default" size="sm" onClick={handleAuthClick}>
              {isAuthenticated ? "Odhlásiť sa" : "Prihlásiť sa"}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X /> : <Menu />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pt-4 pb-2 animate-fade-in">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <Button 
              variant="default" 
              size="sm" 
              className="mt-2 w-full"
              onClick={() => {
                handleAuthClick();
                setIsOpen(false);
              }}
            >
              {isAuthenticated ? "Odhlásiť sa" : "Prihlásiť sa"}
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
