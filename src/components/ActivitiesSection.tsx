import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Edit2, ChevronDown, Plus } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import EditModal from "./EditModal";
import AddActivityModal from "./AddActivityModal";
import { useAuth } from "@/contexts/AuthContext"; // Add this import
import { Item } from "@radix-ui/react-accordion";
import { title } from "process";



interface Activity {
  id: string;
  title: string;
  content: string;
  icon?: string;
}

//povodne data
const aktivity = {
  herna: [
    { title: "Hravá angličtina" },
    { title: "Montessori hernička" },
    { title: "Detské tvorivé dielne" },
    { title: "Klavírna víla – Boinka" },
    { title: "Katechézy Dobrého pastiera" },
  ],

  atrium: [
    { title: "....."},
    { title: "....."}
  ],

  klubik: [
    { title: "....."},
    { title: "....."}
  ]
};

const prednasky = {
  herna: [
    {title: "Tehotenstvo a pôrod", 
      items: [ "Príprava na pôrod s dulou", "Fyzioterapeutka Radka"]
    },

    {title: "Ženské zdravie a starostlivosť", 
      items: [ "Staráme sa o seba s kozmetičkou", "Ženský cyklus – ako sa v ňom dobre vyznať"]
    },

    {title: "Starostlivosť o bábätko a deti", 
      items: [ "Zdravie našich detí s pani pediatričkou", "Učíme sa rozprávať s pani logopedičkou"]
    },

    {title: "Rozhovory a skúsenosti", 
      items: [ "Svedectvá mnohodetných rodín", "O kváskovaní"]
    },
  ],

  atrium: [
    {title: ".............", 
      items: [ "........", "........."]
    }
  ],

  klubik: [
    {title: "Rozvoj detí", 
      items: [ "Hry na rozvoj motoriky", "Spoločné aktivity"]
    }
  ]
};

const dalsiePrednasky = {
  herna: "A iné",
  atrium: "A dalšie stretnutia",
  klubik: "A dalšie aktivity",
};

const rozvrh = {
  herna: {
    den: "Streda",
    cas: "9:00 - 12:00",
    zaciatok: "Zaciatok programu o 10:00",
  },

  atrium: {
    den: "Piatok",
    cas: "15:00 - 17:00",
    zaciatok: "Zaciatok programu o 15:30",
  },

  klubik: {
    den: "Pondelok",
    cas: "16:00 - 18:00",
    zaciatok: "Zaciatok programu o 16:30",
  }
};


const ActivitiesSection = () => {
  const navigate = useNavigate();
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: "herna",
      title: "Herňa",
      icon: "/herna.jpg",
      content: "Herňa je otvorená pre mamičky a deti každú stredu (okrem prázdnin a sviatkov) od 9:00 h do 12:00 h, program (detská aktivita alebo prednáška) začína o 10:00 h spoločnou modlitbou. Počas programu je k dispozícii spovedná služba a knižnica. ",
    },
    {
      id: "atrium",
      title: "Átrium",
      icon: "/atrium.jpg",
      content: "Átrium je miesto, kde sa deti zoznamujú so základnými pravdami viery cez koncept Katechéz Dobrého pastiera, ktorý je postavený na pedagogických princípoch Márie Montessori a teologických znalostiach Sofie Cavalleti. Deti sú privádzané k modlitbe a poznávaniu Boha, učia sa rozumieť bohatstvu liturgie a poznať Sväté písmo spôsobom pre nich vhodným. ",
    },
    {
      id: "klubik",
      title: "Klubík",
      icon: "/klubik.jpg",
      content: "Klub detí je priestor, kde sa stretávajú deti a v malej skupine s podporou sprievodcov majú možnosť objavovať, učiť sa a rásť v bezpečnom prostredí.",
    },
  ]);


  const [openItems, setOpenItems] = useState<string[]>(["herna"]);
  const [editingActivity, setEditingActivity] = useState<string | null>(null);
  const [isEditingImage, setIsEditingImage] = useState(false);
  const [isAddingActivity, setIsAddingActivity] = useState(false);
  const [image, setImage] = useState("logosirotarPaint.png");

  const [childActivities, setChildActivities] = useState<typeof aktivity>(aktivity);
  const [lectures, setLectures] = useState<typeof prednasky>(prednasky);
  const [schedule, setSchedule] = useState<typeof rozvrh>(rozvrh);

  const toggleItem = (id: string) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  
  const handleSaveActivity = (id: string, newContent: string) => {
  const updated = activities.map(activity =>
    activity.id === id ? { ...activity, content: newContent } : activity
  );
  setActivities(updated);
  localStorage.setItem("activities", JSON.stringify(updated)); 
};

  const handleAddActivity = (title: string, content: string) => {
    const id = title.toLowerCase().replace(/\s+/g, '-');
    setActivities((prev) => [...prev, { id, title, content, icon: "/icons/herna.png", }]);
  };

  // Aktivity pre deti
  const handleAddChildActivity = (activityId: string) => {
    const title = prompt("Nová aktivita pre deti") || "Nová aktivita";
    setChildActivities(prev => {
      const updated = {
        ...prev,
        [activityId]: [...(prev[activityId] || []), { title }]
      };
      localStorage.setItem("childActivities", JSON.stringify(updated)); 
      return updated;
      });
  };

  const handleEditChildActivity = (activityId: string, index: number) => {
    const newTitle = prompt("Nový názov aktivity", childActivities[activityId][index].title) 
                      || childActivities[activityId][index].title;
    setChildActivities(prev => {
      const updated = [...prev[activityId]];
      updated[index] = { title: newTitle };
      const newState = { ...prev, [activityId]: updated };
      localStorage.setItem("childActivities", JSON.stringify(newState)); 
      return newState;
    });
  };

  const handleDeleteChildActivity = (activityId: string, index: number) => {
    setChildActivities(prev => {
      const newState = {
        ...prev,
        [activityId]: prev[activityId].filter((_, i) => i !== index)
      };
      localStorage.setItem("childActivities", JSON.stringify(newState)); 
      return newState;
    });
  };

  // Prednašky
  const handleAddLecture = (activityId: string) => {
    const title = prompt("Názov novej prednášky") || "Nová prednáška";
    setLectures(prev => {
      const updated = {
        ...prev,
        [activityId]: [...(prev[activityId] || []), { title, items: [] }]
      };
      localStorage.setItem("lectures", JSON.stringify(updated)); 
      return updated;
    });
  };

    const handleEditLecture = (activityId: string, index: number) => {
    const lecture = lectures[activityId][index];
    const newTitle = prompt("Nový názov prednášky", lecture.title) || lecture.title;
    setLectures(prev => {
      const updatedArray = [...prev[activityId]];
      updatedArray[index] = { ...lecture, title: newTitle };
      const updated = { ...prev, [activityId]: updatedArray };
      localStorage.setItem("lectures", JSON.stringify(updated)); 
      return updated;
    });
  };

    const handleAddLectureItem = (activityId: string, lectureIndex: number) => {
  const newItem = prompt("Nový obsah prednášky") || "Nová položka";
  setLectures(prev => {
    const updatedLectures = [...prev[activityId]];
    updatedLectures[lectureIndex].items = [
      ...(updatedLectures[lectureIndex].items || []),
      newItem
    ];
    const updated = { ...prev, [activityId]: updatedLectures };
    localStorage.setItem("lectures", JSON.stringify(updated));
    return updated;
  });
};


    const handleEditLectureItem = (activityId: string, lectureIndex: number, itemIndex: number) => {
    const currentItem = lectures[activityId][lectureIndex].items[itemIndex];
    const newItem = prompt("Upraviť obsah prednášky", currentItem) || currentItem;
    setLectures(prev => {
      const updatedLectures = [...prev[activityId]];
      const updatedItems = [...updatedLectures[lectureIndex].items];
      updatedItems[itemIndex] = newItem;
      updatedLectures[lectureIndex].items = updatedItems;
      const updated = { ...prev, [activityId]: updatedLectures };
      localStorage.setItem("lectures", JSON.stringify(updated));
      return updated;
    });
  };

    const handleDeleteLecture = (activityId: string, index: number) => {
    setLectures(prev => {
      const updated = {
        ...prev,
        [activityId]: prev[activityId].filter((_, i) => i !== index)
      };
      localStorage.setItem("lectures", JSON.stringify(updated)); 
      return updated;
    });
  };

  // Rozvrh
  const handleEditSchedule = (activityId: string) => {
    const sch = schedule[activityId];
    if (!sch) return;

    const den = prompt("Deň:", sch.den) || sch.den;
    const cas = prompt("Čas:", sch.cas) || sch.cas;
    const zaciatok = prompt("Začiatok programu:", sch.zaciatok) || sch.zaciatok;

    setSchedule(prev => {
      const updated = { ...prev, [activityId]: { den, cas, zaciatok } };
      localStorage.setItem("schedule", JSON.stringify(updated)); // pridať túto riadku
      return updated;
    });
  };

  // Add this to check authentication
  const { isAuthenticated, role } = useAuth();

  useEffect(() => {
  const savedActivities = localStorage.getItem("activities");
  if (savedActivities) setActivities(JSON.parse(savedActivities));

  const savedChildActivities = localStorage.getItem("childActivities");
  if (savedChildActivities) setChildActivities(JSON.parse(savedChildActivities));

  const savedLectures = localStorage.getItem("lectures");
  if (savedLectures) setLectures(JSON.parse(savedLectures));

  const savedSchedule = localStorage.getItem("schedule");
  if (savedSchedule) setSchedule(JSON.parse(savedSchedule));
}, []);
  

  return (
    <section id="activities" className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 sm:mb-12">Aktivity</h2>

        <div className="grid gap-12
                        grid-cols-1
                        md:grid-cols-[25%_75%]
                        lg:grid-cols-[20%_80%]">

          {/* Left side - Image */}
          <div className="relative group bg-transparent rounded-lg overflow-hidden
                flex-shrink-0
                w-96 h-96 sm:w-96 sm:h-96 md:w-96 md:h-96
                flex items-center justify-center -ml-16">
            {image ? (
              <img src={image} alt="Activities" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center p-8">
                <svg
                  className="w-32 h-32 mx-auto text-muted-foreground mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
            )}
            {/* Show edit button only for Admin users */}
              {isAuthenticated && role === "Admin" && (
              <Button
                size="icon"
                variant="secondary"
                className="edit-button"
                onClick={() => setIsEditingImage(true)}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            )}
          </div>


          {/* Right side - Content */}
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Naše aktivity</h3>
              {/* Show edit button only for Admin users */}
              {isAuthenticated && role === "Admin" && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsAddingActivity(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Pridať aktivitu
                </Button>
              )}
            </div>

            {/* Collapsible sections with connecting line */}
            <div className="relative pl-4">
            
              <div className="space-y-2">
                {activities.map((activity, index) => (
                  <Collapsible
                    key={activity.id}
                    open={openItems.includes(activity.id)}
                    onOpenChange={() => toggleItem(activity.id)}
                  >
                    <div className="relative pl-8">
                      <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-[#E0DAD5] border-[3px] " />


                      <CollapsibleTrigger 
                          className={`flex items-center justify-between 
                                      w-full px-6 py-4 
                                      text-left font-medium transition-all duration-200
                                      hover:bg-muted/50 
                                      bg-[#F4E9E2]
                                      shadow-[0_2px_5px_rgba(0,0,0,0.2)]
                                      ${openItems.includes(activity.id) ? "rounded-t-lg" : "rounded-lg"}`}
                        >
                        <div className="flex item-center gap-4">

                          <img 
                            src={activity.icon}
                            alt={activity.title}
                            className="w-8 h-8 object-contain"
                          />

                          <span>{activity.title}</span>
                        </div>

                        <ChevronDown
                          className={`h-5 w-5 transition-transform duration-200 ${
                            openItems.includes(activity.id) ? "rotate-180" : ""
                          }`}
                        />
                      </CollapsibleTrigger>
                      
                      <CollapsibleContent className="data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up overflow-hidden bg-[#F4E9E2] rounded-b-lg">
                        <div className="relative group/content p-6 flex flex-col gap-6 w-full">

                        {/* Hlavny text */}
                          <p className="text-sm sm:text-sm md:text-base text-[#210F00] leading-relaxed">
                            {activity.content}
                          </p>

                          {/* Aktivity pre deti */}
                          <div className="bg-[#F9F2EC] rounded-lg w-full border-l-4 border-[#B0C9D6] p-4">
                            <h3 className="text-lg font-semibold text-[#5E7322] mb-4">
                              Aktivity pre deti
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {childActivities[activity.id]?.map((activita, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between bg-[#DEE2D2] rounded-[1rem] px-4 py-2"
                              >
                                <span className="text-sm font-medium">{activita.title}</span>

                                {isAuthenticated && role === "Admin" && (
                                  <div className="flex gap-1 ml-2">
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      onClick={() => handleEditChildActivity(activity.id, index)}
                                    >
                                      <Edit2 className="h-3 w-3" />
                                    </Button>
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      onClick={() => handleDeleteChildActivity(activity.id, index)}
                                    >
                                      <img 
                                            src="/icons/close.png"
                                            alt="add"
                                            className="w-4 h-4"
                                            />
                                    </Button>
                                  </div>
                                )}
                              </div>
                            ))}

                            {isAuthenticated && role === "Admin" && (
                              <Button
                                size="sm"
                                className="mt-2 flex items-center gap-1"
                                onClick={() => handleAddChildActivity(activity.id)}
                              >
                                <Plus className="h-4 w-4" /> Pridať aktivitu
                              </Button>
                            )}
                          </div>
                          </div>


                          {/* Prednasky pre mamicky */}
                          <div className="bg-[#F9F2EC] rounded-lg w-full border-l-4 border-[#B0C9D6] p-5">
                            <h3 className="text-lg font-semibold text-[#5E7322] mb-3">
                              Prednášky pre mamičky
                            </h3>

                            <div className="grid md:grid-cols-2 gap-4">
                              {lectures[activity.id]?.map((lecture, i) => (
                                <div
                                  key={i}
                                  className="bg-[#DEE2D2] rounded-xl p-4 flex flex-col gap-2"
                                >
                                  <div className="flex justify-between items-start">
                                    <h4 className="text-[#5E7322] font-semibold">{lecture.title}</h4>

                                    {isAuthenticated && role === "Admin" && (
                                      <div className="flex gap-1">
                                        {/* Upraviť nazov prednašky */}
                                        <Button
                                          size="icon"
                                          variant="ghost"
                                          onClick={() => handleEditLecture(activity.id, i)}
                                        >
                                          <Edit2 className="h-4 w-4" />
                                        </Button>

                                        {/* Odstranit prednasku */}
                                        <Button
                                          size="icon"
                                          variant="ghost"
                                          onClick={() => handleDeleteLecture(activity.id, i)}
                                        >
                                          <img 
                                            src="/icons/close.png"
                                            alt="add"
                                            className="w-4 h-4"
                                            />
                                        </Button>

                                        {/* Pridat bod do prednasky */}
                                        <Button
                                          size="icon"
                                          variant="ghost"
                                          onClick={() => {
                                            const newItem = prompt("Nový bod prednášky") || "";
                                            if (!newItem) return;
                                            setLectures(prev => {
                                              const updated = [...prev[activity.id]];
                                              updated[i] = {
                                                ...lecture,
                                                items: [...(lecture.items || []), newItem],
                                              };
                                              return { ...prev, [activity.id]: updated };
                                            });
                                          }}
                                        >
                                          <img 
                                            src="/icons/plus.png"
                                            alt="add"
                                            className="w-4 h-4"
                                            />
                                        </Button>
                                      </div>
                                    )}
                                  </div>

                                  {/* Body prednasky s bodkami */}
                                  {lecture.items && lecture.items.length > 0 && (
                                    <ul className="list-disc list-inside text-[#210F00] text-sm space-y-1">
                                      {lecture.items.map((item, j) => (
                                        <li key={j}>{item}</li>
                                      ))}
                                    </ul>
                                  )}
                                </div>
                              ))}

                              {/* Pridat novu prednasku */}
                              {isAuthenticated && role === "Admin" && (
                                <Button
                                  size="sm"
                                  className="mt-2 flex items-center gap-1"
                                  onClick={() => handleAddLecture(activity.id)}
                                >
                                  <Plus className="h-4 w-4" /> Pridať prednášku
                                </Button>
                              )}
                            </div>

                            {/* Dodatocny text pod prednaskami */}
                            <div className="text-[#5E7322] font-semibold mt-2 bg-[#DEE2D2] rounded-xl p-4 shadow-sm">
                              {dalsiePrednasky[activity.id]}
                            </div>
                          </div>

                          {/* Rozvrh */}
                            <div className="bg-[#F9F2EC] rounded-xl p-4 flex flex-col items-start gap-2 w-fit relative">
                              <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M12 8v4l3 3M12 2a10 10 0 100 20 10 10 0 000-20z"/>
                              </svg>

                              <div className="text-sm">
                                <div className="text-sm font-semibold">
                                  {schedule[activity.id]?.den}{" "}
                                  <span className="text-[#5E7322]">{schedule[activity.id]?.cas}</span>
                                </div>

                                <div className="text-gray-600">{schedule[activity.id]?.zaciatok}</div>
                              </div>

                              {/* Admin tlacidlo – absolutne umiestnene */}
                              {isAuthenticated && role === "Admin" && (
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  className="absolute top-2 right-2"
                                  onClick={() => handleEditSchedule(activity.id)}
                                >
                                  <Edit2 className="h-4 w-4 mr-1" /> Upraviť
                                </Button>
                              )}
                            </div>



                          <div className="flex flex-col sm:flex-row gap-3 mt-4">
                            <Button 
                              variant="link"
                              className="bg-[#F3953F] hover:bg-[#e07d2f] text-white rounded-xl px-4 py-2 sm:px-6 sm:py-3 font-semibold"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/aktivita/${activity.id}`);
                              }}
                            >
                              Čítať viac
                            </Button>

                             <Button
                                variant="secondary"
                                className="bg-[#DBD4CE] hover:bg-[#DBD4CE] text-[#210F0080] rounded-xl px-6 py-2 font-semibold"
                              >
                                Pozrieť si program
                              </Button>
                          </div>

                          
                          
                          {/* Show edit button only for Admin users */}
                          {isAuthenticated && role === "Admin" && (
                            <Button
                              size="icon"
                              variant="secondary"
                              className="absolute top-2 right-2 opacity-0 group-hover/content:opacity-100 transition-opacity h-7 w-7"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingActivity(activity.id);
                              }}
                            >
                              <Edit2 className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </CollapsibleContent>
                    </div>
                  </Collapsible>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <AddActivityModal
        isOpen={isAddingActivity}
        onClose={() => setIsAddingActivity(false)}
        onSave={handleAddActivity}
      />

      <EditModal
        isOpen={isEditingImage}
        onClose={() => setIsEditingImage(false)}
        title="Edit Activities Image"
        type="image"
        initialValue={image}
        onSave={setImage}
      />
      {editingActivity && (
        <EditModal
          isOpen={true}
          onClose={() => setEditingActivity(null)}
          title={`Edit ${activities.find((a) => a.id === editingActivity)?.title}`}
          type="text"
          initialValue={
            activities.find((a) => a.id === editingActivity)?.content || ""
          }
          onSave={(content) => handleSaveActivity(editingActivity, content)}
        />
      )}
    </section>
  );
};

export default ActivitiesSection;
