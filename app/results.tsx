import FlightCard from "@/components/ui/FlightCard";
import { useLocalSearchParams } from "expo-router";
import { FlatList, StyleSheet, Text, View } from "react-native";

export default function ResultsScreen() {
    const params = useLocalSearchParams();
    let flights: any[] = [];

    if (params.flights) {
        if (typeof params.flights === "string") {
            try {
                const parsed = JSON.parse(params.flights);
                if (Array.isArray(parsed)) {
                    flights = parsed;
                } else {
                    console.warn("Parsed flights is not an array:", parsed);
                }
            } catch (err) {
                console.warn("Failed to parse flights string:", err);
            }
        } else if (Array.isArray(params.flights)) {
            flights = params.flights;
        } else {
            console.warn(
                "Unexpected type for params.flights:",
                typeof params.flights
            );
        }
    }

    return (
        <View style={styles.outerContainer}>
            <View style={styles.container}>
                <Text style={styles.title}>Flight Results</Text>
                <Text style={styles.subtitle}>
                    {params.origin} → {params.destination} on {params.date}
                </Text>
                <FlatList
                    data={flights}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <FlightCard itinerary={item} />}
                    contentContainerStyle={{
                        paddingBottom: 24,
                        paddingTop: 6,
                    }}
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
});
