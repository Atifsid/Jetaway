import { Slot } from "expo-router";
import { useState } from "react";
import { AuthProvider, useAuth } from "../components/AuthContext";
import LoginScreen from "./login";
import SignupScreen from "./signup";

function AuthGate() {
    const { user } = useAuth();
    const [showLogin, setShowLogin] = useState(false);

    if (!user) {
        if (showLogin) {
            return <LoginScreen onShowSignup={() => setShowLogin(false)} />;
        }
        return <SignupScreen onShowLogin={() => setShowLogin(true)} />;
    }
    return <Slot />;
}

export default function RootLayout() {
    return (
        <AuthProvider>
            <AuthGate />
        </AuthProvider>
    );
}
