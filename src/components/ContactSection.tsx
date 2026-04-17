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
    <section id="contact" className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Kontaktuje nás</h2>
        
        <div className="relative group/intro mb-12">
          <p className="text-muted-foreground">{introText}</p>

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

        <div className="grid grid-cols-1 md:grid-cols-[0.75fr_2.05fr] gap-8 items-start">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="relative group/email">

              <div className="bg-[#F4E9E2] rounded-3xl p-5 min-h-[150px]">
                <div className="flex flex-col gap-4">

                  {/* Ikona */}
                  <div className="w-5 h-5 flex item-left justify-center">
                    <Mail className="w-6 h-6 text-black" />
                  </div>
                  
                  {/* Text */}
                  <div>
                    <h3 className="text-lg font-semibold text-[#5E7322] mb-2">
                      E-mail
                    </h3>

                    <p className="text-[#210F00]">
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

              <div className="bg-[#F4E9E2] rounded-3xl p-5 min-h-[150px]">
                <div className="flex flex-col gap-4">

                  {/* Ikona */}
                  <div className="w-5 h-5 flex item-left justify-center">
                    <Phone className="w-6 h-6 text-black" />
                  </div>
                  
                  {/* Text */}
                  <div>
                    <h3 className="text-lg font-semibold text-[#5E7322] mb-2">
                      Telefón
                    </h3>

                    <p className="text-[#210F00]">
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
             
              <div className="bg-[#F4E9E2] rounded-3xl p-5 min-h-[150px]">
                <div className="flex flex-col gap-4">

                  {/* Ikona */}
                  <div className="w-5 h-5 flex item-left justify-center">
                    <MapPin className="w-6 h-6 text-black" />
                  </div>
                  
                  {/* Text */}
                  <div>
                    <h3 className="text-lg font-semibold text-[#5E7322] mb-2">
                      Adresa
                    </h3>

                    <p className="text-[#210F00]">
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
          <div className="relative group bg-muted rounded-3xl overflow-hidden h-[550px] md:h-[340px] flex items-center justify-center">
            {mapImage ? (
              <img src={mapImage} alt="Map" className="w-full h-full object-cover" />
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
