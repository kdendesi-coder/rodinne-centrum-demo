import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Edit2, ChevronDown, Plus } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import EditModal from "./EditModal";
import AddActivityModal from "./AddActivityModal";
import { useAuth } from "@/contexts/AuthContext";
import { useParagraph } from "@/hooks/useParagraph";

interface Activity {
  id: string;
  title: string;
  content: string;
  icon?: string;
}

interface ChildActivity {
  title: string;
}

interface Lecture {
  title: string;
  items: string[];
}

interface ScheduleItem {
  den: string;
  cas: string;
  zaciatok: string;
}

type ChildActivities = Record<string, ChildActivity[]>;
type Lectures = Record<string, Lecture[]>;
type Schedule = Record<string, ScheduleItem>;

const defaultActivities: Activity[] = [
  {
    id: "herna",
    title: "Herňa",
    icon: "/herna.jpg",
    content:
      "Herňa je otvorená pre mamičky a deti každú stredu (okrem prázdnin a sviatkov) od 9:00 h do 12:00 h, program (detská aktivita alebo prednáška) začína o 10:00 h spoločnou modlitbou. Počas programu je k dispozícii spovedná služba a knižnica.",
  },
  {
    id: "atrium",
    title: "Átrium",
    icon: "/atrium.jpg",
    content:
      "Átrium je miesto, kde sa deti zoznamujú so základnými pravdami viery cez koncept Katechéz Dobrého pastiera, ktorý je postavený na pedagogických princípoch Márie Montessori a teologických znalostiach Sofie Cavalleti. Deti sú privádzané k modlitbe a poznávaniu Boha, učia sa rozumieť bohatstvu liturgie a poznať Sväté písmo spôsobom pre nich vhodným.",
  },
  {
    id: "klubik",
    title: "Klubík",
    icon: "/klubik.jpg",
    content:
      "Klub detí je priestor, kde sa stretávajú deti a v malej skupine s podporou sprievodcov majú možnosť objavovať, učiť sa a rásť v bezpečnom prostredí.",
  },
];

const defaultChildActivities: ChildActivities = {
  herna: [
    { title: "Hravá angličtina" },
    { title: "Montessori hernička" },
    { title: "Detské tvorivé dielne" },
    { title: "Klavírna víla – Boinka" },
    { title: "Katechézy Dobrého pastiera" },
  ],
  atrium: [{ title: "....." }, { title: "....." }],
  klubik: [{ title: "....." }, { title: "....." }],
};

const defaultLectures: Lectures = {
  herna: [
    {
      title: "Tehotenstvo a pôrod",
      items: ["Príprava na pôrod s dulou", "Fyzioterapeutka Radka"],
    },
    {
      title: "Ženské zdravie a starostlivosť",
      items: [
        "Staráme sa o seba s kozmetičkou",
        "Ženský cyklus – ako sa v ňom dobre vyznať",
      ],
    },
    {
      title: "Starostlivosť o bábätko a deti",
      items: [
        "Zdravie našich detí s pani pediatričkou",
        "Učíme sa rozprávať s pani logopedičkou",
      ],
    },
    {
      title: "Rozhovory a skúsenosti",
      items: ["Svedectvá mnohodetných rodín", "O kváskovaní"],
    },
  ],
  atrium: [
    {
      title: ".............",
      items: ["........", "........."],
    },
  ],
  klubik: [
    {
      title: "Rozvoj detí",
      items: ["Hry na rozvoj motoriky", "Spoločné aktivity"],
    },
  ],
};

const defaultSchedule: Schedule = {
  herna: {
    den: "Streda",
    cas: "9:00 - 12:00",
    zaciatok: "Začiatok programu o 10:00",
  },
  atrium: {
    den: "Piatok",
    cas: "15:00 - 17:00",
    zaciatok: "Začiatok programu o 15:30",
  },
  klubik: {
    den: "Pondelok",
    cas: "16:00 - 18:00",
    zaciatok: "Začiatok programu o 16:30",
  },
};

const dalsiePrednasky: Record<string, string> = {
  herna: "A iné",
  atrium: "A ďalšie stretnutia",
  klubik: "A ďalšie aktivity",
};

const safeJsonParse = <T,>(value: string | null | undefined, fallback: T): T => {
  if (!value) return fallback;

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

const ActivitiesSection = () => {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLElement | null>(null);
  const { isAuthenticated, role } = useAuth();

  const { text: activitiesImage, setText: setActivitiesImage } =
    useParagraph("activities_image");

  const { text: activitiesData, setText: setActivitiesData } =
    useParagraph("activities_data");

  const { text: childActivitiesData, setText: setChildActivitiesData } =
    useParagraph("child_activities_data");

  const { text: lecturesData, setText: setLecturesData } =
    useParagraph("lectures_data");

  const { text: scheduleData, setText: setScheduleData } =
    useParagraph("schedule_data");

  const image =
    activitiesImage && activitiesImage.startsWith("data:image")
      ? activitiesImage
      : "/logosirotarPaint.png";

  const [activities, setActivities] = useState<Activity[]>(defaultActivities);
  const [childActivities, setChildActivities] =
    useState<ChildActivities>(defaultChildActivities);
  const [lectures, setLectures] = useState<Lectures>(defaultLectures);
  const [schedule, setSchedule] = useState<Schedule>(defaultSchedule);

  const [openItems, setOpenItems] = useState<string[]>([]);
  const [editingActivity, setEditingActivity] = useState<string | null>(null);
  const [isEditingImage, setIsEditingImage] = useState(false);
  const [isAddingActivity, setIsAddingActivity] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setOpenItems(["herna", "atrium", "klubik"]);
    }, 200);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    setActivities(safeJsonParse<Activity[]>(activitiesData, defaultActivities));
  }, [activitiesData]);

  useEffect(() => {
    setChildActivities(
      safeJsonParse<ChildActivities>(childActivitiesData, defaultChildActivities)
    );
  }, [childActivitiesData]);

  useEffect(() => {
    setLectures(safeJsonParse<Lectures>(lecturesData, defaultLectures));
  }, [lecturesData]);

  useEffect(() => {
    setSchedule(safeJsonParse<Schedule>(scheduleData, defaultSchedule));
  }, [scheduleData]);

  const saveActivities = async (updated: Activity[]) => {
    setActivities(updated);
    await setActivitiesData(JSON.stringify(updated));
  };

  const saveChildActivities = async (updated: ChildActivities) => {
    setChildActivities(updated);
    await setChildActivitiesData(JSON.stringify(updated));
  };

  const saveLectures = async (updated: Lectures) => {
    setLectures(updated);
    await setLecturesData(JSON.stringify(updated));
  };

  const saveSchedule = async (updated: Schedule) => {
    setSchedule(updated);
    await setScheduleData(JSON.stringify(updated));
  };

  const toggleItem = (id: string) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSaveActivity = async (id: string, newContent: string) => {
    const updated = activities.map((activity) =>
      activity.id === id ? { ...activity, content: newContent } : activity
    );

    await saveActivities(updated);
  };

  const handleAddActivity = async (title: string, content: string) => {
    const id = title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    const updatedActivities = [
      ...activities,
      {
        id,
        title,
        content,
        icon: "/herna.jpg",
      },
    ];

    await saveActivities(updatedActivities);

    await saveChildActivities({
      ...childActivities,
      [id]: [],
    });

    await saveLectures({
      ...lectures,
      [id]: [],
    });

    await saveSchedule({
      ...schedule,
      [id]: {
        den: "Deň",
        cas: "Čas",
        zaciatok: "Začiatok programu",
      },
    });

    setOpenItems((prev) => [...prev, id]);
    setIsAddingActivity(false);
  };

  const handleAddChildActivity = async (activityId: string) => {
    const title = prompt("Nová aktivita pre deti") || "Nová aktivita";

    const updated = {
      ...childActivities,
      [activityId]: [...(childActivities[activityId] || []), { title }],
    };

    await saveChildActivities(updated);
  };

  const handleEditChildActivity = async (activityId: string, index: number) => {
    const currentTitle = childActivities[activityId]?.[index]?.title;
    if (!currentTitle) return;

    const newTitle = prompt("Nový názov aktivity", currentTitle) || currentTitle;

    const updatedArray = [...(childActivities[activityId] || [])];
    updatedArray[index] = { title: newTitle };

    await saveChildActivities({
      ...childActivities,
      [activityId]: updatedArray,
    });
  };

  const handleDeleteChildActivity = async (activityId: string, index: number) => {
    const updated = {
      ...childActivities,
      [activityId]: (childActivities[activityId] || []).filter(
        (_, i) => i !== index
      ),
    };

    await saveChildActivities(updated);
  };

  const handleAddLecture = async (activityId: string) => {
    const title = prompt("Názov novej prednášky") || "Nová prednáška";

    const updated = {
      ...lectures,
      [activityId]: [...(lectures[activityId] || []), { title, items: [] }],
    };

    await saveLectures(updated);
  };

  const handleEditLecture = async (activityId: string, index: number) => {
    const lecture = lectures[activityId]?.[index];
    if (!lecture) return;

    const newTitle = prompt("Nový názov prednášky", lecture.title) || lecture.title;

    const updatedArray = [...(lectures[activityId] || [])];
    updatedArray[index] = { ...lecture, title: newTitle };

    await saveLectures({
      ...lectures,
      [activityId]: updatedArray,
    });
  };

  const handleDeleteLecture = async (activityId: string, index: number) => {
    const updated = {
      ...lectures,
      [activityId]: (lectures[activityId] || []).filter((_, i) => i !== index),
    };

    await saveLectures(updated);
  };

  const handleAddLectureItem = async (
    activityId: string,
    lectureIndex: number
  ) => {
    const newItem = prompt("Nový bod prednášky") || "";
    if (!newItem) return;

    const updatedArray = [...(lectures[activityId] || [])];

    const currentLecture = updatedArray[lectureIndex];
    if (!currentLecture) return;

    updatedArray[lectureIndex] = {
      ...currentLecture,
      items: [...(currentLecture.items || []), newItem],
    };

    await saveLectures({
      ...lectures,
      [activityId]: updatedArray,
    });
  };

  const handleEditSchedule = async (activityId: string) => {
    const sch = schedule[activityId];
    if (!sch) return;

    const den = prompt("Deň:", sch.den) || sch.den;
    const cas = prompt("Čas:", sch.cas) || sch.cas;
    const zaciatok = prompt("Začiatok programu:", sch.zaciatok) || sch.zaciatok;

    await saveSchedule({
      ...schedule,
      [activityId]: { den, cas, zaciatok },
    });
  };

  return (
    <section
      id="activities"
      ref={sectionRef}
      className="py-12 md:py-20 px-4 bg-muted/30 overflow-hidden"
    >
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-8">
          Aktivity
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8 lg:gap-10 items-start">
          <div className="relative group bg-transparent rounded-lg overflow-hidden w-full max-w-[380px] sm:max-w-[520px] md:max-w-[620px] lg:max-w-[650px] xl:max-w-[750px] aspect-square mx-auto lg:mx-0 flex items-center justify-center">
            {image ? (
              <img
                src={image}
                alt="Activities"
                className="w-full h-full object-contain"
              />
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

          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <h3 className="text-2xl md:text-3xl xl:text-4xl font-semibold">
                Naše aktivity
              </h3>

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

            <div className="relative pl-0 sm:pl-4">
              <div className="space-y-2">
                {activities.map((activity) => (
                  <Collapsible
                    key={activity.id}
                    open={openItems.includes(activity.id)}
                    onOpenChange={() => toggleItem(activity.id)}
                  >
                    <div className="relative pl-5 sm:pl-8">
                      <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-[#E0DAD5] border-[3px]" />

                      <CollapsibleTrigger
                        className={`flex items-center justify-between w-full px-6 lg:px-8 py-5 lg:py-7 text-left text-lg md:text-xl xl:text-2xl font-medium transition-all duration-200 bg-[#F4E9E2] shadow-[0_2px_5px_rgba(0,0,0,0.2)] ${
                          openItems.includes(activity.id)
                            ? "rounded-t-lg"
                            : "rounded-lg"
                        }`}
                      >
                        <div className="flex items-center gap-4 sm:gap-5 min-w-0">
                          <img
                            src={activity.icon || "/herna.jpg"}
                            alt={activity.title}
                            className="w-10 h-10 md:w-12 md:h-12 object-contain"
                          />

                          <span className="truncate">{activity.title}</span>
                        </div>

                        <ChevronDown
                          className={`h-5 w-5 transition-transform duration-200 ${
                            openItems.includes(activity.id) ? "rotate-180" : ""
                          }`}
                        />
                      </CollapsibleTrigger>

                      <CollapsibleContent className="data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up overflow-hidden bg-[#F4E9E2] rounded-b-lg">
                        <div className="relative group/content p-5 sm:p-7 lg:p-10 flex flex-col gap-8 lg:gap-10 w-full">
                          <p className="text-base md:text-lg xl:text-xl text-[#210F00] leading-[1.8]">
                            {activity.content}
                          </p>

                          <div className="bg-[#F9F2EC] rounded-xl w-full border-l-4 border-[#B0C9D6] p-5 lg:p-7">
                            <h3 className="text-xl md:text-2xl xl:text-3xl font-semibold text-[#5E7322] mb-5">
                              Aktivity pre deti
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                              {(childActivities[activity.id] || []).map(
                                (activita, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center justify-between bg-[#DEE2D2] rounded-[1rem] px-5 py-3 lg:px-6 lg:py-4"
                                  >
                                    <span className="text-lg md:text-xl xl:text-2xl font-medium">
                                      {activita.title}
                                    </span>

                                    {isAuthenticated && role === "Admin" && (
                                      <div className="flex gap-1 ml-2">
                                        <Button
                                          size="icon"
                                          variant="ghost"
                                          onClick={() =>
                                            handleEditChildActivity(
                                              activity.id,
                                              index
                                            )
                                          }
                                        >
                                          <Edit2 className="h-3 w-3" />
                                        </Button>

                                        <Button
                                          size="icon"
                                          variant="ghost"
                                          onClick={() =>
                                            handleDeleteChildActivity(
                                              activity.id,
                                              index
                                            )
                                          }
                                        >
                                          <img
                                            src="/close.jpg"
                                            alt="delete"
                                            className="w-4 h-4"
                                          />
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                )
                              )}

                              {isAuthenticated && role === "Admin" && (
                                <Button
                                  size="sm"
                                  className="mt-2 flex items-center gap-1"
                                  onClick={() =>
                                    handleAddChildActivity(activity.id)
                                  }
                                >
                                  <Plus className="h-4 w-4" />
                                  Pridať aktivitu
                                </Button>
                              )}
                            </div>
                          </div>

                          <div className="bg-[#F9F2EC] rounded-xl w-full border-l-4 border-[#B0C9D6] p-5 lg:p-7">
                            <h3 className="text-xl md:text-2xl xl:text-3xl font-semibold text-[#5E7322] mb-5">
                              Prednášky pre mamičky
                            </h3>

                            <div className="grid md:grid-cols-2 gap-6 lg:gap-8 w-full">
                              {(lectures[activity.id] || []).map(
                                (lecture, i) => (
                                  <div
                                    key={i}
                                    className="bg-[#DEE2D2] rounded-xl p-5 lg:p-6 flex flex-col gap-3"
                                  >
                                    <div className="flex justify-between items-start">
                                      <h4 className="text-lg md:text-xl xl:text-2xl text-[#5E7322] font-semibold">
                                        {lecture.title}
                                      </h4>

                                      {isAuthenticated && role === "Admin" && (
                                        <div className="flex gap-1">
                                          <Button
                                            size="icon"
                                            variant="ghost"
                                            onClick={() =>
                                              handleEditLecture(activity.id, i)
                                            }
                                          >
                                            <Edit2 className="h-4 w-4" />
                                          </Button>

                                          <Button
                                            size="icon"
                                            variant="ghost"
                                            onClick={() =>
                                              handleDeleteLecture(activity.id, i)
                                            }
                                          >
                                            <img
                                              src="/close.jpg"
                                              alt="delete"
                                              className="w-4 h-4"
                                            />
                                          </Button>

                                          <Button
                                            size="icon"
                                            variant="ghost"
                                            onClick={() =>
                                              handleAddLectureItem(
                                                activity.id,
                                                i
                                              )
                                            }
                                          >
                                            <img
                                              src="/plus.jpg"
                                              alt="add"
                                              className="w-4 h-4"
                                            />
                                          </Button>
                                        </div>
                                      )}
                                    </div>

                                    {lecture.items &&
                                      lecture.items.length > 0 && (
                                        <ul className="list-disc list-inside text-[#210F00] text-base md:text-lg xl:text-xl space-y-2">
                                          {lecture.items.map((item, j) => (
                                            <li key={j}>{item}</li>
                                          ))}
                                        </ul>
                                      )}
                                  </div>
                                )
                              )}

                              {isAuthenticated && role === "Admin" && (
                                <Button
                                  size="sm"
                                  className="mt-2 flex items-center gap-1"
                                  onClick={() => handleAddLecture(activity.id)}
                                >
                                  <Plus className="h-4 w-4" />
                                  Pridať prednášku
                                </Button>
                              )}
                            </div>

                            <div className="text-[#5E7322] font-semibold mt-2 bg-[#DEE2D2] rounded-xl p-5 lg:p-6 shadow-sm">
                              {dalsiePrednasky[activity.id] ||
                                "A ďalšie aktivity"}
                            </div>
                          </div>

                          <div className="bg-[#F9F2EC] rounded-xl p-5 lg:p-7 flex flex-col items-start gap-3 w-full sm:w-fit relative">
                            <svg
                              className="w-12 h-12 md:w-14 md:h-14 text-gray-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3M12 2a10 10 0 100 20 10 10 0 000-20z"
                              />
                            </svg>

                            <div className="text-base md:text-lg xl:text-xl font-semibold">
                              <div className="text-sm font-semibold">
                                {schedule[activity.id]?.den}{" "}
                                <span className="text-[#5E7322]">
                                  {schedule[activity.id]?.cas}
                                </span>
                              </div>

                              <div className="text-gray-600">
                                {schedule[activity.id]?.zaciatok}
                              </div>
                            </div>

                            {isAuthenticated && role === "Admin" && (
                              <Button
                                size="sm"
                                variant="secondary"
                                className="absolute top-2 right-2"
                                onClick={() => handleEditSchedule(activity.id)}
                              >
                                <Edit2 className="h-4 w-4 mr-1" />
                                Upraviť
                              </Button>
                            )}
                          </div>

                          <div className="flex flex-col sm:flex-row gap-3 mt-4 w-full">
                            <Button
                              variant="link"
                              className="w-full sm:w-auto bg-[#F3953F] hover:bg-[#e07d2f] text-white rounded-xl px-6 py-3 sm:px-6 sm:py-3 font-semibold"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/aktivita/${activity.id}`);
                              }}
                            >
                              Čítať viac
                            </Button>

                            <Button
                              variant="secondary"
                              className="w-full sm:w-auto bg-[#DBD4CE] hover:bg-[#DBD4CE] text-[#210F0080] rounded-xl px-6 py-3 md:text-lg font-semibold"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate("/program");
                              }}
                            >
                              Pozrieť si program
                            </Button>
                          </div>

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
        title="Upraviť obrázok aktivít"
        type="image"
        initialValue={[image]}
        onSave={async (files) => {
          if (files[0]) {
            await setActivitiesImage(files[0]);
          }

          setIsEditingImage(false);
        }}
      />

      {editingActivity && (
        <EditModal
          isOpen={true}
          onClose={() => setEditingActivity(null)}
          title={`Upraviť ${
            activities.find((a) => a.id === editingActivity)?.title || "aktivitu"
          }`}
          type="text"
          initialValue={
            activities.find((a) => a.id === editingActivity)?.content || ""
          }
          onSave={async (value) => {
            await handleSaveActivity(editingActivity, value);
            setEditingActivity(null);
          }}
        />
      )}
    </section>
  );
};

export default ActivitiesSection;