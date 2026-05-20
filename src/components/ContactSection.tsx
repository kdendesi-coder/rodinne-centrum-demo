import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit2, Mail, Phone, MapPin } from "lucide-react";
import EditModal from "./EditModal";
import { useAuth } from "@/contexts/AuthContext"; // Add this import

const ContactSection = () => {
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isEditingMap, setIsEditingMap] = useState(false);
  const [isEditingIntro, setIsEditingIntro] = useState(false);
  
  const [email, setEmail] = useState("info@rcsirotar.sk");
  const [phone, setPhone] = useState("+421 123 456 789");
  const [address, setAddress] = useState("o.z. PAX ET BONUM \n (IČO: 30797578; DIČ: 2022364784),\n Jezuitská 6, 010 01 Žilina \n(v priestoroch Fidélia)");
  const [mapImage, setMapImage] = useState("mapaGoogle.png");
  const [introText, setIntroText] = useState(
    "V prípade záujmu, či akýchkoľvek otázok nás neváhajte kontaktovať. :)"
  );
    // Add this to check authentication
  const { isAuthenticated, role } = useAuth();

  return (
    <section id="contact" className="py-12 md:py-20 px-4 overflow-hidden">
      <div className="w-full max-w-[1650px] mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-8">Kontaktujte nás</h2>
        
        <div className="relative group/intro mb-12">
          <p className="text-lg md:text-xl xl:text-2xl leading-[1.8] text-muted-foreground">{introText}</p>

          {/* Show edit button only for Admin users */}
          {isAuthenticated && role === "Admin" && (
            <Button
              size="icon"
              variant="secondary"
              className="absolute top-0 right-0 opacity-0 group-hover/intro:opacity-100 transition-opacity h-7 w-7"
              onClick={() => setIsEditingIntro(true)}
            >
              <Edit2 className="h-3 w-3" />
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] xl:grid-cols-[430px_1fr] gap-8 lg:gap-16 xl:gap-24 items-stretch">
          {/* Contact Info */}
          <div className="space-y-5 md:space-y-6 w-full max-w-[460px] h-full">
            <div className="relative group/email">

              <div className="bg-[#F4E9E2] rounded-3xl p-6 md:p-8 xl:p-10">
                <div className="flex flex-col gap-4">

                  {/* Ikona */}
                  <div className="w-8 h-8 flex items-center justify-center">
                    <Mail className="w-7 h-7 md:w-8 md:h-8 text-black" />
                  </div>
                  
                  {/* Text */}
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

              {/* Show edit button only for Admin users */}
              {isAuthenticated && role === "Admin" && (
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute top-0 right-0 opacity-0 group-hover/email:opacity-100 transition-opacity h-7 w-7"
                  onClick={() => setIsEditingEmail(true)}
                >
                  <Edit2 className="h-3 w-3" />
                </Button>
              )}
            </div>

            <div className="relative group/phone">

              <div className="bg-[#F4E9E2] rounded-3xl p-6 md:p-8 xl:p-10">
                <div className="flex flex-col gap-4">

                  {/* Ikona */}
                  <div className="w-7 h-7 md:w-8 md:h-8 flex text-black">
                    <Phone className="w-7 h-7 md:w-8 md:h-8 text-black" />
                  </div>
                  
                  {/* Text */}
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

              
              {/* Show edit button only for Admin users */}
              {isAuthenticated && role === "Admin" && (
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute top-0 right-0 opacity-0 group-hover/phone:opacity-100 transition-opacity h-7 w-7"
                  onClick={() => setIsEditingPhone(true)}
                >
                  <Edit2 className="h-3 w-3" />
                </Button>
              )}
            </div>

            <div className="relative group/address">
             
              <div className="bg-[#F4E9E2] rounded-3xl p-6 md:p-8 xl:p-10">
                <div className="flex flex-col gap-4">

                  {/* Ikona */}
                  <div className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center">
                    <MapPin className="w-7 h-7 md:w-8 md:h-8 text-black" />
                  </div>
                  
                  {/* Text */}
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

              {/* Show edit button only for Admin users */}
              {isAuthenticated && role === "Admin" && (
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute top-0 right-0 opacity-0 group-hover/address:opacity-100 transition-opacity h-7 w-7"
                  onClick={() => setIsEditingAddress(true)}
                >
                  <Edit2 className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>

          {/* Map */}
          <div className="relative group bg-muted rounded-3xl overflow-hidden w-full h-[260px] sm:h-[320px] md:h-[380px] lg:h-[420px] xl:h-[785px] flex items-center justify-center shadow-lg justify-self-center">
            {mapImage ? (
              <img src={mapImage} alt="Map" className="w-full h-full object-cover object-center" />
            ) : (
              <MapPin className="w-24 h-24 text-muted-foreground" />
            )}

            {/* Show edit button only for Admin users */}
            {isAuthenticated && role === "Admin" && (
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
        title="Edit Contact Introduction"
        type="text"
        initialValue={introText}
        onSave={setIntroText}
      />
      <EditModal
        isOpen={isEditingEmail}
        onClose={() => setIsEditingEmail(false)}
        title="Edit Email"
        type="text"
        initialValue={email}
        onSave={setEmail}
      />
      <EditModal
        isOpen={isEditingPhone}
        onClose={() => setIsEditingPhone(false)}
        title="Edit Phone"
        type="text"
        initialValue={phone}
        onSave={setPhone}
      />
      <EditModal
        isOpen={isEditingAddress}
        onClose={() => setIsEditingAddress(false)}
        title="Edit Address"
        type="text"
        initialValue={address}
        onSave={setAddress}
      />
      <EditModal
        isOpen={isEditingMap}
        onClose={() => setIsEditingMap(false)}
        title="Edit Map Image"
        type="image"
        initialValue={mapImage}
        onSave={setMapImage}
      />
    </section>
  );
};

export default ContactSection;
