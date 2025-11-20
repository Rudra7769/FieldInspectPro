import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import JobsScreen from '../screens/JobsScreen';
import JobDetailsScreen from '../screens/JobDetailsScreen';
import { getCommonScreenOptions } from './screenOptions';
import { useTheme } from '../hooks/useTheme';

export type JobsStackParamList = {
  Jobs: undefined;
  JobDetails: { jobId: string };
};

const Stack = createNativeStackNavigator<JobsStackParamList>();

export default function JobsStackNavigator() {
  const { theme, isDark } = useTheme();

  return (
    <Stack.Navigator screenOptions={getCommonScreenOptions({ theme, isDark })}>
      <Stack.Screen
        name="Jobs"
        component={JobsScreen}
        options={{ title: 'Jobs' }}
      />
      <Stack.Screen
        name="JobDetails"
        component={JobDetailsScreen}
        options={{ title: 'Inspection Details' }}
      />
    </Stack.Navigator>
  );
}
