import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit2, Mail, Phone, MapPin } from "lucide-react";
import EditModal from "./EditModal";
import { useAuth } from "@/contexts/AuthContext";
import { useParagraph } from "@/hooks/useParagraph";

const DEFAULT_TITLE = "Kontaktujte nás";
const DEFAULT_EMAIL_TITLE = "E-mail";
const DEFAULT_PHONE_TITLE = "Telefón";
const DEFAULT_ADDRESS_TITLE = "Adresa";

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

  const { text: backendTitle, setText: setBackendTitle } =
    useParagraph("contact_title");

  const { text: backendIntro, setText: setBackendIntro } =
    useParagraph("contact_intro_text");

  const { text: backendEmailTitle, setText: setBackendEmailTitle } =
    useParagraph("contact_email_title");

  const { text: backendPhoneTitle, setText: setBackendPhoneTitle } =
    useParagraph("contact_phone_title");

  const { text: backendAddressTitle, setText: setBackendAddressTitle } =
    useParagraph("contact_address_title");

  const { text: backendEmail, setText: setBackendEmail } =
    useParagraph("contact_email");

  const { text: backendPhone, setText: setBackendPhone } =
    useParagraph("contact_phone");

  const { text: backendAddress, setText: setBackendAddress } =
    useParagraph("contact_address");

  const { text: backendMapImage, setText: setBackendMapImage } =
    useParagraph("contact_map_image");

  const [title, setTitle] = useState(DEFAULT_TITLE);
  const [introText, setIntroText] = useState(DEFAULT_INTRO);

  const [emailTitle, setEmailTitle] = useState(DEFAULT_EMAIL_TITLE);
  const [phoneTitle, setPhoneTitle] = useState(DEFAULT_PHONE_TITLE);
  const [addressTitle, setAddressTitle] = useState(DEFAULT_ADDRESS_TITLE);

  const [email, setEmail] = useState(DEFAULT_EMAIL);
  const [phone, setPhone] = useState(DEFAULT_PHONE);
  const [address, setAddress] = useState(DEFAULT_ADDRESS);
  const [mapImage, setMapImage] = useState(DEFAULT_MAP_IMAGE);

  const [editingField, setEditingField] = useState<
    | "title"
    | "intro"
    | "emailTitle"
    | "phoneTitle"
    | "addressTitle"
    | "email"
    | "phone"
    | "address"
    | "map"
    | null
  >(null);

  useEffect(() => {
    setTitle(
      backendTitle && backendTitle.trim() !== "" ? backendTitle : DEFAULT_TITLE
    );
  }, [backendTitle]);

  useEffect(() => {
    setIntroText(
      backendIntro && backendIntro.trim() !== "" ? backendIntro : DEFAULT_INTRO
    );
  }, [backendIntro]);

  useEffect(() => {
    setEmailTitle(
      backendEmailTitle && backendEmailTitle.trim() !== ""
        ? backendEmailTitle
        : DEFAULT_EMAIL_TITLE
    );
  }, [backendEmailTitle]);

  useEffect(() => {
    setPhoneTitle(
      backendPhoneTitle && backendPhoneTitle.trim() !== ""
        ? backendPhoneTitle
        : DEFAULT_PHONE_TITLE
    );
  }, [backendPhoneTitle]);

  useEffect(() => {
    setAddressTitle(
      backendAddressTitle && backendAddressTitle.trim() !== ""
        ? backendAddressTitle
        : DEFAULT_ADDRESS_TITLE
    );
  }, [backendAddressTitle]);

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

  const saveTitle = async (value: string) => {
    setTitle(value);
    await setBackendTitle(value);
  };

  const saveIntro = async (value: string) => {
    setIntroText(value);
    await setBackendIntro(value);
  };

  const saveEmailTitle = async (value: string) => {
    setEmailTitle(value);
    await setBackendEmailTitle(value);
  };

  const savePhoneTitle = async (value: string) => {
    setPhoneTitle(value);
    await setBackendPhoneTitle(value);
  };

  const saveAddressTitle = async (value: string) => {
    setAddressTitle(value);
    await setBackendAddressTitle(value);
  };

  const saveEmail = async (value: string) => {
    setEmail(value);
    await setBackendEmail(value);
  };

  const savePhone = async (value: string) => {
    setPhone(value);
    await setBackendPhone(value);
  };

  const saveAddress = async (value: string) => {
    setAddress(value);
    await setBackendAddress(value);
  };

  const saveMapImage = async (value: string) => {
    setMapImage(value);
    await setBackendMapImage(value);
  };

  return (
    <section id="contact" className="py-12 md:py-20 px-4 overflow-hidden">
      <div className="w-full max-w-[1650px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative group/title mb-8">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold">
            {title}
          </h2>

          {canEdit && (
            <Button
              size="icon"
              variant="secondary"
              className="absolute top-0 right-0 opacity-100 md:opacity-0 md:group-hover/title:opacity-100 transition-opacity h-7 w-7"
              onClick={() => setEditingField("title")}
            >
              <Edit2 className="h-3 w-3" />
            </Button>
          )}
        </div>

        <div className="relative group/intro mb-12">
          <p className="text-lg md:text-xl xl:text-2xl leading-[1.8] text-muted-foreground">
            {introText}
          </p>

          {canEdit && (
            <Button
              size="icon"
              variant="secondary"
              className="absolute top-0 right-0 opacity-100 md:opacity-0 md:group-hover/intro:opacity-100 transition-opacity h-7 w-7"
              onClick={() => setEditingField("intro")}
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
                    <div className="relative group/emailTitle">
                      <h3 className="text-xl md:text-2xl xl:text-3xl font-semibold text-[#5E7322] mb-2">
                        {emailTitle}
                      </h3>

                      {canEdit && (
                        <Button
                          size="icon"
                          variant="secondary"
                          className="absolute top-0 right-0 h-6 w-6 opacity-100 md:opacity-0 md:group-hover/emailTitle:opacity-100 transition-opacity"
                          onClick={() => setEditingField("emailTitle")}
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>

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
                  onClick={() => setEditingField("email")}
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
                    <div className="relative group/phoneTitle">
                      <h3 className="text-xl md:text-2xl xl:text-3xl font-semibold text-[#5E7322] mb-2">
                        {phoneTitle}
                      </h3>

                      {canEdit && (
                        <Button
                          size="icon"
                          variant="secondary"
                          className="absolute top-0 right-0 h-6 w-6 opacity-100 md:opacity-0 md:group-hover/phoneTitle:opacity-100 transition-opacity"
                          onClick={() => setEditingField("phoneTitle")}
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>

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
                  onClick={() => setEditingField("phone")}
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
                    <div className="relative group/addressTitle">
                      <h3 className="text-lg md:text-2xl xl:text-3xl font-semibold text-[#5E7322] mb-2">
                        {addressTitle}
                      </h3>

                      {canEdit && (
                        <Button
                          size="icon"
                          variant="secondary"
                          className="absolute top-0 right-0 h-6 w-6 opacity-100 md:opacity-0 md:group-hover/addressTitle:opacity-100 transition-opacity"
                          onClick={() => setEditingField("addressTitle")}
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>

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
                  onClick={() => setEditingField("address")}
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
                onClick={() => setEditingField("map")}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      <EditModal
        isOpen={editingField === "title"}
        onClose={() => setEditingField(null)}
        title="Upraviť nadpis kontaktu"
        type="text"
        initialValue={title}
        onSave={async (value) => {
          await saveTitle(value);
          setEditingField(null);
        }}
      />

      <EditModal
        isOpen={editingField === "intro"}
        onClose={() => setEditingField(null)}
        title="Upraviť úvod kontaktu"
        type="text"
        initialValue={introText}
        onSave={async (value) => {
          await saveIntro(value);
          setEditingField(null);
        }}
      />

      <EditModal
        isOpen={editingField === "emailTitle"}
        onClose={() => setEditingField(null)}
        title="Upraviť názov e-mail boxu"
        type="text"
        initialValue={emailTitle}
        onSave={async (value) => {
          await saveEmailTitle(value);
          setEditingField(null);
        }}
      />

      <EditModal
        isOpen={editingField === "phoneTitle"}
        onClose={() => setEditingField(null)}
        title="Upraviť názov telefón boxu"
        type="text"
        initialValue={phoneTitle}
        onSave={async (value) => {
          await savePhoneTitle(value);
          setEditingField(null);
        }}
      />

      <EditModal
        isOpen={editingField === "addressTitle"}
        onClose={() => setEditingField(null)}
        title="Upraviť názov adresy"
        type="text"
        initialValue={addressTitle}
        onSave={async (value) => {
          await saveAddressTitle(value);
          setEditingField(null);
        }}
      />

      <EditModal
        isOpen={editingField === "email"}
        onClose={() => setEditingField(null)}
        title="Upraviť e-mail"
        type="text"
        initialValue={email}
        onSave={async (value) => {
          await saveEmail(value);
          setEditingField(null);
        }}
      />

      <EditModal
        isOpen={editingField === "phone"}
        onClose={() => setEditingField(null)}
        title="Upraviť telefón"
        type="text"
        initialValue={phone}
        onSave={async (value) => {
          await savePhone(value);
          setEditingField(null);
        }}
      />

      <EditModal
        isOpen={editingField === "address"}
        onClose={() => setEditingField(null)}
        title="Upraviť adresu"
        type="text"
        initialValue={address}
        onSave={async (value) => {
          await saveAddress(value);
          setEditingField(null);
        }}
      />

      <EditModal
        isOpen={editingField === "map"}
        onClose={() => setEditingField(null)}
        title="Upraviť mapu"
        type="image"
        initialValue={[mapImage]}
        onSave={async (files) => {
          if (files[0]) {
            await saveMapImage(files[0]);
          }

          setEditingField(null);
        }}
      />
    </section>
  );
};

export default ContactSection;