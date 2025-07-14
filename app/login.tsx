import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../components/AuthContext";
import InputField from "../components/ui/InputField";
import PrimaryButton from "../components/ui/PrimaryButton";

export default function LoginScreen({
    onShowSignup,
}: {
    onShowSignup?: () => void;
}) {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Log In</Text>
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
                title="Log In"
                onPress={() => login(email)}
                disabled={!email || !password}
            />
            <View style={styles.linkRow}>
                <Text style={styles.linkText}>Don't have an account? </Text>
                <TouchableOpacity onPress={onShowSignup}>
                    <Text style={styles.link}>Sign up</Text>
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
