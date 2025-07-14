import React from "react";
import {
    GestureResponderEvent,
    StyleSheet,
    Text,
    TouchableOpacity,
} from "react-native";

type PrimaryButtonProps = {
    title: string;
    onPress: (event: GestureResponderEvent) => void;
    disabled?: boolean;
};

export default function PrimaryButton({
    title,
    onPress,
    disabled = false,
}: PrimaryButtonProps) {
    return (
        <TouchableOpacity
            style={[styles.button, disabled && styles.disabled]}
            onPress={onPress}
            activeOpacity={0.8}
            disabled={disabled}
        >
            <Text style={styles.text}>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: "#007AFF",
        borderRadius: 8,
        paddingVertical: 14,
        paddingHorizontal: 24,
        alignItems: "center",
        marginVertical: 8,
    },
    text: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
    disabled: {
        backgroundColor: "#b0b0b0",
    },
});
