import { Facebook, Instagram, Mail, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Footer = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const navLinks = [
    { label: "O firme", href: "/#about" },
    { label: "Ľudia", href: "/#team" },
    { label: "Aktivity", href: "/#activities" },
    { label: "Galéria", href: "/#gallery" },
    { label: "Kontakt", href: "/#contact" },
  ];

  const legalLinks = [
    { label: "Copyright", href: "/#" },
    { label: "Podmienky", href: "/#" },
    { label: "GDPR", href: "/#" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <footer className="bg-foreground text-background py-10 md:py-16 px-4">
      <div className="w-full max-w-[1800px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 mb-10 md:mb-12 items-start">
          
          {/* Left side - Logo and Navigation */}
          <div>
            <a href="#" className="flex items-center">
              <img
                src="/logosirotar2BG.png"
                alt="Company Logo"
                className="h-20 sm:h-20 md:h-24 w-auto object-contain"
              />
            </a>

            <nav className="mt-6 flex flex-wrap gap-x-6 gap-y-3 md:gap-x-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-base md:text-lg hover:text-primary transition-colors"
                >
                  {link.label}
                </a>
              ))}

              {isAuthenticated && (
                <button
                  onClick={handleLogout}
                  className="text-base md:text-lg hover:text-primary transition-colors"
                >
                  Odhlásiť sa
                </button>
              )}
            </nav>
          </div>

          {/* Right side - Social Icons */}
          <div className="flex items-center justify-start md:justify-end gap-3 sm:gap-4">
            <a
              href="/#"
              className="w-12 h-12 md:w-14 md:h-14 bg-background/10 hover:bg-background/20 rounded-xl flex items-center justify-center transition-colors"
            >
              <Facebook className="w-6 h-6 md:w-7 md:h-7" />
            </a>

            <a
              href="/#"
              className="w-12 h-12 md:w-14 md:h-14 bg-background/10 hover:bg-background/20 rounded-xl flex items-center justify-center transition-colors"
            >
              <Instagram className="w-6 h-6 md:w-7 md:h-7" />
            </a>

            <a
              href="/#"
              className="w-12 h-12 md:w-14 md:h-14 bg-background/10 hover:bg-background/20 rounded-xl flex items-center justify-center transition-colors"
            >
              <Mail className="w-6 h-6 md:w-7 md:h-7" />
            </a>

            <a
              href="/#"
              className="w-12 h-12 md:w-14 md:h-14 bg-background/10 hover:bg-background/20 rounded-xl flex items-center justify-center transition-colors"
            >
              <Phone className="w-6 h-6 md:w-7 md:h-7" />
            </a>
          </div>
        </div>

        {/* Bottom - Legal Links */}
        <div className="pt-8 md:pt-10 border-t border-background/10">
          <div className="flex flex-wrap gap-x-6 gap-y-3 md:gap-x-8 text-base md:text-lg text-background/70">
            {legalLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="hover:text-background transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;