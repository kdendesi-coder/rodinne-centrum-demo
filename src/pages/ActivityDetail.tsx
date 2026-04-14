import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Edit2, ArrowLeft } from "lucide-react";
import EditModal from "@/components/EditModal";
import { useAuth } from "@/contexts/AuthContext";

interface ActivityData {
  id: string;
  title: string;
  content: string;
  list1Title?: string;
  list2Title?: string;
  list1?: string[];
  list2?: string[];

  photo?: { src: string, alt: string }[];
  googleFormLink?: string;
  textPrihlaska?: string;
  textAtrium?: string;
  fiancie?: string;

  text1? : string;
  text2?: string;
  text1Title?: string;
  text2Title?: string;
  text3?: string;
  text4?: string;
  text5?: string;


}

// Default detailed content for activity pages (independent from section summaries)
const defaultDetailContent: Record<string, ActivityData> = {
  herna: {
    id: "herna",
    title: "Herňa",
    content: "Herňa je otvorená pre mamičky a deti každú stredu (okrem prázdnin a sviatkov) od 9:00 h do 12:00 h, program (detská aktivita alebo prednáška) začína o 10:00 h spoločnou modlitbou. Počas programu je k dispozícii spovedná služba a knižnica.",
    
    list1Title: "Aktivity pre deti:",
    list2Title: "Prednášky pre mamičky:",
    list1: [
      "Hravá angličtina", 
      "Montessori hernička", 
      "Detské tvorivé dielne", 
      "Klavírna víla – Boinka", 
      "Katechézy Dobrého pastiera"
    ],
    list2: [
      "Fyzioterapeutka Radka", 
      "Učíme sa rozprávať s pani logopedičkou", 
      "Svedectvá mnohodetných rodín", 
      "Príprava na pôrod s dulou", 
      "Staráme sa o seba s kozmetičkou", 
      "Ženský cyklus – ako sa v ňom dobre vyznať", 
      "Zdravie našich detí s pani pediatričkou", 
      "O domácom vzdelávaní", 
      "O kváskovaní a iné…"
    ],
  },
  
  atrium: {
    id: "atrium",
    title: "Átrium Dobrého pastiera",
    content: "Átrium je miesto, kde sa deti zoznamujú so základnými pravdami viery cez koncept Katechéz Dobrého pastiera, ktorý je postavený na pedagogických princípoch Márie Montessori a teologických znalostiach Sofie Cavalleti. Deti sú privádzané k modlitbe a poznávaniu Boha, učia sa rozumieť bohatstvu liturgie a poznať Sväté písmo spôsobom pre nich vhodným.",
    photo: [
      { 
        src: "/photo1Dieta.jpg",
        alt: "Fotka Atria Dieta"
      }, 
      { 
        src: "/financnaPodporaZA.jpg",
        alt: "Fotka financna podpora ZA"
      }
    ],
    googleFormLink: "https://docs.google.com/forms/d/e/1FAIpQLSfqm51JNlBk0HdOyG2RoZsianKgNvZ6uSajSdtS7Yv5l0AJZw/closedform",
    textPrihlaska: "Prihlášku, prosím, vyplňte nižšie, alebo použite link: https://forms.gle/vkpU6rRkJsvmLERm8",
    textAtrium: "Projekt ,,Podpora rozvoja deti a rodin formou Katechéz Dobrého pastiera“ realizujeme v Átriu Dobrého pastiera v Rodinnom centre Sirotár.",
    fiancie: "Finančne podporil Žilinský samosprávny kraj"
  }, 

  klubik: {
    id: "klubik",
    title: "Klub detí – komunitné vzdelávanie detí",
    content: "Klub detí je priestor, kde sa stretávajú deti a v malej skupine s podporou sprievodcov majú možnosť objavovať, učiť sa a rásť v bezpečnom prostredí. V klube sa aktívne venujeme sociálnemu a emocionálnemu rozvoju detí, podporujeme ich sebapoznanie, schopnosť samostatného rozhodovania a spoluprácu v skupine. Klub funguje na princípoch Montessori pedagogiky a rešpektujúcej komunikácie, čo vedie deti k zodpovednosti a aktívnemu prístupu k učeniu. Prostredníctvom vzdelávacích aktivít so zameraním na prírodovednú gramotnosť a ekologické princípy vytvárame pozitívny vzťah detí k prírode a učíme ich udržateľnému spôsobu života.",
    photo: [
      { 
        src: "/detiKlubik.jpg",
        alt: "Fotka deti Klubik"
      }, 
      { 
        src: "/financna_podpora_Mesta_Zilina.jpg",
        alt: "Fotka financna podpora mesta ZA"
      }
    ],
    text1: "Tento projekt bol finančné podporený z grantovej dotácie Mesta Žilina",
    text2: "Vďaka grantovej dotácii mesta Žilina sme mohli v našom Klube detí rozšíriť množštvo pomôcok a zorganizovať dve komunitné akcie pre celé rodiny.",
    text1Title: "Ako to prebieha?",
    text3: "Počas dopoludnia deti zažívajú aktivity inšpirované montessori pedagogikou – od praktického života cez tvorivé dielne a spoločné stolovanie až po hry vonku. Všetko v rytme, ktorý podporuje samostatnosť, tvorivosť, prirodzenú zvedavosť, spolupatričnosť a zodpovednosť za vzťahy a okolie. V jednotlivých aktivitách hľadáme rovnováhu medzi slobodou, zodpovednosťou a vnútornou disciplínou.",
    text2Title: "Pre koho je Klub detí?",
    text4: "Pre deti, ktoré sú pripravené stráviť čas bez rodičov, nájsť si nových kamarátov a zažiť komunitné vzdelávanie v malej skupine. Klub detí je otvorený pre všetky deti, ktorých rodičia hľadajú prostredie, v ktorom by sa deti ľahšie pripravili na zaradenie do škôlky alebo sa rozhodli poskytnúť svojmu dieťaťu vzdelávanie prioritne vo vlastnej rodine a kvôli sociálnym návykom hľadajú podnetný klub jeden alebo dvakrát za týždeň.",
    text5: "👉 Pre viac informácií sa nám neváhajte ozvať!"
    
  }, 
};

const ActivityDetail = () => {
  const { activityId } = useParams<{ activityId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [activity, setActivity] = useState<ActivityData | null>(null);

  
 const [isEditingPhoto, setIsEditingPhoto] = useState(false); 
  const [photoToEditIndex, setPhotoToEditIndex] = useState<number | null>(null); 

  const [isEditingContent, setIsEditingContent] = useState(false);
  const [isEditingList1, setIsEditingList1] = useState(false);
  const [isEditingList2, setIsEditingList2] = useState(false);

  const [isEditingTextPrihlaska, setIsEditingTextPrihlaska] = useState(false);
  const [isEditingTextAtrium, setIsEditingTextAtrium] = useState(false);
  const [isEditingTextFinancie, setIsEditingTextFinancie] = useState(false);

  const [isEditingText1, setIsEditingText1] = useState(false);
  const [isEditingText2, setIsEditingText2] = useState(false);
  const [isEditingText3, setIsEditingText3] = useState(false);
  const [isEditingText4, setIsEditingText4] = useState(false);
  const [isEditingText5, setIsEditingText5] = useState(false);

  const [isEditingTitleText1, setIsEditingTitleText1] = useState(false);
  const [isEditingTitleText2, setIsEditingTitleText2] = useState(false);


  const [isEditingPhotoIndex, setIsEditingPhotoIndex] = useState<number | null>(null); 




  // Load data from localStorage or fallback to default
  useEffect(() => {
    if (!activityId) return;

    const storageKey = `activity_detail_${activityId}`;
    const storedContent = localStorage.getItem(storageKey);

    if (storedContent) {
      try {
        const parsed = JSON.parse(storedContent);
        console.log('Nacitane udaje z localStorage: ', parsed);
        setActivity(parsed);
        return;
      } catch {
        console.log("Chyba pri načítaní zoznamu z localStorage");
      }
    }

    const defaultData = defaultDetailContent[activityId];
    if (defaultData) {
      console.log("Nacitane predvolene data: ", defaultData);
      setActivity({
        id: activityId,
        title: defaultData.title,
        content: defaultData.content,
        list1Title: defaultData.list1Title,
        list2Title: defaultData.list2Title,
        list1: defaultData.list1 || [],
        list2: defaultData.list2 || [],

        photo: defaultData.photo || [],
        googleFormLink: defaultData.googleFormLink || "",
        textPrihlaska: defaultData.textPrihlaska,
        textAtrium: defaultData.textAtrium,
        fiancie: defaultData.fiancie,

        text1: defaultData.text1,
        text2: defaultData.text2,
        text1Title: defaultData.text1Title,
        text2Title: defaultData.text2Title,
        text3: defaultData.text3,
        text4: defaultData.text4,
        text5: defaultData.text5

      });
    }
  }, [activityId]);

  const handleSaveContent = (newContent: string ) => {
    if (!activity || !activityId) return;

    const updatedActivity = { ...activity, content: newContent };
    console.log('Aktualizovana aktivita pred ulozenim:', updatedActivity);
    setActivity(updatedActivity);

    const storageKey = `activity_detail_${activityId}`;
    localStorage.setItem(storageKey, JSON.stringify(updatedActivity)); // Store to localStorage
  };

  const handleSaveList1 = (newList1: string[]) => {
    if (!activity || !activityId) return;

    const updatedActivity = { ...activity, list1: newList1 };
    setActivity(updatedActivity);

    const storageKey = `activity_detail_${activityId}`;
    localStorage.setItem(storageKey, JSON.stringify(updatedActivity)); // Store to localStorage
  };

  const handleSaveList2 = (newList2: string[]) => {
    if (!activity || !activityId) return;

    const updatedActivity = { ...activity, list2: newList2 };
    setActivity(updatedActivity);

    const storageKey = `activity_detail_${activityId}`;
    localStorage.setItem(storageKey, JSON.stringify(updatedActivity)); // Store to localStorage
  };

  const handleSaveText1 = (newText1: string) => {
    if (!activity || !activityId) return;

    const updatedActivity = { ...activity, text1: newText1 };
    setActivity(updatedActivity);

    const storageKey = `activity_detail_${activityId}`;
    localStorage.setItem(storageKey, JSON.stringify(updatedActivity)); // Store to localStorage
  };
 
   const handleSaveText2 = (newText2: string) => {
    if (!activity || !activityId) return;

    const updatedActivity = { ...activity, text2: newText2 };
    setActivity(updatedActivity);

    const storageKey = `activity_detail_${activityId}`;
    localStorage.setItem(storageKey, JSON.stringify(updatedActivity)); // Store to localStorage
  };

  const handleSaveText3 = (newText3: string) => {
    if (!activity || !activityId) return;

    const updatedActivity = { ...activity, text3: newText3 };
    setActivity(updatedActivity);

    const storageKey = `activity_detail_${activityId}`;
    localStorage.setItem(storageKey, JSON.stringify(updatedActivity)); // Store to localStorage
  };

  const handleSaveText4 = (newText4: string) => {
    if (!activity || !activityId) return;

    const updatedActivity = { ...activity, text4: newText4 };
    setActivity(updatedActivity);

    const storageKey = `activity_detail_${activityId}`;
    localStorage.setItem(storageKey, JSON.stringify(updatedActivity)); // Store to localStorage
  };

  const handleSaveText5 = (newText5: string) => {
    if (!activity || !activityId) return;

    const updatedActivity = { ...activity, text5: newText5 };
    setActivity(updatedActivity);

    const storageKey = `activity_detail_${activityId}`;
    localStorage.setItem(storageKey, JSON.stringify(updatedActivity)); // Store to localStorage
  };


  const handleSaveTitleText1 = (newTextTitle1: string) => {
    if (!activity || !activityId) return;

    const updatedActivity = { ...activity, text1Title: newTextTitle1 };
    setActivity(updatedActivity);

    const storageKey = `activity_detail_${activityId}`;
    localStorage.setItem(storageKey, JSON.stringify(updatedActivity)); // Store to localStorage
  };

  const handleSaveTitleText2 = (newTextTitle2: string) => {
    if (!activity || !activityId) return;

    const updatedActivity = { ...activity, text2Title: newTextTitle2 };
    setActivity(updatedActivity);

    const storageKey = `activity_detail_${activityId}`;
    localStorage.setItem(storageKey, JSON.stringify(updatedActivity)); // Store to localStorage
  };

  const handleSaveTextPrihlaska = (newTextPrihlaska: string) => {
    if (!activity || !activityId) return;

    const updatedActivity = { ...activity, textPrihlaska: newTextPrihlaska };
    setActivity(updatedActivity);

    const storageKey = `activity_detail_${activityId}`;
    localStorage.setItem(storageKey, JSON.stringify(updatedActivity)); // Store to localStorage
  };

  const handleSaveTextAtrium = (newTextAtrium: string) => {
    if (!activity || !activityId) return;

    const updatedActivity = { ...activity, textAtrium: newTextAtrium };
    setActivity(updatedActivity);

    const storageKey = `activity_detail_${activityId}`;
    localStorage.setItem(storageKey, JSON.stringify(updatedActivity)); // Store to localStorage
  };

  const handleSaveTextFinancie = (newTextFinancie: string) => {
    if (!activity || !activityId) return;

    const updatedActivity = { ...activity, financie: newTextFinancie };
    setActivity(updatedActivity);

    const storageKey = `activity_detail_${activityId}`;
    localStorage.setItem(storageKey, JSON.stringify(updatedActivity)); // Store to localStorage
  };

  

  const handleSavePhoto = (newPhoto: string, index: number) => {
    if (!activity || !activityId) return;

    const updatedPhotos = [...activity.photo];
    updatedPhotos[index] = { ...updatedPhotos[index], src: newPhoto };

    const updatedActivity = { ...activity, photo: updatedPhotos };
    setActivity(updatedActivity);

    const storageKey = `activity_detail_${activityId}`;
    localStorage.setItem(storageKey, JSON.stringify(updatedActivity));
  };

  const openEditPhotoModal = (index: number) => {
    setIsEditingPhotoIndex(index);
  };

  

  if (!activity) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <main className="pt-16">
          <div className="container mx-auto max-w-4xl py-20 px-4">
            <h1 className="text-3xl font-bold mb-4">Aktivita nenájdená</h1>
            <Button variant="outline" onClick={() => navigate("/")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Späť na hlavnú stránku
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-16">
        <div className="container mx-auto max-w-4xl py-20 px-4">
          {/* Back button */}
          <Button 
            variant="ghost" 
            onClick={() => navigate("/#activities")}
            className="mb-8"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Späť na aktivity
          </Button>

          {/* Header */}
          <h1 className="text-center text-4xl md:text-5xl font-bold mb-12">
            {activity.title}
          </h1>

          {/* Editable CONTENT section */}
          <div className="bg-muted/30 rounded-lg p-8 space-y-8">
            {/* Text */}
            <div className="flex items-start justify-between gap-4">
              <p className="text-lg leading-relaxed text-muted-foreground whitespace-pre-wrap flex-1">
                {activity.content}
              </p>
              {isAuthenticated && (
                <Button
                  size="icon"
                  variant="secondary"
                  onClick={() => setIsEditingContent(true)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* List 1 */}
            {activity.list1 && activity.list1.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-muted-foreground whitespace-pre-wrap">
                {activity.list1Title}
              </h2>
              <ul className="list-disc pl-6 scpace-y-2 text-muted-foreground">
                {activity.list1.map((item, index) => (
                  <li key={`list1-item-${index}`}>{item}</li>
                ))}
              </ul>
              {isAuthenticated && (
                <Button
                  size="icon"
                  variant="secondary"
                  onClick={() => setIsEditingList1(true)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              )}
            </div>
            )}

            {/* List 2 */}
            {activity.list2 && activity.list2.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-muted-foreground whitespace-pre-wrap">
                {activity.list2Title}
              </h2>
              <ul className="list-disc pl-6 scpace-y-2 text-muted-foreground">
                {activity.list2.map((item, index) => (
                  <li key={`list2-item-${index}`}>{item}</li>
                ))}
              </ul>
              {isAuthenticated && (
                <Button
                  size="icon"
                  variant="secondary"
                  onClick={() => setIsEditingList2(true)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              )}
            </div>
            )}

             {/* Photo */}
             {activity.photo && activity.photo.length > 0 && (
              <div className="space-y-4">
                {activity.photo.map((photo, index) => (
                  <div key={index} className="relative w-full h-[300px] rounded-lg overflow-hidden">
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      className="w-full h-full object-cover"
                    />
                    {isAuthenticated && (
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                        <Button
                          size="icon"
                          variant="secondary"
                          onClick={() => openEditPhotoModal(index)}
                          className="bg-white p-2 rounded-full"
                        >
                          <Edit2 className="h-6 w-6 text-black" />
                        </Button>
                      </div>
                    )}

                  </div>
                ))}
              </div>
            )}
            </div>

             {/* Text prihlaska s klikateľným odkazom */}
            {activity.textPrihlaska && activity.textPrihlaska.trim() !== "" && (
              <div className="mb-6">
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {activity.textPrihlaska.split("https://forms.gle/").map((part, index) => (
                    <>
                      {part}
                      {index === 0 ? (
                        <a href="https://forms.gle/vkpU6rRkJsvmLERm8" target="_blank" rel="noopener noreferrer">
                          https://forms.gle/vkpU6rRkJsvmLERm8
                        </a>
                      ) : null}
                    </>
                  ))}
                </p>
                {isAuthenticated && (
                  <Button size="icon" variant="secondary" onClick={() => setIsEditingTextPrihlaska(true)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}

            {/* Text atrium projekt */}
            {activity.textAtrium && activity.textAtrium.trim() !== "" && (
              <div className="mb-6">
                <p className="text-muted-foreground whitespace-pre-wrap">{activity.textAtrium}</p>
                {isAuthenticated && (
                  <Button size="icon" variant="secondary" onClick={() => setIsEditingTextAtrium(true)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                )}
                
              </div>
            )}

            {/* Text atrium financie */}
            {activity.fiancie && activity.fiancie.trim() !== "" && (
              <div className="mb-6">
                <p className="text-muted-foreground whitespace-pre-wrap">{activity.fiancie}</p>
                {isAuthenticated && (
                  <Button size="icon" variant="secondary" onClick={() => setIsEditingTextFinancie(true)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                )}
                
              </div>
            )}


             {/* Text */}
            {activity.text1 && activity.text1.trim() !== "" && (
              <div className="mb-6">
                <p className="text-muted-foreground whitespace-pre-wrap">{activity.text1}</p>
                {isAuthenticated && (
                  <Button size="icon" variant="secondary" onClick={() => setIsEditingText1(true)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                )}
                
              </div>
            )}

            {activity.text2 && activity.text2.trim() !== "" && (
              <div className="mb-6">
                <p className="text-muted-foreground whitespace-pre-wrap">{activity.text2}</p>
                {isAuthenticated && (
                  <Button size="icon" variant="secondary" onClick={() => setIsEditingText2(true)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}


            {activity.text3 && activity.text3.trim() !== "" && (
              <div className="mb-6">
                <h2 className="text-2xl text-muted-foreground whitespace-pre-wrap">{activity.text1Title}</h2>
                {isAuthenticated && (
                  <Button size="icon" variant="secondary" onClick={() => setIsEditingTitleText1(true)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                )}
                <p className="text-muted-foreground whitespace-pre-wrap">{activity.text3}</p>
                {isAuthenticated && (
                  <Button size="icon" variant="secondary" onClick={() => setIsEditingText3(true)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}

            {activity.text4 && activity.text4.trim() !== "" && (
              <div className="mb-6">
                <h2 className="text-2xl text-muted-foreground whitespace-pre-wrap">{activity.text2Title}</h2>
                {isAuthenticated && (
                  <Button size="icon" variant="secondary" onClick={() => setIsEditingTitleText2(true)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                )}
                <p className="text-muted-foreground whitespace-pre-wrap">{activity.text4}</p>
                {isAuthenticated && (
                  <Button size="icon" variant="secondary" onClick={() => setIsEditingText4(true)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}

            {activity.text5 && activity.text5.trim() !== "" && (
              <div className="mb-6">
                <p className="text-muted-foreground whitespace-pre-wrap">{activity.text5}</p>
                {isAuthenticated && (
                  <Button size="icon" variant="secondary" onClick={() => setIsEditingText5(true)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}

            {/* Google form */}
            {activity.googleFormLink && (
              <div className="mt-6">
                <a href={activity.googleFormLink} target = "_blank">
                  <Button>
                    Prihlasit sa
                  </Button>
                </a>
              </div>
            )}

        </div>
      </main>
      <Footer />

      <EditModal
        isOpen={isEditingContent}
        onClose={() => setIsEditingContent(false)}
        title={`Upraviť ${activity.title}`}
        type="text"
        initialValue={activity.content}
        onSave={handleSaveContent}
      />

      <EditModal
        isOpen={isEditingList1}
        onClose={() => setIsEditingList1(false)}
        title={`Upraviť ${activity.list1Title}`}
        type="list"
        initialValue={activity.list1}
        onSave={handleSaveList1}
      />

      <EditModal
        isOpen={isEditingList2}
        onClose={() => setIsEditingList2(false)}
        title={`Upraviť ${activity.list2Title}`}
        type="list"
        initialValue={activity.list2}
        onSave={handleSaveList2}
      />

     <EditModal
      isOpen={isEditingTextPrihlaska}
      onClose={() => setIsEditingTextPrihlaska(false)}
      title="Upraviť text prihlasky"
      type="text"
      initialValue={activity.textPrihlaska}
      onSave={handleSaveTextPrihlaska}
    />

    
      <EditModal
      isOpen={isEditingTextAtrium}
      onClose={() => setIsEditingTextAtrium(false)}
      title="Upraviť Text atrium"
      type="text"
      initialValue={activity.textAtrium}
      onSave={handleSaveTextAtrium}
    />

    <EditModal
      isOpen={isEditingTextFinancie}
      onClose={() => setIsEditingTextFinancie(false)}
      title="Upraviť Text atrium"
      type="text"
      initialValue={activity.textAtrium}
      onSave={handleSaveTextFinancie}
    />

      <EditModal
      isOpen={isEditingText1}
      onClose={() => setIsEditingText1(false)}
      title="Upraviť Text 1"
      type="text"
      initialValue={activity.text1}
      onSave={handleSaveText1}
    />

    <EditModal
      isOpen={isEditingText2}
      onClose={() => setIsEditingText2(false)}
      title="Upraviť Text 2"
      type="text"
      initialValue={activity.text2}
      onSave={handleSaveText2}
    />

    <EditModal
      isOpen={isEditingText3}
      onClose={() => setIsEditingText3(false)}
      title="Upraviť Text 3"
      type="text"
      initialValue={activity.text3}
      onSave={handleSaveText3}
    />

    <EditModal
      isOpen={isEditingText4}
      onClose={() => setIsEditingText4(false)}
      title="Upraviť Text 4"
      type="text"
      initialValue={activity.text4}
      onSave={handleSaveText4}
    />

    <EditModal
      isOpen={isEditingText5}
      onClose={() => setIsEditingText5(false)}
      title="Upraviť Text 5"
      type="text"
      initialValue={activity.text5}
      onSave={handleSaveText5}
    />

    <EditModal
      isOpen={isEditingTitleText1}
      onClose={() => setIsEditingTitleText1(false)}
      title="Upraviť title text 1"
      type="text"
      initialValue={activity.text1Title}
      onSave={handleSaveTitleText1}
    />

    <EditModal
      isOpen={isEditingTitleText2}
      onClose={() => setIsEditingTitleText2(false)}
      title="Upraviť title text 2"
      type="text"
      initialValue={activity.text2Title}
      onSave={handleSaveTitleText2}
    />


    {isEditingPhotoIndex !== null && (
      <EditModal
        isOpen={true}
        onClose={() => setIsEditingPhotoIndex(null)} 
        title="Upraviť obrázok"
        type="image"
        initialValue={activity.photo[isEditingPhotoIndex]?.src || ""}
        onSave={(newPhotoUrl: string) => {
        handleSavePhoto(newPhotoUrl, isEditingPhotoIndex); 
        setIsEditingPhotoIndex(null); 
        }}
      />
    )}
    </div>
  );
};

export default ActivityDetail;