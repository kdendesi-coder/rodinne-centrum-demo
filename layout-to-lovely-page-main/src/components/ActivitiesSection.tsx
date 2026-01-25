import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit2, ChevronDown, Plus } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import EditModal from "./EditModal";
import AddActivityModal from "./AddActivityModal";

interface Activity {
  id: string;
  title: string;
  content: string;
}

const ActivitiesSection = () => {
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: "herna",
      title: "Herňa",
      content: "Herňa je určená deťom od 0 do 6 rokov. Je to priestor, kde sa môžu deti hrať a učiť sa nové veci.",
    },
    {
      id: "atrium",
      title: "Átrium",
      content: "Átrium je multifunkčný priestor určený pre rôzne aktivity a podujatia.",
    },
    {
      id: "klubik",
      title: "Klubík",
      content: "Klubík je priestor pre mladých a aktivít pre teenagerov a mladých dospelých.",
    },
  ]);

  const [openItems, setOpenItems] = useState<string[]>(["herna"]);
  const [editingActivity, setEditingActivity] = useState<string | null>(null);
  const [isEditingImage, setIsEditingImage] = useState(false);
  const [isAddingActivity, setIsAddingActivity] = useState(false);
  const [image, setImage] = useState("");

  const toggleItem = (id: string) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSaveActivity = (id: string, newContent: string) => {
    setActivities((prev) =>
      prev.map((activity) =>
        activity.id === id ? { ...activity, content: newContent } : activity
      )
    );
  };

  const handleAddActivity = (title: string, content: string) => {
    const id = title.toLowerCase().replace(/\s+/g, '-');
    setActivities((prev) => [...prev, { id, title, content }]);
  };

  return (
    <section id="activities" className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-12">Aktivity</h2>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Left side - Image */}
          <div className="relative group bg-muted rounded-lg overflow-hidden aspect-square flex items-center justify-center">
            {image ? (
              <img src={image} alt="Activities" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center p-8">
                <svg
                  className="w-32 h-32 mx-auto text-muted-foreground mb-4"
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
            <Button
              size="icon"
              variant="secondary"
              className="edit-button"
              onClick={() => setIsEditingImage(true)}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Right side - Content */}
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Naše aktivity</h3>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsAddingActivity(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Pridať aktivitu
              </Button>
            </div>

            {/* Collapsible sections with connecting line */}
            <div className="relative pl-8">
              {/* Vertical line */}
              <div className="absolute left-3 top-4 bottom-4 w-0.5 bg-border" />

              <div className="space-y-2">
                {activities.map((activity, index) => (
                  <Collapsible
                    key={activity.id}
                    open={openItems.includes(activity.id)}
                    onOpenChange={() => toggleItem(activity.id)}
                  >
                    <div className="relative">
                      {/* Connector dot */}
                      <div className="absolute -left-[29px] top-3 w-3 h-3 rounded-full bg-primary border-2 border-background" />
                      
                      <CollapsibleTrigger className="flex items-center justify-between w-full p-3 text-left font-medium hover:bg-muted/50 rounded-lg transition-colors">
                        <span>{activity.title}</span>
                        <ChevronDown
                          className={`h-5 w-5 transition-transform duration-200 ${
                            openItems.includes(activity.id) ? "rotate-180" : ""
                          }`}
                        />
                      </CollapsibleTrigger>
                      
                      <CollapsibleContent className="data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up overflow-hidden">
                        <div className="relative group/content p-4 pt-2">
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {activity.content}
                          </p>
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