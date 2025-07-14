import axios from "axios";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    StyleSheet,
    Text,
    View,
} from "react-native";
import MapView from "react-native-maps";
import { ThemedText } from "../../components/ThemedText";
import { ThemedView } from "../../components/ThemedView";

const INITIAL_REGION = {
    latitude: 40.7128,
    longitude: -74.006,
    latitudeDelta: 0.3,
    longitudeDelta: 0.3,
};

export default function NearbyAirportsScreen() {
    const [region, setRegion] = useState(INITIAL_REGION);
    const [loading, setLoading] = useState(true);
    const [permissionGranted, setPermissionGranted] = useState<boolean | null>(
        null
    );
    const [currentAirport, setCurrentAirport] = useState<any>(null);
    const [nearbyAirports, setNearbyAirports] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            setLoading(true);
            let lat = INITIAL_REGION.latitude;
            let lng = INITIAL_REGION.longitude;
            try {
                let { status } =
                    await Location.requestForegroundPermissionsAsync();
                if (status === "granted") {
                    setPermissionGranted(true);
                    let loc = await Location.getCurrentPositionAsync({});
                    lat = loc.coords.latitude;
                    lng = loc.coords.longitude;
                    setRegion({
                        latitude: lat,
                        longitude: lng,
                        latitudeDelta: 0.1,
                        longitudeDelta: 0.1,
                    });
                } else {
                    setPermissionGranted(false);
                }
            } catch (e) {
                setPermissionGranted(false);
            }
            // Fetch current and nearby airports from API
            try {
                const options = {
                    method: "GET",
                    url: `${process.env.EXPO_PUBLIC_SKY_SCRAPPER_BASE_URL}/flights/getNearByAirports`,
                    params: {
                        lat: lat.toString(),
                        lng: lng.toString(),
                        locale: "en-US",
                    },
                    headers: {
                        "x-rapidapi-key": process.env.EXPO_PUBLIC_RAPID_API_KEY,
                        "x-rapidapi-host":
                            process.env.EXPO_PUBLIC_SKY_SCRAPPER_HOST,
                    },
                };
                const response = await axios.request(options);
                const data = response.data.data;
                setCurrentAirport(data.current);
                setNearbyAirports(data.nearby || []);
                setError(null);
            } catch (err) {
                setError("Failed to fetch nearby airports.");
                setCurrentAirport(null);
                setNearbyAirports([]);
            }
            setLoading(false);
        })();
    }, []);

    if (loading) {
        return (
            <ThemedView
                style={[
                    styles.container,
                    { justifyContent: "center", alignItems: "center" },
                ]}
            >
                <ActivityIndicator size="large" color="#888" />
                <ThemedText style={{ marginTop: 16 }}>
                    Loading, Please wait
                </ThemedText>
            </ThemedView>
        );
    }

    if (permissionGranted === false) {
        return (
            <ThemedView
                style={[
                    styles.container,
                    { justifyContent: "center", alignItems: "center" },
                ]}
            >
                <ThemedText type="title" style={{ textAlign: "center" }}>
                    Location permission denied.\nUnable to show nearby airports.
                </ThemedText>
            </ThemedView>
        );
    }

    // Combine current and nearby airports for the list
    const allAirports = [
        ...(currentAirport ? [{ ...currentAirport, isCurrent: true }] : []),
        ...nearbyAirports.map((a) => ({ ...a, isCurrent: false })),
    ];

    return (
        <ThemedView style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={INITIAL_REGION}
                region={region}
                showsUserLocation={true}
            />
            <FlatList
                data={allAirports}
                keyExtractor={(item) =>
                    item.navigation?.relevantFlightParams?.skyId ||
                    item.presentation?.title
                }
                renderItem={({ item }) => (
                    <View style={styles.airportListItem}>
                        <Text style={styles.airportTitle}>
                            {item.presentation?.suggestionTitle}
                            {item.isCurrent ? " (Current)" : ""}
                        </Text>
                        <Text style={styles.airportSubtitle}>
                            {item.presentation?.subtitle}
                        </Text>
                    </View>
                )}
                ListEmptyComponent={
                    <Text style={{ textAlign: "center", color: "#888" }}>
                        No airports found.
                    </Text>
                }
                contentContainerStyle={{ paddingBottom: 24 }}
            />
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    map: {
        flex: 1,
        width: Dimensions.get("window").width,
        minHeight: 300,
    },
    markerContainer: {
        backgroundColor: "#fff",
        borderRadius: 24,
        padding: 6,
        borderWidth: 1,
        borderColor: "#ccc",
        alignItems: "center",
        justifyContent: "center",
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    markerIcon: {
        width: 28,
        height: 28,
        resizeMode: "contain",
    },
    airportListItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    airportTitle: {
        fontWeight: "bold",
        fontSize: 16,
    },
    airportSubtitle: {
        color: "#666",
        fontSize: 14,
    },
});
