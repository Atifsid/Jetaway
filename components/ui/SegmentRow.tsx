import { formatDuration, formatTime } from "@/utils";
import { Text, View } from "react-native";

export default function SegmentRow({ segment }: { segment: any }) {
    return (
        <View
            style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 6,
                marginLeft: 12,
            }}
        >
            <Text style={{ fontWeight: "bold", color: "#007AFF", width: 60 }}>
                {segment.flightNumber ? `#${segment.flightNumber}` : ""}
            </Text>
            <Text style={{ flex: 1, color: "#22223b" }}>
                {segment.origin.displayCode} {formatTime(segment.departure)} →{" "}
                {segment.destination.displayCode} {formatTime(segment.arrival)}
            </Text>
            <Text style={{ color: "#4a4e69", width: 60, textAlign: "right" }}>
                {formatDuration(segment.durationInMinutes)}
            </Text>
        </View>
    );
}
