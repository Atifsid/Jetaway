import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import {
    Ionicons,
    MaterialCommunityIcons,
    MaterialIcons,
} from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import DropdownModal from "../../components/ui/DropdownModal";
import DropdownSearch from "../../components/ui/DropdownSearch";
import PrimaryButton from "../../components/ui/PrimaryButton";

const TRIP_TYPES = [
    { label: "One way", value: "oneway", icon: "arrow-forward" },
    { label: "Round trip", value: "roundtrip", icon: "compare-arrows" },
];

const SEAT_TYPES = [
    { value: "economy", label: "Economy" },
    { value: "premium_economy", label: "Premium Economy" },
    { value: "business", label: "Business" },
    { value: "first", label: "First" },
];

// Add PassengerKey type for safe indexing
const PASSENGER_TYPES = [
    { key: "adults", label: "Adults", subtitle: undefined, min: 1, max: 9 },
    {
        key: "children",
        label: "Children",
        subtitle: "Aged 2-11",
        min: 0,
        max: 9,
    },
    {
        key: "infantsInSeat",
        label: "Infants",
        subtitle: "In seat",
        min: 0,
        max: 9,
    },
    {
        key: "infantsOnLap",
        label: "Infants",
        subtitle: "On lap",
        min: 0,
        max: 9,
    },
] as const;
type PassengerKey = (typeof PASSENGER_TYPES)[number]["key"];

function formatDate(date: Date | null) {
    if (!date) return "";
    return date.toISOString().split("T")[0];
}

export default function SearchFlightsScreen() {
    const [tripType, setTripType] = useState("oneway");
    const [origin, setOrigin] = useState<any>(null);
    const [destination, setDestination] = useState<any>(null);
    const [departure, setDeparture] = useState<Date | null>(null);
    const [returnDate, setReturnDate] = useState<Date | null>(null);
    const [showDeparturePicker, setShowDeparturePicker] = useState(false);
    const [showReturnPicker, setShowReturnPicker] = useState(false);
    const [originQuery, setOriginQuery] = useState("");
    const [originResults, setOriginResults] = useState<any[]>([]);
    const [originLoading, setOriginLoading] = useState(false);
    const [destinationQuery, setDestinationQuery] = useState("");
    const [destinationResults, setDestinationResults] = useState<any[]>([]);
    const [destinationLoading, setDestinationLoading] = useState(false);
    const [seatType, setSeatType] = useState("economy");
    const [passengerModalVisible, setPassengerModalVisible] = useState(false);
    const [passengers, setPassengers] = useState<Record<PassengerKey, number>>({
        adults: 1,
        children: 0,
        infantsInSeat: 0,
        infantsOnLap: 0,
    });
    const [localPassengers, setLocalPassengers] =
        useState<Record<PassengerKey, number>>(passengers);
    const totalPassengers =
        passengers.adults +
        passengers.children +
        passengers.infantsInSeat +
        passengers.infantsOnLap;
    const router = useRouter();
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchError, setSearchError] = useState<string | null>(null);

    const debouncedOriginQuery = useDebouncedValue(originQuery, 500);
    const debouncedDestinationQuery = useDebouncedValue(destinationQuery, 500);

    const fetchAirportData = useCallback(async (query: string) => {
        if (!query) return [];
        try {
            const response = await axios.request({
                method: "GET",
                url: `${process.env.EXPO_PUBLIC_SKY_SCRAPPER_BASE_URL}/flights/searchAirport`,
                params: {
                    query,
                    locale: "en-US",
                },
                headers: {
                    "x-rapidapi-key": process.env.EXPO_PUBLIC_RAPID_API_KEY,
                    "x-rapidapi-host":
                        process.env.EXPO_PUBLIC_SKY_SCRAPPER_HOST,
                },
            });
            return Array.isArray(response.data?.data) ? response.data.data : [];
        } catch (error) {
            return [];
        }
    }, []);

    useEffect(() => {
        if (!debouncedOriginQuery) {
            setOriginResults([]);
            setOriginLoading(false);
            return;
        }
        setOriginLoading(true);
        fetchAirportData(debouncedOriginQuery).then((data) => {
            setOriginResults(data);
            setOriginLoading(false);
        });
    }, [debouncedOriginQuery]);

    useEffect(() => {
        if (!debouncedDestinationQuery) {
            setDestinationResults([]);
            setDestinationLoading(false);
            return;
        }
        setDestinationLoading(true);
        fetchAirportData(debouncedDestinationQuery).then((data) => {
            setDestinationResults(data);
            setDestinationLoading(false);
        });
    }, [debouncedDestinationQuery]);

    const handleSearch = async () => {
        setSearchError(null);
        if (
            !origin ||
            !destination ||
            !departure ||
            (tripType === "roundtrip" && !returnDate)
        ) {
            setSearchError("Please fill all required fields.");
            return;
        }
        setSearchLoading(true);
        try {
            console.log("Origin", JSON.stringify(origin));
            console.log("Destination", JSON.stringify(destination));

            const options = {
                method: "GET",
                url: `${process.env.EXPO_PUBLIC_SKY_SCRAPPER_BASE_URL?.replace(
                    "/v1",
                    "/v2"
                )}/flights/searchFlights`,
                params: {
                    originSkyId: origin.skyId,
                    destinationSkyId: destination.skyId,
                    originEntityId: origin.entityId,
                    destinationEntityId: destination.entityId,
                    date: formatDate(departure),
                    ...(tripType === "roundtrip" && returnDate
                        ? { returnDate: formatDate(returnDate) }
                        : {}),
                    cabinClass: seatType,
                    adults: String(passengers.adults),
                    childrens: String(passengers.children),
                    infants: String(
                        passengers.infantsInSeat + passengers.infantsOnLap
                    ),
                    sortBy: "best",
                    currency: "USD",
                    market: "en-US",
                    countryCode: "US",
                },
                headers: {
                    "x-rapidapi-key": process.env.EXPO_PUBLIC_RAPID_API_KEY,
                    "x-rapidapi-host":
                        process.env.EXPO_PUBLIC_SKY_SCRAPPER_HOST,
                },
            };

            console.log("options: ", JSON.stringify(options));
            const response = await axios.request(options);
            console.log("search response: ", JSON.stringify(response.data));
            const data = response.data?.data;

            if (
                !data ||
                !Array.isArray(data.itineraries) ||
                data.itineraries.length === 0
            ) {
                setSearchError(
                    "No flights found. Please try different search criteria."
                );
                setSearchLoading(false);
                return;
            }
            setSearchLoading(false);
            router.push({
                pathname: "/results",
                params: {
                    origin:
                        origin?.presentation?.suggestionTitle ||
                        origin?.presentation?.title,
                    destination:
                        destination?.presentation?.suggestionTitle ||
                        destination?.presentation?.title,
                    departure: formatDate(departure),
                    returnDate: formatDate(returnDate),
                    tripType,
                    seatType,
                    flights: JSON.stringify(data.itineraries),
                    sessionId: data.context.sessionId,
                },
            });
        } catch (error) {
            setSearchError(
                "An error occurred while searching for flights. Please try again."
            );
            setSearchLoading(false);
        }
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
                        name="radio-button-off"
                        size={20}
                        color="#757575"
                        style={styles.inputIcon}
                    />
                    <DropdownSearch
                        placeholder="From"
                        value={origin}
                        onSelect={setOrigin}
                        query={originQuery}
                        onQueryChange={setOriginQuery}
                        results={originResults}
                        style={{ width: "93%" }}
                        loading={originLoading}
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
                    <DropdownSearch
                        placeholder="Where to?"
                        value={destination}
                        onSelect={setDestination}
                        query={destinationQuery}
                        onQueryChange={setDestinationQuery}
                        results={destinationResults}
                        style={{ width: "93%" }}
                        loading={destinationLoading}
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
                <View
                    style={[
                        styles.inputRow,
                        { paddingVertical: 0, marginTop: 10 },
                    ]}
                >
                    <MaterialCommunityIcons
                        name="seatbelt"
                        size={24}
                        color="#757575"
                        style={styles.inputIcon}
                    />
                    <View style={{ flex: 1 }}>
                        <Picker
                            selectedValue={seatType}
                            onValueChange={setSeatType}
                            style={{ width: "100%" }}
                        >
                            {SEAT_TYPES.map((type) => (
                                <Picker.Item
                                    key={type.value}
                                    label={type.label}
                                    value={type.value}
                                />
                            ))}
                        </Picker>
                    </View>
                </View>
                <TouchableOpacity
                    style={styles.inputRow}
                    onPress={() => {
                        setLocalPassengers(passengers);
                        setPassengerModalVisible(true);
                    }}
                    activeOpacity={0.7}
                >
                    <MaterialCommunityIcons
                        name="account-group"
                        size={22}
                        color={"#757575"}
                        style={[styles.inputIcon, { paddingVertical: 10 }]}
                    />
                    <Text
                        style={{
                            fontSize: 16,
                            color: totalPassengers > 1 ? "#222" : "#757575",
                        }}
                        numberOfLines={1}
                    >
                        {totalPassengers > 1
                            ? `${totalPassengers} Passengers`
                            : "1 Passenger"}
                    </Text>
                </TouchableOpacity>
                <DropdownModal
                    visible={passengerModalVisible}
                    onClose={() => setPassengerModalVisible(false)}
                >
                    {PASSENGER_TYPES.map((type) => (
                        <View
                            key={type.key}
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                marginBottom: 16,
                            }}
                        >
                            <View style={{ flex: 1 }}>
                                <Text
                                    style={{
                                        fontSize: 16,
                                        fontWeight: "500",
                                        color: "#222",
                                    }}
                                >
                                    {type.label}
                                </Text>
                                {type.subtitle && (
                                    <Text
                                        style={{
                                            fontSize: 13,
                                            color: "#888",
                                            marginTop: 2,
                                        }}
                                    >
                                        {type.subtitle}
                                    </Text>
                                )}
                            </View>
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: 8,
                                }}
                            >
                                <TouchableOpacity
                                    style={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: 8,
                                        backgroundColor:
                                            localPassengers[type.key] <=
                                            type.min
                                                ? "#f2f2f2"
                                                : "#f2f6fc",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                    onPress={() =>
                                        setLocalPassengers((prev) => {
                                            const next = { ...prev };
                                            next[type.key] = Math.max(
                                                type.min,
                                                prev[type.key] - 1
                                            );
                                            if (
                                                type.key === "adults" &&
                                                next.adults < 1
                                            )
                                                next.adults = 1;
                                            return next;
                                        })
                                    }
                                    disabled={
                                        localPassengers[type.key] <= type.min
                                    }
                                >
                                    <Text
                                        style={{
                                            fontSize: 20,
                                            color:
                                                localPassengers[type.key] <=
                                                type.min
                                                    ? "#bbb"
                                                    : "#1976D2",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        -
                                    </Text>
                                </TouchableOpacity>
                                <Text
                                    style={{
                                        fontSize: 16,
                                        fontWeight: "bold",
                                        width: 24,
                                        textAlign: "center",
                                    }}
                                >
                                    {localPassengers[type.key]}
                                </Text>
                                <TouchableOpacity
                                    style={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: 8,
                                        backgroundColor:
                                            localPassengers[type.key] >=
                                            type.max
                                                ? "#f2f2f2"
                                                : "#f2f6fc",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                    onPress={() =>
                                        setLocalPassengers((prev) => {
                                            const next = { ...prev };
                                            next[type.key] = Math.min(
                                                type.max,
                                                prev[type.key] + 1
                                            );
                                            return next;
                                        })
                                    }
                                    disabled={
                                        localPassengers[type.key] >= type.max
                                    }
                                >
                                    <Text
                                        style={{
                                            fontSize: 20,
                                            color:
                                                localPassengers[type.key] >=
                                                type.max
                                                    ? "#bbb"
                                                    : "#1976D2",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        +
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "flex-end",
                            marginTop: 8,
                            gap: 16,
                        }}
                    >
                        <TouchableOpacity
                            onPress={() => {
                                setLocalPassengers(passengers);
                                setPassengerModalVisible(false);
                            }}
                            style={{
                                paddingHorizontal: 12,
                                paddingVertical: 8,
                            }}
                        >
                            <Text
                                style={{
                                    color: "#1976D2",
                                    fontWeight: "bold",
                                    fontSize: 16,
                                }}
                            >
                                Cancel
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                setPassengers(localPassengers);
                                setPassengerModalVisible(false);
                            }}
                            style={{
                                paddingHorizontal: 12,
                                paddingVertical: 8,
                            }}
                        >
                            <Text
                                style={{
                                    color: "#1976D2",
                                    fontWeight: "bold",
                                    fontSize: 16,
                                }}
                            >
                                Done
                            </Text>
                        </TouchableOpacity>
                    </View>
                </DropdownModal>
                {searchError && (
                    <Text
                        style={{
                            color: "#d32f2f",
                            textAlign: "center",
                            marginBottom: 8,
                        }}
                    >
                        {searchError}
                    </Text>
                )}
                <View style={styles.exploreBtnContainer}>
                    <PrimaryButton
                        title={searchLoading ? "Searching..." : "Explore"}
                        onPress={handleSearch}
                        disabled={
                            searchLoading ||
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
        borderWidth: 1,
        borderColor: "#ccc",
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
