import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolWeight } from "expo-symbols";
import { OpaqueColorValue, type StyleProp, type TextStyle } from "react-native";

const MAPPING: Record<string, string> = {
    "house.fill": "home",
    "paperplane.fill": "send",
    "chevron.left.forwardslash.chevron.right": "code",
    "chevron.right": "chevron-right",
    "flight-takeoff": "flight-takeoff",
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
    return (
        <MaterialIcons
            color={color}
            size={size}
            name={MAPPING[name] as any}
            style={style}
        />
    );
}
