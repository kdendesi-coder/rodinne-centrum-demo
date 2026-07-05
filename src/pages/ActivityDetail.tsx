import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Edit2, ArrowLeft } from "lucide-react";
import EditModal from "@/components/EditModal";
import { useAuth } from "@/contexts/AuthContext";
import { useParagraph } from "@/hooks/useParagraph";

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

  const { isAuthenticated, role } = useAuth();
  const canEdit = isAuthenticated && role === "Admin";

  const backendKey = activityId
    ? `activity_detail_${activityId}`
    : "activity_detail_unknown";

  const { text: backendActivityData, setText: setBackendActivityData } =
    useParagraph(backendKey);

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
  if (!activityId) {
    setActivity(null);
    return;
  }

  if (backendActivityData && backendActivityData.trim() !== "") {
    try {
      const parsed = JSON.parse(backendActivityData);
      setActivity(parsed);
      return;
    } catch {
      console.log("Chyba pri načítaní dát z backendu");
    }
  }

  const defaultData = defaultDetailContent[activityId];

  if (defaultData) {
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
      textPrihlaska: defaultData.textPrihlaska || "",
      textAtrium: defaultData.textAtrium || "",
      fiancie: defaultData.fiancie || "",
      text1: defaultData.text1 || "",
      text2: defaultData.text2 || "",
      text1Title: defaultData.text1Title || "",
      text2Title: defaultData.text2Title || "",
      text3: defaultData.text3 || "",
      text4: defaultData.text4 || "",
      text5: defaultData.text5 || "",
    });
  } else {
    setActivity(null);
  }
}, [activityId, backendActivityData]);

  const saveActivity = async (updatedActivity: ActivityData) => {
    setActivity(updatedActivity);
    await setBackendActivityData(JSON.stringify(updatedActivity));
  };

  const handleSaveContent = async (newContent: string) => {
  if (!activity) return;

  await saveActivity({
    ...activity,
    content: newContent,
  });
};

  const handleSaveList1 = async (newList1: string[]) => {
    if (!activity) return;

    await saveActivity({
      ...activity,
      list1: newList1,
    });
  };

  const handleSaveList2 = async (newList2: string[]) => {
    if (!activity) return;

    await saveActivity({
      ...activity,
      list2: newList2,
    });
  };

  const handleSaveText1 = async (newText1: string) => {
    if (!activity) return;

    await saveActivity({
      ...activity,
      text1: newText1,
    });
  };

  const handleSaveText2 = async (newText2: string) => {
    if (!activity) return;

    await saveActivity({
      ...activity,
      text2: newText2,
    });
  };

  const handleSaveText3 = async (newText3: string) => {
    if (!activity) return;

    await saveActivity({
      ...activity,
      text3: newText3,
    });
  };

  const handleSaveText4 = async (newText4: string) => {
    if (!activity) return;

    await saveActivity({
      ...activity,
      text4: newText4,
    });
  };

  const handleSaveText5 = async (newText5: string) => {
    if (!activity) return;

    await saveActivity({
      ...activity,
      text5: newText5,
    });
  };

  const handleSaveTitleText1 = async (newTextTitle1: string) => {
    if (!activity) return;

    await saveActivity({
      ...activity,
      text1Title: newTextTitle1,
    });
  };

  const handleSaveTitleText2 = async (newTextTitle2: string) => {
    if (!activity) return;

    await saveActivity({
      ...activity,
      text2Title: newTextTitle2,
    });
  };

  const handleSaveTextPrihlaska = async (newTextPrihlaska: string) => {
    if (!activity) return;

    await saveActivity({
      ...activity,
      textPrihlaska: newTextPrihlaska,
    });
  };

  const handleSaveTextAtrium = async (newTextAtrium: string) => {
    if (!activity) return;

    await saveActivity({
      ...activity,
      textAtrium: newTextAtrium,
    });
  };

  const handleSaveTextFinancie = async (newTextFinancie: string) => {
    if (!activity) return;

    await saveActivity({
      ...activity,
      fiancie: newTextFinancie,
    });
  };

  const handleSavePhoto = async (newPhoto: string, index: number) => {
    if (!activity) return;

    const updatedPhotos = [...(activity.photo || [])];

    if (!updatedPhotos[index]) return;

    updatedPhotos[index] = {
      ...updatedPhotos[index],
      src: newPhoto,
    };

    await saveActivity({
      ...activity,
      photo: updatedPhotos,
    });
  };

  const openEditPhotoModal = (index: number) => {
    setIsEditingPhotoIndex(index);
  };

  if (!activity) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <main className="pt-24">
          <div className="w-auto max-w-[1400px] mx-auto py-12 md:py-20 px-4 sm:px-6 lg:px-8">
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
      <main className="pt-24">
        <div className="w-full max-w-[1400px] mx-auto py-12 md:py-20 px-4 sm:px-6 lg:px-8">
          {/* Back button */}
          <Button 
            variant="ghost" 
            onClick={() => navigate("/#activities")}
            className="mb-8 text-base md:text-lg"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Späť na hlavnú stránku
          </Button>

          {/* Header */}
          <h1 className="text-center text-4xl sm:text-5xl md:text-6xl font-bold mb-10 md:mb-14">
            {activity.title}
          </h1>

          {/* Editable CONTENT section */}
          <div className="bg-muted/30 rounded-3xl p-5 sm:p-8 lg:p-10 space-y-8 md:space-y-10">
            {/* Text */}
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
              <p className="text-base sm:text-lg md:text-xl xl:text-2xl leading-[1.8] text-muted-foreground whitespace-pre-wrap flex-1">
                {activity.content}
              </p>
              {canEdit && (
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
              <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-muted-foreground whitespace-pre-wrap">
                {activity.list1Title}
              </h2>
              <ul className="list-disc pl-6 space-y-2 text-base md:text-lg xl:text-xl text-muted-foreground">
                {activity.list1.map((item, index) => (
                  <li key={`list1-item-${index}`}>{item}</li>
                ))}
              </ul>
              {canEdit && (
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
              <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-muted-foreground whitespace-pre-wrap">
                {activity.list2Title}
              </h2>
              <ul className="list-disc pl-6 space-y-2 text-base md:text-lg xl:text-xl text-muted-foreground">
                {activity.list2.map((item, index) => (
                  <li key={`list2-item-${index}`}>{item}</li>
                ))}
              </ul>
              {canEdit && (
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
                  <div key={index} className="relative w-full rounded-3xl overflow-hidden aspect-[4/3] md:aspect-[16/9] shadow-md">
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      className="w-full h-full object-cover"
                    />
                    {canEdit && (
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
                <p className="text-base md:text-lg xl:text-xl leading-[1.8] text-muted-foreground whitespace-pre-wrap">
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
                {canEdit && (
                  <Button size="icon" variant="secondary" onClick={() => setIsEditingTextPrihlaska(true)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}

            {/* Text atrium projekt */}
            {activity.textAtrium && activity.textAtrium.trim() !== "" && (
              <div className="mb-6">
                <p className="text-base md:text-lg xl:text-xl leading-[1.8] text-muted-foreground whitespace-pre-wrap">{activity.textAtrium}</p>
                {canEdit && (
                  <Button size="icon" variant="secondary" onClick={() => setIsEditingTextAtrium(true)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                )}
                
              </div>
            )}

            {/* Text atrium financie */}
            {activity.fiancie && activity.fiancie.trim() !== "" && (
              <div className="mb-6">
                <p className="text-base md:text-lg xl:text-xl leading-[1.8] text-muted-foreground whitespace-pre-wrap">{activity.fiancie}</p>
                {canEdit && (
                  <Button size="icon" variant="secondary" onClick={() => setIsEditingTextFinancie(true)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                )}
                
              </div>
            )}


             {/* Text */}
            {activity.text1 && activity.text1.trim() !== "" && (
              <div className="mb-6">
                <p className="text-base md:text-lg xl:text-xl leading-[1.8] text-muted-foreground whitespace-pre-wrap">{activity.text1}</p>
                {canEdit && (
                  <Button size="icon" variant="secondary" onClick={() => setIsEditingText1(true)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                )}
                
              </div>
            )}

            {activity.text2 && activity.text2.trim() !== "" && (
              <div className="mb-6">
                <p className="text-base md:text-lg xl:text-xl leading-[1.8] text-muted-foreground whitespace-pre-wrap">{activity.text2}</p>
                {canEdit && (
                  <Button size="icon" variant="secondary" onClick={() => setIsEditingText2(true)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}


            {activity.text3 && activity.text3.trim() !== "" && (
              <div className="mb-6">
                <h2 className="text-2xl md:text-3xl text-muted-foreground whitespace-pre-wrap">{activity.text1Title}</h2>
                {canEdit && (
                  <Button size="icon" variant="secondary" onClick={() => setIsEditingTitleText1(true)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                )}
                <p className="text-base md:text-lg xl:text-xl leading-[1.8] text-muted-foreground whitespace-pre-wrap">{activity.text3}</p>
                {canEdit && (
                  <Button size="icon" variant="secondary" onClick={() => setIsEditingText3(true)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}

            {activity.text4 && activity.text4.trim() !== "" && (
              <div className="mb-6">
                <h2 className="text-2xl md:text-3xl text-muted-foreground whitespace-pre-wrap">{activity.text2Title}</h2>
                {canEdit && (
                  <Button size="icon" variant="secondary" onClick={() => setIsEditingTitleText2(true)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                )}
                <p className="text-base md:text-lg xl:text-xl leading-[1.8] text-muted-foreground whitespace-pre-wrap">{activity.text4}</p>
                {canEdit  && (
                  <Button size="icon" variant="secondary" onClick={() => setIsEditingText4(true)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}

            {activity.text5 && activity.text5.trim() !== "" && (
              <div className="mb-6">
                <p className="text-base md:text-lg xl:text-xl leading-[1.8] text-muted-foreground whitespace-pre-wrap">{activity.text5}</p>
                {canEdit && (
                  <Button size="icon" variant="secondary" onClick={() => setIsEditingText5(true)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}


             <div className="mt-10 flex flex-col sm:flex-row gap-4 items-start">
              <Button
                variant="secondary"
                className="bg-[#DBD4CE] hover:bg-[#DBD4CE] text-[#210F0080] rounded-xl px-6 py-3 md:text-lg font-semibold"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/program");
                }}
              >
                Pozrieť si program
              </Button>

            <a href="https://docs.google.com/forms/d/e/1FAIpQLSfqm51JNlBk0HdOyG2RoZsianKgNvZ6uSajSdtS7Yv5l0AJZw/closedform" target="_blank" rel="noopener noreferrer">
              <Button className="rounded-xl px-6 py-3 text-base md:text-lg font-semibold">
                Prihlasovanie do Átria Dobrého pastiera
              </Button>
            </a>

            </div>
           
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
      isOpen={isEditingTextFinancie}
      onClose={() => setIsEditingTextFinancie(false)}
      title="Upraviť financie"
      type="text"
      initialValue={activity.fiancie || ""}
      onSave={handleSaveTextFinancie}
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
        initialValue={[activity.photo?.[isEditingPhotoIndex]?.src || ""]}
        onSave={async (files) => {
          if (files[0]) {
            await handleSavePhoto(files[0], isEditingPhotoIndex);
          }

          setIsEditingPhotoIndex(null);
        }}
      />
    )}
    </div>
  );
};

export default ActivityDetail;