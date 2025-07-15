import React from "react";
import {
    ActivityIndicator,
    Image,
    Linking,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function FlightDetailsModal({
    visible,
    onClose,
    loading,
    error,
    details,
}: {
    visible: boolean;
    onClose: () => void;
    loading?: boolean;
    error?: string | null;
    details?: any;
}) {
    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.overlay}>
                <View style={styles.modal}>
                    {/* Always show close button */}
                    <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                        <Text style={styles.closeText}>×</Text>
                    </TouchableOpacity>
                    {loading ? (
                        <View style={styles.centered}>
                            <ActivityIndicator size="large" color="#1976D2" />
                        </View>
                    ) : error ? (
                        <View style={styles.centered}>
                            <Text style={styles.error}>{error}</Text>
                        </View>
                    ) : details ? (
                        <ScrollView showsVerticalScrollIndicator={false}>
                            {details.destinationImage && (
                                <Image
                                    source={{ uri: details.destinationImage }}
                                    style={styles.headerImage}
                                />
                            )}
                            <View style={styles.headerRow}>
                                <Image
                                    source={{
                                        uri: details.legs[0].carriers
                                            .marketing[0].logoUrl,
                                    }}
                                    style={styles.airlineLogo}
                                />
                                <View style={{ flex: 1, alignItems: "center" }}>
                                    <Text style={styles.airlineName}>
                                        {
                                            details.legs[0].carriers
                                                .marketing[0].name
                                        }
                                    </Text>
                                    <Text style={styles.route}>
                                        {details.legs[0].origin.displayCode} →{" "}
                                        {
                                            details.legs[0].destination
                                                .displayCode
                                        }
                                    </Text>
                                </View>
                                <Text style={styles.price}>
                                    {details.price?.formatted || ""}
                                </Text>
                            </View>
                            <View style={styles.infoRow}>
                                <View style={styles.infoBlock}>
                                    <Text style={styles.label}>Depart</Text>
                                    <Text style={styles.infoText}>
                                        {formatTime(details.legs[0].departure)}
                                    </Text>
                                </View>
                                <View style={styles.infoBlock}>
                                    <Text style={styles.label}>Duration</Text>
                                    <Text style={styles.infoText}>
                                        {formatDuration(
                                            details.legs[0].durationInMinutes ||
                                                details.legs[0].duration
                                        )}
                                    </Text>
                                </View>
                                <View style={styles.infoBlock}>
                                    <Text style={styles.label}>Arrive</Text>
                                    <Text style={styles.infoText}>
                                        {formatTime(details.legs[0].arrival)}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.stopsRow}>
                                <Text style={styles.stopsText}>
                                    {details.legs[0].stopCount === 0
                                        ? "Direct"
                                        : `${details.legs[0].stopCount} stop${
                                              details.legs[0].stopCount > 1
                                                  ? "s"
                                                  : ""
                                          }`}
                                </Text>
                            </View>
                            {Array.isArray(details.legs[0].segments) &&
                                details.legs[0].segments.length > 0 && (
                                    <View style={styles.segmentsSection}>
                                        <Text style={styles.sectionTitle}>
                                            Segments
                                        </Text>
                                        {details.legs[0].segments.map(
                                            (seg: any) => (
                                                <View
                                                    key={seg.id}
                                                    style={styles.segmentCard}
                                                >
                                                    <Text
                                                        style={
                                                            styles.segmentRoute
                                                        }
                                                    >
                                                        {seg.origin.displayCode}{" "}
                                                        →{" "}
                                                        {
                                                            seg.destination
                                                                .displayCode
                                                        }
                                                    </Text>
                                                    <Text
                                                        style={
                                                            styles.segmentTime
                                                        }
                                                    >
                                                        {formatTime(
                                                            seg.departure
                                                        )}{" "}
                                                        -{" "}
                                                        {formatTime(
                                                            seg.arrival
                                                        )}
                                                    </Text>
                                                    <Text
                                                        style={
                                                            styles.segmentFlight
                                                        }
                                                    >
                                                        Flight{" "}
                                                        {seg.flightNumber} (
                                                        {
                                                            seg.marketingCarrier
                                                                .displayCode
                                                        }
                                                        )
                                                    </Text>
                                                </View>
                                            )
                                        )}
                                    </View>
                                )}
                            {Array.isArray(details.pricingOptions) &&
                                details.pricingOptions.length > 0 && (
                                    <View style={styles.bookSection}>
                                        <Text style={styles.sectionTitle}>
                                            Booking Options
                                        </Text>
                                        {details.pricingOptions.map(
                                            (opt: any, idx: number) => (
                                                <View
                                                    key={idx}
                                                    style={styles.agentCard}
                                                >
                                                    <View style={{ flex: 1 }}>
                                                        <Text
                                                            style={
                                                                styles.agentName
                                                            }
                                                        >
                                                            {opt.agents[0].name}
                                                        </Text>
                                                        <Text
                                                            style={
                                                                styles.agentPrice
                                                            }
                                                        >
                                                            ${opt.totalPrice}
                                                        </Text>
                                                        {opt.agents[0]
                                                            .rating && (
                                                            <Text
                                                                style={
                                                                    styles.agentRating
                                                                }
                                                            >
                                                                ⭐{" "}
                                                                {opt.agents[0].rating.value.toFixed(
                                                                    1
                                                                )}{" "}
                                                                (
                                                                {
                                                                    opt
                                                                        .agents[0]
                                                                        .rating
                                                                        .count
                                                                }
                                                                )
                                                            </Text>
                                                        )}
                                                    </View>
                                                    <TouchableOpacity
                                                        style={styles.bookBtn}
                                                        onPress={() =>
                                                            Linking.openURL(
                                                                opt.agents[0]
                                                                    .url
                                                            )
                                                        }
                                                    >
                                                        <Text
                                                            style={
                                                                styles.bookBtnText
                                                            }
                                                        >
                                                            Book
                                                        </Text>
                                                    </TouchableOpacity>
                                                </View>
                                            )
                                        )}
                                    </View>
                                )}
                        </ScrollView>
                    ) : (
                        <View style={styles.centered}>
                            <Text style={styles.error}>
                                No details to display.
                            </Text>
                        </View>
                    )}
                </View>
            </View>
        </Modal>
    );
}

function formatTime(iso: string) {
    if (!iso) return "-";
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
function formatDuration(mins: number) {
    if (!mins && mins !== 0) return "-";
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m}m`;
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.25)",
        justifyContent: "center",
        alignItems: "center",
    },
    modal: {
        width: "92%",
        maxHeight: "90%",
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 0,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 4 },
        elevation: 8,
    },
    closeBtn: {
        position: "absolute",
        top: 8,
        right: 12,
        zIndex: 2,
        backgroundColor: "#f3f6fa",
        borderRadius: 16,
        width: 32,
        height: 32,
        alignItems: "center",
        justifyContent: "center",
    },
    closeText: {
        fontSize: 24,
        color: "#22223b",
        fontWeight: "bold",
    },
    headerImage: {
        width: "100%",
        height: 120,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        marginBottom: 8,
    },
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 18,
        marginTop: 12,
        marginBottom: 8,
    },
    airlineLogo: {
        width: 48,
        height: 32,
        marginRight: 10,
    },
    airlineName: {
        fontSize: 18,
        fontWeight: "700",
        color: "#1976D2",
    },
    route: {
        fontSize: 15,
        color: "#4a4e69",
        marginTop: 2,
    },
    price: {
        fontWeight: "bold",
        fontSize: 20,
        color: "#22223b",
        marginLeft: 10,
    },
    infoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 18,
        marginBottom: 4,
    },
    infoBlock: {
        alignItems: "center",
        flex: 1,
    },
    label: {
        fontSize: 12,
        color: "#888",
        marginBottom: 2,
    },
    infoText: {
        fontSize: 17,
        fontWeight: "bold",
        color: "#22223b",
    },
    stopsRow: {
        alignItems: "center",
        marginBottom: 8,
    },
    stopsText: {
        fontSize: 14,
        color: "#1976D2",
        fontWeight: "600",
    },
    segmentsSection: {
        paddingHorizontal: 18,
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: "bold",
        color: "#22223b",
        marginBottom: 6,
        marginTop: 8,
    },
    segmentCard: {
        backgroundColor: "#f3f6fa",
        borderRadius: 10,
        padding: 10,
        marginBottom: 6,
    },
    segmentRoute: {
        fontWeight: "600",
        color: "#22223b",
        fontSize: 14,
    },
    segmentTime: {
        color: "#4a4e69",
        fontSize: 13,
        marginBottom: 2,
    },
    segmentFlight: {
        color: "#888",
        fontSize: 12,
    },
    bookSection: {
        paddingHorizontal: 18,
        marginBottom: 18,
    },
    agentCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f7fafd",
        borderRadius: 10,
        padding: 10,
        marginBottom: 8,
    },
    agentName: {
        fontWeight: "600",
        fontSize: 15,
        color: "#22223b",
    },
    agentPrice: {
        fontWeight: "bold",
        fontSize: 16,
        color: "#1976D2",
        marginTop: 2,
    },
    agentRating: {
        fontSize: 13,
        color: "#888",
        marginTop: 2,
    },
    bookBtn: {
        backgroundColor: "#1976D2",
        borderRadius: 8,
        paddingVertical: 7,
        paddingHorizontal: 18,
        marginLeft: 12,
    },
    bookBtnText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 15,
    },
    centered: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        minHeight: 200,
    },
    error: {
        color: "#d32f2f",
        fontSize: 16,
        textAlign: "center",
    },
});
