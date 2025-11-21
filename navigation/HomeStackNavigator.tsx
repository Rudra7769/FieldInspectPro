import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DashboardScreen from "@/screens/DashboardScreen";
import AssignmentFlatsScreen from "@/screens/AssignmentFlatsScreen";
import FlatWorkFormScreen from "@/screens/FlatWorkFormScreen";
import { HeaderTitle } from "@/components/HeaderTitle";
import { useTheme } from "@/hooks/useTheme";
import { getCommonScreenOptions } from "@/navigation/screenOptions";

export type HomeStackParamList = {
  Dashboard: undefined;
  AssignmentFlats: { assignment: import("@/src/types").Assignment };
  FlatWorkForm: { flatNumber: string; societyName: string };
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeStackNavigator() {
  const { theme, isDark } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        ...getCommonScreenOptions({ theme, isDark, transparent: false }),
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          headerTitle: () => <HeaderTitle title="Field Inspector" />,
        }}
      />
      <Stack.Screen
        name="AssignmentFlats"
        component={AssignmentFlatsScreen}
        options={{
          title: "Flats",
        }}
      />
      <Stack.Screen
        name="FlatWorkForm"
        component={FlatWorkFormScreen}
        options={{
          title: "Work Details",
        }}
      />
    </Stack.Navigator>
  );
}
