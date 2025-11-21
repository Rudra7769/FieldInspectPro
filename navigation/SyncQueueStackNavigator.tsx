import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getCommonScreenOptions } from './screenOptions';
import { useTheme } from '../hooks/useTheme';

export type SyncQueueStackParamList = {
  SyncQueue: undefined;
};

const Stack = createNativeStackNavigator<SyncQueueStackParamList>();

export default function SyncQueueStackNavigator() {
  const { theme, isDark } = useTheme();

  // return (
  //   // <Stack.Navigator screenOptions={getCommonScreenOptions({ theme, isDark })}>
  //   </Stack.Navigator>
  // );
}
