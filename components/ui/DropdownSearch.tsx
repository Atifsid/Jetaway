import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
    ActivityIndicator,
    FlatList,
    Modal,
    Platform,
    StyleProp,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ViewStyle,
} from "react-native";

interface DropdownSearchProps {
    value: any;
    onSelect: (item: any) => void;
    placeholder?: string;
    style?: StyleProp<ViewStyle>;
    query: string;
    onQueryChange: (query: string) => void;
    results: any[];
    loading?: boolean;
    modalTitle?: string;
}

export default function DropdownSearch({
    value,
    onSelect,
    placeholder,
    style,
    query,
    onQueryChange,
    results,
    loading = false,
    modalTitle = "Search",
}: DropdownSearchProps) {
    const [modalVisible, setModalVisible] = React.useState(false);

    const grouped = results.reduce((acc: any[], item) => {
        if (
            item.navigation?.entityType === "AIRPORT" &&
            item.navigation?.relevantHotelParams?.entityType === "CITY"
        ) {
            const cityId = item.navigation.relevantHotelParams.entityId;
            let group = acc.find((g: any) => g.cityId === cityId);
            if (!group) {
                group = {
                    cityId,
                    cityTitle:
                        item.navigation.relevantHotelParams.localizedName,
                    citySubtitle: item.presentation?.subtitle,
                    airports: [],
                };
                acc.push(group);
            }
            group.airports.push(item);
        } else {
            acc.push({
                cityId: item.entityId,
                cityTitle: item.presentation?.title,
                citySubtitle: item.presentation?.subtitle,
                airports: [],
                item,
            });
        }
        return acc;
    }, []);

    return (
        <>
            <TouchableOpacity
                onPress={() => {
                    setModalVisible(true);
                    onQueryChange("");
                }}
                style={style}
                activeOpacity={0.7}
            >
                <Text
                    style={[
                        styles.inputText,
                        { color: value ? "#222" : "#757575" },
                    ]}
                    numberOfLines={1}
                >
                    {value
                        ? value.presentation?.suggestionTitle
                        : placeholder || "Select..."}
                </Text>
            </TouchableOpacity>
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{modalTitle}</Text>
                            <TouchableOpacity
                                style={styles.closeBtn}
                                onPress={() => setModalVisible(false)}
                            >
                                <Ionicons name="close" size={22} color="#222" />
                            </TouchableOpacity>
                        </View>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search..."
                            value={query}
                            onChangeText={onQueryChange}
                            autoFocus
                        />
                        {loading ? (
                            <ActivityIndicator
                                size="small"
                                color="#1976D2"
                                style={{ marginVertical: 16 }}
                            />
                        ) : (
                            <FlatList
                                data={grouped}
                                keyExtractor={(item) => item.cityId}
                                renderItem={({ item }) => (
                                    <View>
                                        <TouchableOpacity
                                            style={styles.groupHeader}
                                            onPress={() => {
                                                if (item.item) {
                                                    onSelect(item.item);
                                                    setModalVisible(false);
                                                    onQueryChange("");
                                                }
                                            }}
                                        >
                                            <Text style={styles.groupTitle}>
                                                {item.cityTitle}
                                            </Text>
                                            {item.citySubtitle ? (
                                                <Text
                                                    style={styles.groupSubtitle}
                                                >
                                                    {item.citySubtitle}
                                                </Text>
                                            ) : null}
                                        </TouchableOpacity>
                                        {item.airports.length > 0 && (
                                            <View style={styles.nestedList}>
                                                {item.airports.map(
                                                    (airport: any) => (
                                                        <TouchableOpacity
                                                            key={
                                                                airport.entityId
                                                            }
                                                            style={
                                                                styles.nestedItem
                                                            }
                                                            onPress={() => {
                                                                onSelect(
                                                                    airport
                                                                );
                                                                setModalVisible(
                                                                    false
                                                                );
                                                                onQueryChange(
                                                                    ""
                                                                );
                                                            }}
                                                        >
                                                            <Text
                                                                style={
                                                                    styles.airportTitle
                                                                }
                                                            >
                                                                {
                                                                    airport
                                                                        .presentation
                                                                        ?.suggestionTitle
                                                                }
                                                            </Text>
                                                            <Text
                                                                style={
                                                                    styles.airportSubtitle
                                                                }
                                                            >
                                                                {
                                                                    airport
                                                                        .presentation
                                                                        ?.subtitle
                                                                }
                                                            </Text>
                                                        </TouchableOpacity>
                                                    )
                                                )}
                                            </View>
                                        )}
                                    </View>
                                )}
                                ListEmptyComponent={
                                    <Text
                                        style={{
                                            textAlign: "center",
                                            color: "#888",
                                            marginTop: 24,
                                        }}
                                    >
                                        No results found.
                                    </Text>
                                }
                                keyboardShouldPersistTaps="handled"
                            />
                        )}
                    </View>
                </View>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    inputText: {
        fontSize: 16,
        paddingVertical: 12,
        textAlignVertical: "center",
        width: "100%",
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.2)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        width: "90%",
        maxHeight: "80%",
        minHeight: 250,
        backgroundColor: "#fff",
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingTop: 8,
        ...Platform.select({
            android: { elevation: 4 },
            ios: { shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 8 },
        }),
    },
    searchInput: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 10,
        marginBottom: 12,
        fontSize: 16,
        marginTop: 20,
    },
    groupHeader: {
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    groupTitle: {
        fontWeight: "bold",
        fontSize: 16,
    },
    groupSubtitle: {
        color: "#666",
        fontSize: 14,
    },
    nestedList: {
        paddingLeft: 16,
        backgroundColor: "#f7fafd",
    },
    nestedItem: {
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    airportTitle: {
        fontSize: 15,
        fontWeight: "500",
    },
    airportSubtitle: {
        color: "#888",
        fontSize: 13,
    },
    closeBtn: {
        width: 18,
        height: 18,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 16,
    },
    modalHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#22223b",
        textAlign: "right",
    },
});
