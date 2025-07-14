import * as Location from "expo-location";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    Image,
    StyleSheet,
    View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { ThemedText } from "../../components/ThemedText";
import { ThemedView } from "../../components/ThemedView";

const mockAirports = [
    {
        id: "JFK",
        name: "John F. Kennedy International Airport",
        code: "JFK",
        latitude: 40.6413,
        longitude: -73.7781,
    },
    {
        id: "EWR",
        name: "Newark Liberty International Airport",
        code: "EWR",
        latitude: 40.6895,
        longitude: -74.1745,
    },
    {
        id: "LGA",
        name: "LaGuardia Airport",
        code: "LGA",
        latitude: 40.7769,
        longitude: -73.874,
    },
];

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

    useEffect(() => {
        (async () => {
            setLoading(true);
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                setPermissionGranted(false);
                setLoading(false);
                return;
            }
            setPermissionGranted(true);
            let loc = await Location.getCurrentPositionAsync({});
            setRegion({
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
                latitudeDelta: 0.1,
                longitudeDelta: 0.1,
            });
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

    return (
        <ThemedView style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={INITIAL_REGION}
                region={region}
                showsUserLocation={true}
            >
                {mockAirports.map((airport) => (
                    <Marker
                        key={airport.id}
                        coordinate={{
                            latitude: airport.latitude,
                            longitude: airport.longitude,
                        }}
                        title={airport.name}
                        description={airport.code}
                    >
                        <View style={styles.markerContainer}>
                            <Image
                                source={require("../../assets/images/airport-marker.png")}
                                style={styles.markerIcon}
                            />
                        </View>
                    </Marker>
                ))}
            </MapView>
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
});
