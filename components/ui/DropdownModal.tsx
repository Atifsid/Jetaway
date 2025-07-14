import React from "react";
import {
    Modal,
    Platform,
    StyleProp,
    StyleSheet,
    TouchableWithoutFeedback,
    View,
    ViewStyle,
} from "react-native";

interface DropdownModalProps {
    visible: boolean;
    onClose: () => void;
    children: React.ReactNode;
    contentStyle?: StyleProp<ViewStyle>;
    overlayStyle?: StyleProp<ViewStyle>;
}

export default function DropdownModal({
    visible,
    onClose,
    children,
    contentStyle,
    overlayStyle,
}: DropdownModalProps) {
    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={[styles.modalOverlay, overlayStyle]} />
            </TouchableWithoutFeedback>
            <View style={[styles.modalContent, contentStyle]}>{children}</View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.2)",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1,
    },
    modalContent: {
        width: "90%",
        maxHeight: "80%",
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        alignSelf: "center",
        marginTop: "20%",
        zIndex: 2,
        ...Platform.select({
            android: { elevation: 4 },
            ios: { shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 8 },
        }),
    },
});
