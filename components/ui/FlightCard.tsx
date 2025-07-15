import { formatDuration, formatTime } from "@/utils";
import { Image, StyleSheet, Text, View } from "react-native";

export default function FlightCard({ itinerary }: { itinerary: any }) {
    const leg = itinerary.legs[0];
    const airline = leg.carriers.marketing[0];
    return (
        <View style={styles.card}>
            <View style={styles.topRow}>
                <Text style={styles.airlineName}>{airline.name}</Text>
                <Image
                    source={{ uri: airline.logoUrl }}
                    style={styles.logo}
                    resizeMode="contain"
                />
                <Text style={styles.price}>{itinerary.price.formatted}</Text>
            </View>
            <View style={styles.middleRow}>
                <View style={styles.timeBlock}>
                    <Text style={styles.label}>Depart</Text>
                    <Text style={styles.time}>{formatTime(leg.departure)}</Text>
                </View>
                <View style={styles.durationPill}>
                    <Text style={styles.durationText}>
                        {formatDuration(leg.durationInMinutes)}
                    </Text>
                </View>
                <View style={styles.timeBlock}>
                    <Text style={styles.label}>Arrive</Text>
                    <Text style={styles.time}>{formatTime(leg.arrival)}</Text>
                </View>
            </View>
            {/* <TouchableOpacity style={styles.detailsBtn} activeOpacity={0.7}>
                <Text style={styles.detailsText}>View Details</Text>
            </TouchableOpacity> */}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        borderRadius: 16,
        paddingVertical: 18,
        paddingHorizontal: 20,
        marginBottom: 18,
        marginHorizontal: 8,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
        alignItems: "center",
    },
    topRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        marginBottom: 10,
    },
    airlineName: {
        fontSize: 16,
        fontWeight: "600",
        color: "#22223b",
        flex: 1,
    },
    logo: {
        width: 48,
        height: 32,
        marginHorizontal: 8,
    },
    price: {
        fontWeight: "bold",
        fontSize: 18,
        color: "#22223b",
        flex: 1,
        textAlign: "right",
    },
    middleRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        marginBottom: 12,
        marginTop: 2,
    },
    timeBlock: {
        alignItems: "center",
        flex: 1,
    },
    label: {
        fontSize: 12,
        color: "#888",
        marginBottom: 2,
    },
    time: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#22223b",
        letterSpacing: 1,
    },
    durationPill: {
        backgroundColor: "#f3f6fa",
        borderRadius: 16,
        paddingHorizontal: 14,
        paddingVertical: 4,
        alignItems: "center",
        justifyContent: "center",
        minWidth: 70,
        marginHorizontal: 8,
    },
    durationText: {
        fontSize: 13,
        fontWeight: "600",
        color: "#4a4e69",
        letterSpacing: 1,
    },
    detailsBtn: {
        marginTop: 6,
        paddingVertical: 6,
        paddingHorizontal: 18,
        borderRadius: 8,
        backgroundColor: "#f3f6fa",
    },
    detailsText: {
        color: "#22223b",
        fontWeight: "600",
        fontSize: 15,
    },
});
