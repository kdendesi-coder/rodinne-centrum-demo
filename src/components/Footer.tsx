import { useState } from "react";
import { Facebook, Instagram, Mail, Phone, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import EditModal from "./EditModal";
import { useAuth } from "@/contexts/AuthContext";
import { useParagraph } from "@/hooks/useParagraph";

const Footer = () => {
  const { isAuthenticated, role } = useAuth();
  const canEdit = isAuthenticated && role === "Admin";

  const { text: footerLogo, setText: setFooterLogo } =
    useParagraph("footer_logo_image");

  const { text: facebookUrl, setText: setFacebookUrl } =
    useParagraph("footer_facebook_url");

  const { text: instagramUrl, setText: setInstagramUrl } =
    useParagraph("footer_instagram_url");

  const { text: email, setText: setEmail } =
    useParagraph("footer_email");

  const { text: phone, setText: setPhone } =
    useParagraph("footer_phone");

  const { text: copyrightUrl, setText: setCopyrightUrl } =
    useParagraph("footer_copyright_url");

  const { text: termsUrl, setText: setTermsUrl } =
    useParagraph("footer_terms_url");

  const { text: gdprUrl, setText: setGdprUrl } =
    useParagraph("footer_gdpr_url");

  const [editingField, setEditingField] = useState<
    | "logo"
    | "facebook"
    | "instagram"
    | "email"
    | "phone"
    | "copyright"
    | "terms"
    | "gdpr"
    | null
  >(null);

  const logoSrc =
    footerLogo && footerLogo.startsWith("data:image")
      ? footerLogo
      : "/logosirotar2BG.png";

  const facebookHref = facebookUrl?.trim() || "/#";
  const instagramHref = instagramUrl?.trim() || "/#";
  const emailHref = email?.trim() ? `mailto:${email.trim()}` : "/#";
  const phoneHref = phone?.trim()
    ? `tel:${phone.replace(/\s+/g, "")}`
    : "/#";

  const navLinks = [
    { label: "O nás", href: "/#about" },
    { label: "Náš tím", href: "/#team" },
    { label: "Aktivity", href: "/#activities" },
    { label: "Galéria", href: "/#gallery" },
    { label: "Kontakt", href: "/#contact" },
  ];

  const legalLinks = [
    {
      label: "Copyright",
      href: copyrightUrl?.trim() || "/#",
      field: "copyright" as const,
    },
    {
      label: "Podmienky",
      href: termsUrl?.trim() || "/#",
      field: "terms" as const,
    },
    {
      label: "GDPR",
      href: gdprUrl?.trim() || "/#",
      field: "gdpr" as const,
    },
  ];

  return (
    <footer className="bg-foreground text-background py-10 md:py-16 px-4">
      <div className="w-full max-w-[1800px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 mb-10 md:mb-12 items-start">
          <div>
            <div className="relative group/logo inline-flex">
              <a href="/#" className="flex items-center">
                <img
                  src={logoSrc}
                  alt="Company Logo"
                  className="h-20 sm:h-20 md:h-24 w-auto object-contain"
                />
              </a>

              {canEdit && (
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute -top-2 -right-2 h-7 w-7 opacity-100 md:opacity-0 md:group-hover/logo:opacity-100 transition-opacity"
                  onClick={() => setEditingField("logo")}
                >
                  <Edit2 className="h-3 w-3" />
                </Button>
              )}
            </div>

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
            </nav>
          </div>

          <div className="flex items-center justify-start md:justify-end gap-3 sm:gap-4">
            <div className="relative group/social">
              <a
                href={facebookHref}
                target={facebookHref.startsWith("http") ? "_blank" : undefined}
                rel={facebookHref.startsWith("http") ? "noopener noreferrer" : undefined}
                className="w-12 h-12 md:w-14 md:h-14 bg-background/10 hover:bg-background/20 rounded-xl flex items-center justify-center transition-colors"
              >
                <Facebook className="w-6 h-6 md:w-7 md:h-7" />
              </a>

              {canEdit && (
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute -top-2 -right-2 h-6 w-6 opacity-100 md:opacity-0 md:group-hover/social:opacity-100 transition-opacity"
                  onClick={() => setEditingField("facebook")}
                >
                  <Edit2 className="h-3 w-3" />
                </Button>
              )}
            </div>

            <div className="relative group/social">
              <a
                href={instagramHref}
                target={instagramHref.startsWith("http") ? "_blank" : undefined}
                rel={instagramHref.startsWith("http") ? "noopener noreferrer" : undefined}
                className="w-12 h-12 md:w-14 md:h-14 bg-background/10 hover:bg-background/20 rounded-xl flex items-center justify-center transition-colors"
              >
                <Instagram className="w-6 h-6 md:w-7 md:h-7" />
              </a>

              {canEdit && (
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute -top-2 -right-2 h-6 w-6 opacity-100 md:opacity-0 md:group-hover/social:opacity-100 transition-opacity"
                  onClick={() => setEditingField("instagram")}
                >
                  <Edit2 className="h-3 w-3" />
                </Button>
              )}
            </div>

            <div className="relative group/social">
              <a
                href={emailHref}
                className="w-12 h-12 md:w-14 md:h-14 bg-background/10 hover:bg-background/20 rounded-xl flex items-center justify-center transition-colors"
              >
                <Mail className="w-6 h-6 md:w-7 md:h-7" />
              </a>

              {canEdit && (
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute -top-2 -right-2 h-6 w-6 opacity-100 md:opacity-0 md:group-hover/social:opacity-100 transition-opacity"
                  onClick={() => setEditingField("email")}
                >
                  <Edit2 className="h-3 w-3" />
                </Button>
              )}
            </div>

            <div className="relative group/social">
              <a
                href={phoneHref}
                className="w-12 h-12 md:w-14 md:h-14 bg-background/10 hover:bg-background/20 rounded-xl flex items-center justify-center transition-colors"
              >
                <Phone className="w-6 h-6 md:w-7 md:h-7" />
              </a>

              {canEdit && (
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute -top-2 -right-2 h-6 w-6 opacity-100 md:opacity-0 md:group-hover/social:opacity-100 transition-opacity"
                  onClick={() => setEditingField("phone")}
                >
                  <Edit2 className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="pt-8 md:pt-10 border-t border-background/10">
          <div className="flex flex-wrap gap-x-6 gap-y-3 md:gap-x-8 text-base md:text-lg text-background/70">
            {legalLinks.map((link) => (
              <div key={link.label} className="relative group/legal">
                <a
                  href={link.href}
                  className="hover:text-background transition-colors"
                >
                  {link.label}
                </a>

                {canEdit && (
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute -top-3 -right-7 h-5 w-5 opacity-100 md:opacity-0 md:group-hover/legal:opacity-100 transition-opacity"
                    onClick={() => setEditingField(link.field)}
                  >
                    <Edit2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <EditModal
        isOpen={editingField === "logo"}
        onClose={() => setEditingField(null)}
        title="Upraviť logo vo footeri"
        type="image"
        removeBackground={true}
        initialValue={[logoSrc]}
        onSave={async (files) => {
          if (files[0]) {
            await setFooterLogo(files[0]);
          }

          setEditingField(null);
        }}
      />

      <EditModal
        isOpen={editingField === "facebook"}
        onClose={() => setEditingField(null)}
        title="Upraviť Facebook odkaz"
        type="text"
        initialValue={facebookUrl || ""}
        onSave={async (value) => {
          await setFacebookUrl(value);
          setEditingField(null);
        }}
      />

      <EditModal
        isOpen={editingField === "instagram"}
        onClose={() => setEditingField(null)}
        title="Upraviť Instagram odkaz"
        type="text"
        initialValue={instagramUrl || ""}
        onSave={async (value) => {
          await setInstagramUrl(value);
          setEditingField(null);
        }}
      />

      <EditModal
        isOpen={editingField === "email"}
        onClose={() => setEditingField(null)}
        title="Upraviť email"
        type="text"
        initialValue={email || ""}
        onSave={async (value) => {
          await setEmail(value);
          setEditingField(null);
        }}
      />

      <EditModal
        isOpen={editingField === "phone"}
        onClose={() => setEditingField(null)}
        title="Upraviť telefón"
        type="text"
        initialValue={phone || ""}
        onSave={async (value) => {
          await setPhone(value);
          setEditingField(null);
        }}
      />

      <EditModal
        isOpen={editingField === "copyright"}
        onClose={() => setEditingField(null)}
        title="Upraviť Copyright odkaz"
        type="text"
        initialValue={copyrightUrl || ""}
        onSave={async (value) => {
          await setCopyrightUrl(value);
          setEditingField(null);
        }}
      />

      <EditModal
        isOpen={editingField === "terms"}
        onClose={() => setEditingField(null)}
        title="Upraviť Podmienky odkaz"
        type="text"
        initialValue={termsUrl || ""}
        onSave={async (value) => {
          await setTermsUrl(value);
          setEditingField(null);
        }}
      />

      <EditModal
        isOpen={editingField === "gdpr"}
        onClose={() => setEditingField(null)}
        title="Upraviť GDPR odkaz"
        type="text"
        initialValue={gdprUrl || ""}
        onSave={async (value) => {
          await setGdprUrl(value);
          setEditingField(null);
        }}
      />
    </footer>
  );
};

export default Footer;