import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../components/AuthContext";
import InputField from "../components/ui/InputField";
import PrimaryButton from "../components/ui/PrimaryButton";

export default function SignupScreen({
    onShowLogin,
}: {
    onShowLogin?: () => void;
}) {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sign Up</Text>
            <InputField
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
            />
            <InputField
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <PrimaryButton
                title="Sign Up"
                onPress={() => login(email)}
                disabled={!email || !password}
            />
            <View style={styles.linkRow}>
                <Text style={styles.linkText}>Already have an account? </Text>
                <TouchableOpacity onPress={onShowLogin}>
                    <Text style={styles.link}>Log in</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
    },
    title: { fontSize: 28, fontWeight: "bold", marginBottom: 24 },
    linkRow: { flexDirection: "row", alignItems: "center", marginTop: 16 },
    linkText: { fontSize: 16, color: "#22223b" },
    link: { color: "#007AFF", fontSize: 16, fontWeight: "bold" },
});
