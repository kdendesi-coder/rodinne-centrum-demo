import { Facebook, Instagram, Mail, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Footer = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const navLinks = [
    { label: "O firme", href: "#about" },
    { label: "Ľudia", href: "#team" },
    { label: "Aktivity", href: "#activities" },
    { label: "Galéria", href: "#gallery" },
    { label: "Kontakt", href: "#contact" },
  ];

  const legalLinks = [
    { label: "Copyright", href: "#" },
    { label: "Podmienky", href: "#" },
    { label: "GDPR", href: "#" },
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
    <footer className="bg-foreground text-background py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Left side - Logo and Navigation */}
          <div>
            <a href="#" className="text-2xl font-bold mb-6 inline-block">
              Logo
            </a>
            <nav className="flex flex-wrap gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm hover:text-primary transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <button
                onClick={handleAuthClick}
                className="text-sm hover:text-primary transition-colors"
              >
                {isAuthenticated ? "Odhlásiť sa" : "Vstup pre administrátora"}
              </button>
            </nav>
          </div>

          {/* Right side - Social Icons */}
          <div className="flex items-start justify-end gap-4">
            <a
              href="#"
              className="w-10 h-10 bg-background/10 hover:bg-background/20 rounded-lg flex items-center justify-center transition-colors"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="w-10 h-10 bg-background/10 hover:bg-background/20 rounded-lg flex items-center justify-center transition-colors"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="w-10 h-10 bg-background/10 hover:bg-background/20 rounded-lg flex items-center justify-center transition-colors"
            >
              <Mail className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="w-10 h-10 bg-background/10 hover:bg-background/20 rounded-lg flex items-center justify-center transition-colors"
            >
              <Phone className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Bottom - Legal Links */}
        <div className="pt-8 border-t border-background/10">
          <div className="flex flex-wrap gap-6 text-sm text-background/70">
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
