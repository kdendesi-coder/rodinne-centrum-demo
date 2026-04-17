import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, username } = useAuth();

  const navLinks = [
    { label: "O firme", href: "#about" },
    { label: "Ľudia", href: "#team" },
    { label: "Aktivity", href: "#activities",
      dropdown: [
        { label: "Herňa", href: "/aktivita/herna"},
        { label: "Átrium", href: "/aktivita/atrium"},
        { label: "Klubík", href: "/aktivita/klubik"},
      ]
     },
    { label: "Galéria", href: "#gallery" },
    { label: "Kontakt", href: "#contact" },
  ];

  return (
    <nav className="fixed top-9 w-full z-50 justify-center px-4">
      <div className="w-full max-w-9xl mx-auto bg-[#DEE2D2]
                      rounded-2xl
                      shadow-md
                      border border-black/2">

        <div className="px-6 py-4">
          <div className="flex items-center justify-between">

            {/* Logo + username */}
            <div className="flex items-center gap-4">
              <a href="#" className="flex items-center">
                <img
                  src="/logosirotar2BG.png"
                  alt="Company Logo"
                  className="h-8 md:h-10 w-auto object-contain"
                />
                <span className="text-lg text-[#5E7322] uppercase">RC Sirotár</span>
              </a>

              {isAuthenticated && username && (
                <span className="text-sm font-medium text-gray-700">
                  {username}
                </span>
              )}
            </div>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <div key={link.label} className="relative group">
                  <a
                    href={link.href}
                    className="flex item-center gap-1 text-sm font-medium text-gray-800 hover:text-[#5E7322] transition-colors duration-200"
                  > 

                    {link.label}
                    {link.dropdown && (
                      <img 
                        src="https://rodinne-centrum-demo.vercel.app/icons/down-arrow.png"
                        alt="down-arrow"
                        className="w-5 h-5 transition-transform duration-200 group-hover:rotate-180"
                        />
                    )}  
                  </a>
                  
                  {/* Dropdown menu */}
                  {link.dropdown && (
                    <div className="absolute left-0 mt-2 w-40 bg-[#DEE2D2] rounded-2x1 shadow-lg
                                    opacity-0 invisible
                                    group-hover:opacity-100 group-hover:visible
                                    transition-all duration-200">

                      {link.dropdown.map((item) => (
                        <a 
                          key={item.href}
                          href={item.href}
                          className="block px-4 py-2 text-sm text-gray-700 hover:text-[#5E7322]"
                        >
                          {item.label}
                        </a>
                      ))} 
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X /> : <Menu />}
            </Button>
          </div>

          {/* Mobile nav */}
          {isOpen && (
            <div className="md:hidden pt-4 pb-2 animate-fade-in">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block py-2 text-sm font-medium text-gray-800 hover:text-black transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;