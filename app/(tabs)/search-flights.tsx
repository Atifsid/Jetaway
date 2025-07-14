import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import InputField from "../../components/ui/InputField";
import PrimaryButton from "../../components/ui/PrimaryButton";

const TRIP_TYPES = [
    { label: "One way", value: "oneway", icon: "arrow-forward" },
    { label: "Round trip", value: "roundtrip", icon: "compare-arrows" },
];

function formatDate(date: Date | null) {
    if (!date) return "";
    return date.toISOString().split("T")[0];
}

export default function SearchFlightsScreen() {
    const [tripType, setTripType] = useState("oneway");
    const [origin, setOrigin] = useState("");
    const [destination, setDestination] = useState("");
    const [departure, setDeparture] = useState<Date | null>(null);
    const [returnDate, setReturnDate] = useState<Date | null>(null);
    const [showDeparturePicker, setShowDeparturePicker] = useState(false);
    const [showReturnPicker, setShowReturnPicker] = useState(false);
    const router = useRouter();

    const handleSearch = () => {
        router.push({
            pathname: "/results",
            params: {
                origin,
                destination,
                departure: formatDate(departure),
                returnDate: formatDate(returnDate),
                tripType,
            },
        });
    };

    return (
        <View style={styles.screen}>
            <Text style={styles.heading}>Search Flights</Text>
            <View style={styles.card}>
                <View style={styles.tripTypeRow}>
                    {TRIP_TYPES.map((type) => (
                        <TouchableOpacity
                            key={type.value}
                            style={[
                                styles.tripTypeBtn,
                                tripType === type.value &&
                                    styles.tripTypeBtnActive,
                            ]}
                            onPress={() => setTripType(type.value)}
                            activeOpacity={0.8}
                        >
                            <MaterialIcons
                                name={type.icon as any}
                                size={20}
                                color={
                                    tripType === type.value
                                        ? "#1976D2"
                                        : "#757575"
                                }
                            />
                            <Text
                                style={[
                                    styles.tripTypeText,
                                    tripType === type.value &&
                                        styles.tripTypeTextActive,
                                ]}
                            >
                                {type.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <View style={styles.inputRow}>
                    <Ionicons
                        name="radio-button-on"
                        size={20}
                        color="#1976D2"
                        style={styles.inputIcon}
                    />
                    <InputField
                        placeholder="From"
                        value={origin}
                        onChangeText={setOrigin}
                        style={styles.flexInput}
                    />
                </View>
                <View style={styles.swapRow}>
                    <TouchableOpacity
                        style={styles.swapBtn}
                        onPress={() => {
                            setOrigin(destination);
                            setDestination(origin);
                        }}
                    >
                        <MaterialIcons
                            name="swap-horiz"
                            size={24}
                            color="#757575"
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.inputRow}>
                    <Ionicons
                        name="location-outline"
                        size={20}
                        color="#757575"
                        style={styles.inputIcon}
                    />
                    <InputField
                        placeholder="Where to?"
                        value={destination}
                        onChangeText={setDestination}
                        style={styles.flexInput}
                    />
                </View>
                <View style={styles.dateRow}>
                    <TouchableOpacity
                        style={[styles.inputRow, styles.dateInputTouchable]}
                        onPress={() => setShowDeparturePicker(true)}
                        activeOpacity={0.7}
                    >
                        <MaterialIcons
                            name="calendar-today"
                            size={20}
                            color="#757575"
                            style={styles.inputIcon}
                        />
                        <Text
                            style={[
                                styles.flexInput,
                                styles.dateText,
                                !departure && styles.placeholderText,
                            ]}
                        >
                            {departure ? formatDate(departure) : "Departure"}
                        </Text>
                    </TouchableOpacity>
                    {showDeparturePicker && (
                        <DateTimePicker
                            value={departure || new Date()}
                            mode="date"
                            display={
                                Platform.OS === "ios" ? "inline" : "default"
                            }
                            onChange={(_, date) => {
                                setShowDeparturePicker(false);
                                if (date) setDeparture(date);
                            }}
                        />
                    )}
                    {tripType === "roundtrip" && (
                        <TouchableOpacity
                            style={[
                                styles.inputRow,
                                styles.dateInputTouchable,
                                { marginLeft: 8 },
                            ]}
                            onPress={() => setShowReturnPicker(true)}
                            activeOpacity={0.7}
                        >
                            <MaterialIcons
                                name="calendar-today"
                                size={20}
                                color="#757575"
                                style={styles.inputIcon}
                            />
                            <Text
                                style={[
                                    styles.flexInput,
                                    styles.dateText,
                                    !returnDate && styles.placeholderText,
                                ]}
                            >
                                {returnDate ? formatDate(returnDate) : "Return"}
                            </Text>
                        </TouchableOpacity>
                    )}
                    {showReturnPicker && (
                        <DateTimePicker
                            value={returnDate || departure || new Date()}
                            mode="date"
                            display={
                                Platform.OS === "ios" ? "inline" : "default"
                            }
                            onChange={(_, date) => {
                                setShowReturnPicker(false);
                                if (date) setReturnDate(date);
                            }}
                        />
                    )}
                </View>
                <View style={styles.exploreBtnContainer}>
                    <PrimaryButton
                        title="Explore"
                        onPress={handleSearch}
                        disabled={
                            !origin ||
                            !destination ||
                            !departure ||
                            (tripType === "roundtrip" && !returnDate)
                        }
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: "#f9fafd",
        justifyContent: "center",
        alignItems: "center",
    },
    heroContainer: {
        width: "100%",
        alignItems: "center",
        marginBottom: 0,
        marginTop: 12,
        position: "relative",
    },
    heroImage: {
        width: "100%",
        height: 220,
    },
    headingWrapper: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: -28,
        alignItems: "center",
        zIndex: 2,
    },
    heading: {
        fontSize: 32,
        fontWeight: "700",
        color: "#22223b",
        textAlign: "center",
        marginTop: 32,
    },
    card: {
        width: "96%",
        maxWidth: 600,
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 18,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
        marginTop: 16,
    },
    tripTypeRow: {
        flexDirection: "row",
        marginBottom: 18,
        gap: 8,
    },
    tripTypeBtn: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 8,
        backgroundColor: "#f5f5f5",
        marginRight: 8,
    },
    tripTypeBtnActive: {
        backgroundColor: "#e3f0fd",
        borderBottomWidth: 2,
        borderBottomColor: "#1976D2",
    },
    tripTypeText: {
        marginLeft: 6,
        color: "#757575",
        fontWeight: "500",
        fontSize: 15,
    },
    tripTypeTextActive: {
        color: "#1976D2",
        fontWeight: "bold",
    },
    inputRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
        backgroundColor: "#f7f7f7",
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: Platform.OS === "ios" ? 10 : 0,
    },
    inputIcon: {
        marginRight: 8,
    },
    flexInput: {
        flex: 1,
        backgroundColor: "transparent",
        borderWidth: 0,
        marginBottom: 0,
    },
    swapRow: {
        alignItems: "center",
        marginVertical: 2,
    },
    swapBtn: {
        backgroundColor: "#f0f0f0",
        borderRadius: 20,
        padding: 4,
        alignItems: "center",
        justifyContent: "center",
        width: 36,
        height: 36,
        marginBottom: 2,
    },
    dateRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 8,
        marginBottom: 4,
    },
    dateInputContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f7f7f7",
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: Platform.OS === "ios" ? 10 : 0,
        borderWidth: 1,
        borderColor: "#ccc",
        height: 48,
        marginBottom: 0,
    },
    dateText: {
        color: "#22223b",
        fontSize: 16,
        fontWeight: "500",
        flex: 1,
        textAlignVertical: "center",
    },
    placeholderText: {
        color: "#757575",
        fontWeight: "400",
    },
    exploreBtnContainer: {
        marginTop: 18,
        marginBottom: 2,
        alignItems: "center",
    },
    dateInputTouchable: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        backgroundColor: "#f7f7f7",
        height: 48,
        paddingHorizontal: 8,
        paddingVertical: 0,
        marginBottom: 0,
        flex: 1,
        alignItems: "center",
    },
});
