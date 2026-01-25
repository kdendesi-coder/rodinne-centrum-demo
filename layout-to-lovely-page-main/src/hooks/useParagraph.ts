import { useState, useEffect } from 'react';

interface ParagraphData {
  id: string;
  text: string;
}

// Hook to fetch and manage paragraph text by ID (paragraphs are sections of text all over the site)
export const useParagraph = (paragraphId: string) => {
  const [text, setText] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchParagraph = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(`http://localhost:5058/text/${paragraphId}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setText(`Content for ${paragraphId} will appear here...`);
            return;
          }
          throw new Error(`Failed to fetch paragraph: ${response.status}`);
        }
        
        const data: ParagraphData = await response.json();
        setText(data.text);
      } catch (err) {
        console.error(`Error fetching paragraph ${paragraphId}:`, err);
        setError('Failed to load content');
        setText(`Failed to load ${paragraphId} content`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchParagraph();
  }, [paragraphId]);

  return { text, isLoading, error, setText };
};