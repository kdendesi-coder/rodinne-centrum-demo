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
}

// Default detailed content for activity pages (independent from section summaries)
const defaultDetailContent: Record<string, { title: string; content: string }> = {
  herna: {
    title: "Herňa",
    content: "Vitajte na stránke Herňa. Tu nájdete podrobné informácie o našej hernej zóne pre deti.",
  },
  atrium: {
    title: "Átrium",
    content: "Vitajte na stránke Átrium. Tu nájdete podrobné informácie o našom multifunkčnom priestore.",
  },
  klubik: {
    title: "Klubík",
    content: "Vitajte na stránke Klubík. Tu nájdete podrobné informácie o aktivitách pre mládež.",
  },
};

const ActivityDetail = () => {
  const { activityId } = useParams<{ activityId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [activity, setActivity] = useState<ActivityData | null>(null);
  const [isEditingContent, setIsEditingContent] = useState(false);

  useEffect(() => {
    if (!activityId) return;
    
    // Try to get from localStorage first (for detail pages, stored separately)
    const storageKey = `activity_detail_${activityId}`;
    const storedContent = localStorage.getItem(storageKey);
    
    if (storedContent) {
      try {
        setActivity(JSON.parse(storedContent));
        return;
      } catch {
        // Fall through to defaults
      }
    }
    
    // Fall back to defaults
    const defaultData = defaultDetailContent[activityId];
    if (defaultData) {
      setActivity({
        id: activityId,
        title: defaultData.title,
        content: defaultData.content,
      });
    }
  }, [activityId]);

  const handleSaveContent = (newContent: string) => {
    if (!activity || !activityId) return;
    
    const updatedActivity = { ...activity, content: newContent };
    setActivity(updatedActivity);
    
    // Store in localStorage with unique key for detail pages
    const storageKey = `activity_detail_${activityId}`;
    localStorage.setItem(storageKey, JSON.stringify(updatedActivity));
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
          <h1 className="text-4xl md:text-5xl font-bold mb-12">{activity.title}</h1>

          {/* Editable content section */}
          <div className="bg-muted/30 rounded-lg p-8">
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
    </div>
  );
};

export default ActivityDetail;
