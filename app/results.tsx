import FlightCard from "@/components/ui/FlightCard";
import { useLocalSearchParams } from "expo-router";
import { FlatList, StyleSheet, Text, View } from "react-native";

function formatDate(dateStr: string | undefined) {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

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

    const departure = params.departure as string | undefined;
    const returnDate = params.returnDate as string | undefined;

    let dateText = "";
    if (departure && returnDate) {
        dateText = `Departure: ${formatDate(
            departure
        )}  |  Return: ${formatDate(returnDate)}`;
    } else if (departure) {
        dateText = `Departure: ${formatDate(departure)}`;
    }

    return (
        <View style={styles.outerContainer}>
            <View style={styles.container}>
                <Text style={styles.title}>Flight Results</Text>
                <Text style={styles.subtitle}>
                    {params.origin} → {params.destination}
                </Text>
                {dateText && (
                    <Text
                        style={[
                            styles.subtitle,
                            {
                                marginTop: -8,
                                marginBottom: 16,
                                fontSize: 15,
                                color: "#888",
                            },
                        ]}
                    >
                        {dateText}
                    </Text>
                )}
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
