import { useLocalSearchParams } from "expo-router";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";

const mockItineraries = [
    {
        id: "itin1",
        price: {
            formatted: "$1,779",
        },
        legs: [
            {
                id: "leg1",
                origin: {
                    name: "London Heathrow",
                    displayCode: "LHR",
                },
                destination: {
                    name: "New York Newark",
                    displayCode: "EWR",
                },
                departure: "2025-07-14T12:00:00",
                arrival: "2025-07-14T15:15:00",
                durationInMinutes: 495,
                stopCount: 0,
                carriers: {
                    marketing: [
                        {
                            name: "Lufthansa",
                            logoUrl:
                                "https://logos.skyscnr.com/images/airlines/favicon/LH.png",
                        },
                    ],
                },
            },
            {
                id: "leg2",
                origin: {
                    name: "New York Newark",
                    displayCode: "EWR",
                },
                destination: {
                    name: "London Heathrow",
                    displayCode: "LHR",
                },
                departure: "2025-07-17T20:50:00",
                arrival: "2025-07-18T09:20:00",
                durationInMinutes: 450,
                stopCount: 0,
                carriers: {
                    marketing: [
                        {
                            name: "Lufthansa",
                            logoUrl:
                                "https://logos.skyscnr.com/images/airlines/favicon/LH.png",
                        },
                    ],
                },
            },
        ],
    },
    {
        id: "itin2",
        price: {
            formatted: "$1,903",
        },
        legs: [
            {
                id: "leg3",
                origin: {
                    name: "London Gatwick",
                    displayCode: "LGW",
                },
                destination: {
                    name: "New York John F. Kennedy",
                    displayCode: "JFK",
                },
                departure: "2025-07-14T13:05:00",
                arrival: "2025-07-14T15:55:00",
                durationInMinutes: 470,
                stopCount: 0,
                carriers: {
                    marketing: [
                        {
                            name: "Norse Atlantic Airways (UK)",
                            logoUrl:
                                "https://logos.skyscnr.com/images/airlines/favicon/I%29.png",
                        },
                    ],
                },
            },
            {
                id: "leg4",
                origin: {
                    name: "New York John F. Kennedy",
                    displayCode: "JFK",
                },
                destination: {
                    name: "London Gatwick",
                    displayCode: "LGW",
                },
                departure: "2025-07-17T18:20:00",
                arrival: "2025-07-18T06:20:00",
                durationInMinutes: 420,
                stopCount: 0,
                carriers: {
                    marketing: [
                        {
                            name: "Norse Atlantic Airways (UK)",
                            logoUrl:
                                "https://logos.skyscnr.com/images/airlines/favicon/I%29.png",
                        },
                    ],
                },
            },
        ],
    },
];

function formatTime(iso: string) {
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatDuration(mins: number) {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m}m`;
}

function FlightCard({ itinerary }: { itinerary: (typeof mockItineraries)[0] }) {
    return (
        <View style={styles.card}>
            <Text style={styles.price}>{itinerary.price.formatted}</Text>
            {itinerary.legs.map((leg, idx) => (
                <View key={leg.id} style={styles.legRow}>
                    <Image
                        source={{ uri: leg.carriers.marketing[0].logoUrl }}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                    <View style={{ flex: 1 }}>
                        <Text style={styles.legRoute}>
                            {leg.origin.displayCode} {formatTime(leg.departure)}{" "}
                            → {leg.destination.displayCode}{" "}
                            {formatTime(leg.arrival)}
                        </Text>
                        <Text style={styles.legDetails}>
                            {leg.origin.name} → {leg.destination.name} •{" "}
                            {formatDuration(leg.durationInMinutes)} •{" "}
                            {leg.stopCount === 0
                                ? "Direct"
                                : `${leg.stopCount} stop${
                                      leg.stopCount > 1 ? "s" : ""
                                  }`}
                        </Text>
                        <Text style={styles.legAirline}>
                            {leg.carriers.marketing[0].name}
                        </Text>
                    </View>
                </View>
            ))}
        </View>
    );
}

export default function ResultsScreen() {
    const params = useLocalSearchParams();

    return (
        <View style={styles.outerContainer}>
            <View style={styles.container}>
                <Text style={styles.title}>Flight Results</Text>
                <Text style={styles.subtitle}>
                    {params.origin} → {params.destination} on {params.date}
                </Text>
                <FlatList
                    data={mockItineraries}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <FlightCard itinerary={item} />}
                    contentContainerStyle={{ paddingBottom: 24 }}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
        backgroundColor: "#f9fafd",
    },
    container: {
        flex: 1,
        padding: 16,
        paddingTop: 48,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 8,
        textAlign: "center",
        color: "#22223b",
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 16,
        textAlign: "center",
        color: "#4a4e69",
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 20,
        marginBottom: 18,
        marginHorizontal: 8,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    price: {
        fontWeight: "bold",
        fontSize: 20,
        color: "#007AFF",
        marginBottom: 8,
    },
    legRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    logo: {
        width: 36,
        height: 36,
        marginRight: 12,
        borderRadius: 8,
        backgroundColor: "#f0f0f0",
    },
    legRoute: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#22223b",
    },
    legDetails: {
        fontSize: 13,
        color: "#4a4e69",
        marginBottom: 2,
    },
    legAirline: {
        fontSize: 13,
        color: "#007AFF",
        marginBottom: 2,
    },
});
