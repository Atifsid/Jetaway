import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
    const colorScheme = useColorScheme();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
                headerShown: false,
                tabBarButton: HapticTab,
                tabBarStyle: Platform.select({
                    ios: {
                        position: "absolute",
                    },
                    default: {},
                }),
                tabBarItemStyle: { paddingTop: 3 },
                tabBarHideOnKeyboard: true,
            }}
        >
            <Tabs.Screen
                name="search-flights"
                options={{
                    title: "Search Flights",
                    tabBarIcon: ({ color }) => (
                        <IconSymbol
                            size={28}
                            name="airplane-search"
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="nearby-airports"
                options={{
                    title: "Nearby Airports",
                    headerShown: true,
                    tabBarIcon: ({ color }) => (
                        <IconSymbol
                            size={28}
                            name="airplane-marker"
                            color={color}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}
