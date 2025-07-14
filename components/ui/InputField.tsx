import React from "react";
import { StyleSheet, TextInput, TextInputProps } from "react-native";

export default function InputField(props: TextInputProps) {
    return <TextInput style={styles.input} {...props} />;
}

const styles = StyleSheet.create({
    input: {
        width: "100%",
        height: 48,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        marginBottom: 16,
        fontSize: 16,
        backgroundColor: "#fff",
    },
});
