import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit2, Mail, Phone, MapPin } from "lucide-react";
import EditModal from "./EditModal";
import { useAuth } from "@/contexts/AuthContext";
import { useParagraph } from "@/hooks/useParagraph";

const DEFAULT_EMAIL = "info@rcsirotar.sk";
const DEFAULT_PHONE = "+421 123 456 789";
const DEFAULT_ADDRESS =
  "o.z. PAX ET BONUM \n (IČO: 30797578; DIČ: 2022364784),\n Jezuitská 6, 010 01 Žilina \n(v priestoroch Fidélia)";
const DEFAULT_MAP_IMAGE = "/mapaGoogle.png";
const DEFAULT_INTRO =
  "V prípade záujmu, či akýchkoľvek otázok nás neváhajte kontaktovať. :)";

const ContactSection = () => {
  const { isAuthenticated, role } = useAuth();
  const canEdit = isAuthenticated && role === "Admin";

  const { text: backendIntro, setText: setBackendIntro } =
    useParagraph("contact_intro_text");

  const { text: backendEmail, setText: setBackendEmail } =
    useParagraph("contact_email");

  const { text: backendPhone, setText: setBackendPhone } =
    useParagraph("contact_phone");

  const { text: backendAddress, setText: setBackendAddress } =
    useParagraph("contact_address");

  const { text: backendMapImage, setText: setBackendMapImage } =
    useParagraph("contact_map_image");

  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isEditingMap, setIsEditingMap] = useState(false);
  const [isEditingIntro, setIsEditingIntro] = useState(false);

  const [email, setEmail] = useState(DEFAULT_EMAIL);
  const [phone, setPhone] = useState(DEFAULT_PHONE);
  const [address, setAddress] = useState(DEFAULT_ADDRESS);
  const [mapImage, setMapImage] = useState(DEFAULT_MAP_IMAGE);
  const [introText, setIntroText] = useState(DEFAULT_INTRO);

  useEffect(() => {
    setIntroText(
      backendIntro && backendIntro.trim() !== "" ? backendIntro : DEFAULT_INTRO
    );
  }, [backendIntro]);

  useEffect(() => {
    setEmail(
      backendEmail && backendEmail.trim() !== "" ? backendEmail : DEFAULT_EMAIL
    );
  }, [backendEmail]);

  useEffect(() => {
    setPhone(
      backendPhone && backendPhone.trim() !== "" ? backendPhone : DEFAULT_PHONE
    );
  }, [backendPhone]);

  useEffect(() => {
    setAddress(
      backendAddress && backendAddress.trim() !== ""
        ? backendAddress
        : DEFAULT_ADDRESS
    );
  }, [backendAddress]);

  useEffect(() => {
    setMapImage(
      backendMapImage && backendMapImage.trim() !== ""
        ? backendMapImage
        : DEFAULT_MAP_IMAGE
    );
  }, [backendMapImage]);

  const handleSaveIntro = async (value: string) => {
    setIntroText(value);
    await setBackendIntro(value);
  };

  const handleSaveEmail = async (value: string) => {
    setEmail(value);
    await setBackendEmail(value);
  };

  const handleSavePhone = async (value: string) => {
    setPhone(value);
    await setBackendPhone(value);
  };

  const handleSaveAddress = async (value: string) => {
    setAddress(value);
    await setBackendAddress(value);
  };

  const handleSaveMapImage = async (value: string) => {
    setMapImage(value);
    await setBackendMapImage(value);
  };

  return (
    <section id="contact" className="py-12 md:py-20 px-4 overflow-hidden">
      <div className="w-full max-w-[1650px] mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-8">
          Kontaktujte nás
        </h2>

        <div className="relative group/intro mb-12">
          <p className="text-lg md:text-xl xl:text-2xl leading-[1.8] text-muted-foreground">
            {introText}
          </p>

          {canEdit && (
            <Button
              size="icon"
              variant="secondary"
              className="absolute top-0 right-0 opacity-100 md:opacity-0 md:group-hover/intro:opacity-100 transition-opacity h-7 w-7"
              onClick={() => setIsEditingIntro(true)}
            >
              <Edit2 className="h-3 w-3" />
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] xl:grid-cols-[430px_1fr] gap-8 lg:gap-16 xl:gap-24 items-stretch">
          <div className="space-y-5 md:space-y-6 w-full max-w-[460px] h-full">
            <div className="relative group/email">
              <div className="bg-[#F4E9E2] rounded-3xl p-6 md:p-8 xl:p-10">
                <div className="flex flex-col gap-4">
                  <div className="w-8 h-8 flex items-center justify-center">
                    <Mail className="w-7 h-7 md:w-8 md:h-8 text-black" />
                  </div>

                  <div>
                    <h3 className="text-xl md:text-2xl xl:text-3xl font-semibold text-[#5E7322] mb-2">
                      E-mail
                    </h3>

                    <p className="text-lg md:text-xl xl:text-2xl text-[#210F00] break-words">
                      {email}
                    </p>
                  </div>
                </div>
              </div>

              {canEdit && (
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute top-0 right-0 opacity-100 md:opacity-0 md:group-hover/email:opacity-100 transition-opacity h-7 w-7"
                  onClick={() => setIsEditingEmail(true)}
                >
                  <Edit2 className="h-3 w-3" />
                </Button>
              )}
            </div>

            <div className="relative group/phone">
              <div className="bg-[#F4E9E2] rounded-3xl p-6 md:p-8 xl:p-10">
                <div className="flex flex-col gap-4">
                  <div className="w-7 h-7 md:w-8 md:h-8 flex text-black">
                    <Phone className="w-7 h-7 md:w-8 md:h-8 text-black" />
                  </div>

                  <div>
                    <h3 className="text-xl md:text-2xl xl:text-3xl font-semibold text-[#5E7322] mb-2">
                      Telefón
                    </h3>

                    <p className="text-lg md:text-xl xl:text-2xl text-[#210F00] whitespace-pre-line break-words">
                      {phone}
                    </p>
                  </div>
                </div>
              </div>

              {canEdit && (
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute top-0 right-0 opacity-100 md:opacity-0 md:group-hover/phone:opacity-100 transition-opacity h-7 w-7"
                  onClick={() => setIsEditingPhone(true)}
                >
                  <Edit2 className="h-3 w-3" />
                </Button>
              )}
            </div>

            <div className="relative group/address">
              <div className="bg-[#F4E9E2] rounded-3xl p-6 md:p-8 xl:p-10">
                <div className="flex flex-col gap-4">
                  <div className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center">
                    <MapPin className="w-7 h-7 md:w-8 md:h-8 text-black" />
                  </div>

                  <div>
                    <h3 className="text-lg md:text-2xl xl:text-3xl font-semibold text-[#5E7322] mb-2">
                      Adresa
                    </h3>

                    <p className="text-lg md:text-xl xl:text-2xl text-[#210F00] whitespace-pre-line break-words">
                      {address}
                    </p>
                  </div>
                </div>
              </div>

              {canEdit && (
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute top-0 right-0 opacity-100 md:opacity-0 md:group-hover/address:opacity-100 transition-opacity h-7 w-7"
                  onClick={() => setIsEditingAddress(true)}
                >
                  <Edit2 className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>

          <div className="relative group/map bg-muted rounded-3xl overflow-hidden w-full h-[260px] sm:h-[320px] md:h-[380px] lg:h-[420px] xl:h-[785px] flex items-center justify-center shadow-lg justify-self-center">
            {mapImage ? (
              <img
                src={mapImage}
                alt="Map"
                className="w-full h-full object-cover object-center"
              />
            ) : (
              <MapPin className="w-24 h-24 text-muted-foreground" />
            )}

            {canEdit && (
              <Button
                size="icon"
                variant="secondary"
                className="edit-button"
                onClick={() => setIsEditingMap(true)}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      <EditModal
        isOpen={isEditingIntro}
        onClose={() => setIsEditingIntro(false)}
        title="Upraviť úvod kontaktu"
        type="text"
        initialValue={introText}
        onSave={async (value) => {
          await handleSaveIntro(value);
          setIsEditingIntro(false);
        }}
      />

      <EditModal
        isOpen={isEditingEmail}
        onClose={() => setIsEditingEmail(false)}
        title="Upraviť e-mail"
        type="text"
        initialValue={email}
        onSave={async (value) => {
          await handleSaveEmail(value);
          setIsEditingEmail(false);
        }}
      />

      <EditModal
        isOpen={isEditingPhone}
        onClose={() => setIsEditingPhone(false)}
        title="Upraviť telefón"
        type="text"
        initialValue={phone}
        onSave={async (value) => {
          await handleSavePhone(value);
          setIsEditingPhone(false);
        }}
      />

      <EditModal
        isOpen={isEditingAddress}
        onClose={() => setIsEditingAddress(false)}
        title="Upraviť adresu"
        type="text"
        initialValue={address}
        onSave={async (value) => {
          await handleSaveAddress(value);
          setIsEditingAddress(false);
        }}
      />

      <EditModal
        isOpen={isEditingMap}
        onClose={() => setIsEditingMap(false)}
        title="Upraviť mapu"
        type="image"
        initialValue={[mapImage]}
        onSave={async (files) => {
          if (files[0]) {
            await handleSaveMapImage(files[0]);
          }

          setIsEditingMap(false);
        }}
      />
    </section>
  );
};

export default ContactSection;