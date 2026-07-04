import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface ParagraphData {
  id: string;
  text: string;
}

const API_URL = "https://rodinne-centrum-backend-production.up.railway.app";

export const useParagraph = (paragraphId: string) => {
  const [text, setTextState] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  const fetchParagraph = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        `${API_URL}/text/${paragraphId}?t=${Date.now()}`,
        {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache",
          },
        }
      );

      if (!response.ok) {
        setTextState("");
        return;
      }

      const data: ParagraphData = await response.json();
      setTextState(data.text || "");
    } catch (err) {
      console.error(`Error fetching paragraph ${paragraphId}:`, err);
      setError("Failed to load content");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchParagraph();
  }, [paragraphId]);

  const setText = async (newText: string) => {
    if (!token) {
      console.error("No token - user is not logged in");
      return;
    }

    const response = await fetch(`${API_URL}/text/${paragraphId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "Cache-Control": "no-cache",
      },
      body: JSON.stringify({ text: newText }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update text: ${response.status}`);
    }

    setTextState(newText);
    await fetchParagraph();
  };

  return { text, isLoading, error, setText };
};