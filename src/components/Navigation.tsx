import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, username } = useAuth();

  const navLinks = [
    { label: "O Nas", href: "/#about" },
    { label: "Aktivity", href: "/#activities",
      dropdown: [
        { label: "Herňa", href: "/aktivita/herna"},
        { label: "Átrium", href: "/aktivita/atrium"},
        { label: "Klubík", href: "/aktivita/klubik"},
      ]
     },
    
    { label: "Galéria", href: "/#gallery" },
    { label: "Náš tím", href: "/#team" },
    { label: "Kontakt", href: "/#contact" },
  ];

 return (
    <nav className="fixed top-3 left-0 w-full z-50 px-2 sm:px-4">
      <div className="w-full max-w-[1800px] mx-auto bg-[#DEE2D2]
                      rounded-2xl
                      shadow-md
                      border border-black/5">

        <div className="px-4 sm:px-6 py-3 md:py-4">
          <div className="flex items-center justify-between gap-4">

            {/* Logo + username */}
            <div className="flex items-center gap-3 min-w-0">
              <a href="#" className="flex items-center gap-2 min-w-0">
                <img
                  src="/logosirotar2BG.png"
                  alt="Company Logo"
                  className="h-8 md:h-10 w-auto object-contain shrink-0"
                />
                <span className="text-base sm:text-lg text-[#5E7322] uppercase truncate">RC Sirotár</span>
              </a>

              {isAuthenticated && username && (
                <span className="hidden sm:inline text-sm font-medium text-gray-700 truncate">
                  {username}
                </span>
              )}
            </div>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-4 lg:gap-6">
              {navLinks.map((link) => (
                <div key={link.label} className="relative group">
                  <a
                    href={link.href}
                    className="flex items-center gap-1 text-base lg:text-lg font-medium text-gray-800 hover:text-[#5E7322] transition-colors duration-200 whitespace-nowrap"
                  > 

                    {link.label}
                    {link.dropdown && (
                      <img 
                        src="down-arrow.jpg"
                        alt="down-arrow"
                        className="w-5 h-5 transition-transform duration-200 group-hover:rotate-180"
                        />
                    )}  
                  </a>
                  
                  {/* Dropdown menu */}
                  {link.dropdown && (
                    <div className="absolute left-0 top-full mt-2 w-40 bg-[#DEE2D2] rounded-2xl shadow-lg
                                    opacity-0 invisible
                                    group-hover:opacity-100 group-hover:visible
                                    transition-all duration-200 overflow-hidden">

                      {link.dropdown.map((item) => (
                        <a 
                          key={item.href}
                          href={item.href}
                          className="block px-4 py-3 text-base text-gray-700 hover:text-[#5E7322]"
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
              className="md:hidden shrink-0"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X /> : <Menu />}
            </Button>
          </div>

          {/* Mobile nav */}
          {isOpen && (
            <div className="md:hidden pt-4 pb-2 animate-fade-in">
              {navLinks.map((link) => (
                <div key={link.label}>
                  <a
                    href={link.href}
                    className="block py-3 text-base font-medium text-gray-800 hover:text-[#5E7322] transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </a>

                  {link.dropdown && (
                    <div className="pl-4 pb-2">
                      {link.dropdown.map((item) => (
                        <a
                          key={item.href}
                          href={item.href}
                          className="block py-2 text-base text-gray-600 hover:text-[#5E7322]"
                          onClick={() => setIsOpen(false)}
                        >
                          {item.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;