import { formatDuration, formatTime } from "@/utils";
import { Image, StyleSheet, Text, View } from "react-native";
import SegmentRow from "./SegmentRow";

export default function FlightCard({ itinerary }: { itinerary: any }) {
    return (
        <View style={styles.card}>
            <Text style={styles.price}>{itinerary.price.formatted}</Text>
            {itinerary.legs.map((leg: any, idx: number) => (
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
                        {Array.isArray(leg.segments) &&
                            leg.segments.length > 0 && (
                                <View style={{ marginTop: 6, marginBottom: 2 }}>
                                    <Text
                                        style={{
                                            fontSize: 13,
                                            color: "#888",
                                            marginBottom: 2,
                                        }}
                                    >
                                        Segments:
                                    </Text>
                                    {leg.segments.map((segment: any) => (
                                        <SegmentRow
                                            key={segment.id}
                                            segment={segment}
                                        />
                                    ))}
                                </View>
                            )}
                    </View>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
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
