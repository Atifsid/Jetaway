import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolWeight } from "expo-symbols";
import { OpaqueColorValue, type StyleProp, type TextStyle } from "react-native";

const MAPPING: Record<
    string,
    { set: "MaterialIcons" | "MaterialCommunityIcons"; name: string }
> = {
    "house.fill": { set: "MaterialIcons", name: "home" },
    "paperplane.fill": { set: "MaterialIcons", name: "send" },
    "chevron.left.forwardslash.chevron.right": {
        set: "MaterialIcons",
        name: "code",
    },
    "chevron.right": { set: "MaterialIcons", name: "chevron-right" },
    "flight-takeoff": { set: "MaterialIcons", name: "flight-takeoff" },
    "airplane-search": {
        set: "MaterialCommunityIcons",
        name: "airplane-search",
    },
    "airplane-marker": {
        set: "MaterialCommunityIcons",
        name: "airplane-marker",
    },
};

type IconSymbolName = keyof typeof MAPPING;

export function IconSymbol({
    name,
    size = 24,
    color,
    style,
    weight,
}: {
    name: IconSymbolName;
    size?: number;
    color: string | OpaqueColorValue;
    style?: StyleProp<TextStyle>;
    weight?: SymbolWeight;
}) {
    const icon = MAPPING[name];
    if (icon.set === "MaterialCommunityIcons") {
        return (
            <MaterialCommunityIcons
                color={color}
                size={size}
                name={icon.name as any}
                style={style}
            />
        );
    }
    return (
        <MaterialIcons
            color={color}
            size={size}
            name={icon.name as any}
            style={style}
        />
    );
}
