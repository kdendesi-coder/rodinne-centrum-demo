import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AuthContextType {
  token: string | null;
  role: string | null;
  username: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false); //pridane ---------------------------

  //pridane ---------------------------
 // Add this useEffect to keep isAuthenticated in sync
  useEffect(() => {
    console.log(" useEffect [token] - token changed:", token, "setting isAuthenticated to:", !!token);
    setIsAuthenticated(!!token);
  }, [token]);
  //pridane ---------------------------

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");
    const storedUsername = localStorage.getItem("username");
    

    // javascript :D -> tento if prejde na true ak je v premennej "undefined", lebo "undefined" je neprazdny string
    // a ked nastavujes hodnotu npr. localStorage.setItem("token", data.Token); a data.Token je undefined (lebo v skutocnosti to mal byt data.token s malym pismenom), tak sa do localStorage ulozi string "undefined"
    
    //if (storedToken && storedRole && storedUsername) {

    //preto zmeneny if na tento:
    if (storedToken && storedRole && storedUsername &&
                   storedToken !== "undefined" && 
                   storedToken !== "null" &&
                   storedRole !== "undefined" && 
                   storedRole !== "null") {
      console.log(" Setting initial state from localStorage");
      setToken(storedToken);
      setRole(storedRole);
      setUsername(storedUsername);
      //pridane ---------------------------
      setIsAuthenticated(true); // Also set this directly 
      //pridane ---------------------------
    }
  }, []);

  const login = async (username: string, password: string) => {
    console.log(" Login function called with username:", username);

    const response = await fetch("http://localhost:5058/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      throw new Error("Invalid credentials");
    }

    const data = await response.json();
    console.log(" Login successful, received data:", data);
    
    console.log(" Setting states after login:");
    console.log("   - Setting token:", data.token); //zmenene na lowercase z data.Token ---------------------
    console.log("   - Setting role:", data.role); //zmenene na lowercase ---------------------
    console.log("   - Setting username:", username);
    console.log("   - Setting isAuthenticated: true");

    setToken(data.token); //zmenene na lowercase ---------------------
    setRole(data.role); //zmenene na lowercase ---------------------
    setUsername(username);
    //pridane ---------------------------
    setIsAuthenticated(true); // Set this explicitly
    //pridane ---------------------------
    
    localStorage.setItem("token", data.token);  //zmenene na lowercase ---------------------
    localStorage.setItem("role", data.role); //zmenene na lowercase ---------------------
    localStorage.setItem("username", username);

    console.log(" Saved to localStorage");
  };

  const logout = () => {
    console.log("🚪 Logout called");
    setToken(null);
    setRole(null);
    setUsername(null);
    //pridane ---------------------------
    setIsAuthenticated(false);
    //pridane ---------------------------
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
  };

  // Log the current state whenever it changes
  useEffect(() => {
    console.log(" Current Auth State:", {
      token,
      role,
      username,
      isAuthenticated
    });
  }, [token, role, username, isAuthenticated]);

  return (
    <AuthContext.Provider
      value={{
        token,
        role,
        username,
        isAuthenticated, //zmenene --------------------------- z isAuthenticated: !!token
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};