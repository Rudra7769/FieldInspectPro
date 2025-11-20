import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Platform, StyleSheet, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import HomeStackNavigator from "@/navigation/HomeStackNavigator";
import JobsStackNavigator from "@/navigation/JobsStackNavigator";
import SyncQueueStackNavigator from "@/navigation/SyncQueueStackNavigator";
import ProfileStackNavigator from "@/navigation/ProfileStackNavigator";
import { useTheme } from "@/hooks/useTheme";
import { Spacing } from "@/constants/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type MainTabParamList = {
  HomeTab: undefined;
  JobsTab: undefined;
  SyncQueueTab: undefined;
  ProfileTab: undefined;
};

export type RootStackParamList = {
  MainTabs: undefined;
  JobForm: { assignmentId?: string };
  Signature: { onSignatureCapture: (signature: string) => void };
};

const Tab = createBottomTabNavigator<MainTabParamList>();

function FloatingActionButton() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <Pressable
      style={({ pressed }) => [
        styles.fab,
        {
          backgroundColor: theme.primary,
          bottom: insets.bottom + 70,
          opacity: pressed ? 0.8 : 1,
        },
      ]}
      onPress={() => navigation.navigate('JobForm', {})}
    >
      <Feather name="plus" size={28} color={theme.buttonText} />
    </Pressable>
  );
}

export default function MainTabNavigator() {
  const { theme, isDark } = useTheme();

  return (
    <>
      <Tab.Navigator
        initialRouteName="HomeTab"
        screenOptions={{
          tabBarActiveTintColor: theme.tabIconSelected,
          tabBarInactiveTintColor: theme.tabIconDefault,
          tabBarStyle: {
            position: "absolute",
            backgroundColor: Platform.select({
              ios: "transparent",
              android: theme.backgroundRoot,
            }),
            borderTopWidth: 0,
            elevation: 0,
          },
          tabBarBackground: () =>
            Platform.OS === "ios" ? (
              <BlurView
                intensity={100}
                tint={isDark ? "dark" : "light"}
                style={StyleSheet.absoluteFill}
              />
            ) : null,
          headerShown: false,
        }}
      >
        <Tab.Screen
          name="HomeTab"
          component={HomeStackNavigator}
          options={{
            title: "Home",
            tabBarIcon: ({ color, size }) => (
              <Feather name="home" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="JobsTab"
          component={JobsStackNavigator}
          options={{
            title: "Jobs",
            tabBarIcon: ({ color, size }) => (
              <Feather name="check-square" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="SyncQueueTab"
          component={SyncQueueStackNavigator}
          options={{
            title: "Sync",
            tabBarIcon: ({ color, size }) => (
              <Feather name="upload-cloud" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="ProfileTab"
          component={ProfileStackNavigator}
          options={{
            title: "Profile",
            tabBarIcon: ({ color, size }) => (
              <Feather name="user" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
      <FloatingActionButton />
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
});
