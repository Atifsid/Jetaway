import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
    user: string | null;
    login: (email: string) => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    login: async () => {},
    logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<string | null>(null);

    useEffect(() => {
        AsyncStorage.getItem("user").then((storedUser) => {
            if (storedUser) setUser(storedUser);
        });
    }, []);

    const login = async (email: string) => {
        setUser(email);
        await AsyncStorage.setItem("user", email);
    };

    const logout = async () => {
        setUser(null);
        await AsyncStorage.removeItem("user");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
