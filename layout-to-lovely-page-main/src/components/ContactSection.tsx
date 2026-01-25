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
  
  const [email, setEmail] = useState("Lorem ipsum dolor sit amet\nLorem ipsum");
  const [phone, setPhone] = useState("+421 123 456 789");
  const [address, setAddress] = useState("Lorem ipsum dolor sit amet\nLorem ipsum");
  const [mapImage, setMapImage] = useState("");
  const [introText, setIntroText] = useState(
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
  );
    // Add this to check authentication
  const { isAuthenticated, role } = useAuth();

  return (
    <section id="contact" className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Contact us</h2>
        
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

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="relative group/email">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Email</h3>
                  <p className="text-muted-foreground whitespace-pre-line">{email}</p>
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
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Phone</h3>
                  <p className="text-muted-foreground">{phone}</p>
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
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Adresa</h3>
                  <p className="text-muted-foreground whitespace-pre-line">{address}</p>
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
          <div className="relative group bg-muted rounded-lg overflow-hidden aspect-square flex items-center justify-center">
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
