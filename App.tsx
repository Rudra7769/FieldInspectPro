import React, { useEffect } from "react";
import { StyleSheet, View, ActivityIndicator, Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import MainTabNavigator from "@/navigation/MainTabNavigator";
import LoginScreen from "@/screens/LoginScreen";
import JobFormScreen from "@/screens/JobFormScreen";
import SignatureScreen from "@/screens/SignatureScreen";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useAuthStore } from "@/src/store/authStore";
import { useJobStore } from "@/src/store/jobStore";
import { useTheme } from "@/hooks/useTheme";
import { initializeDatabase } from "@/src/services/database";

export type RootStackParamList = {
  Login: undefined;
  MainTabs: undefined;
  JobForm: { assignmentId?: string };
  Signature: { onSignatureCapture: (signature: string) => void };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  const { isAuthenticated, isLoading, loadSession } = useAuthStore();
  const { loadJobsFromDatabase, loadQueuedJobsFromDatabase, setDbReady } = useJobStore();
  const { theme } = useTheme();

  useEffect(() => {
    const bootstrap = async () => {
      try {
        await loadSession();
        if (Platform.OS !== 'web') {
          try {
            await initializeDatabase();
            setDbReady(true);
            await loadJobsFromDatabase();
            await loadQueuedJobsFromDatabase();
          } catch (dbError) {
            console.error('Database initialization error:', dbError);
            setDbReady(false);
          }
        }
      } catch (error) {
        console.error('Bootstrap error:', error);
      }
    };
    
    bootstrap();
  }, []);

  if (isLoading) {
    return (
      <View style={[styles.loading, { backgroundColor: theme.backgroundDefault }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <Stack.Screen name="Login" component={LoginScreen} />
      ) : (
        <>
          <Stack.Screen name="MainTabs" component={MainTabNavigator} />
          <Stack.Group screenOptions={{ presentation: 'modal' }}>
            <Stack.Screen 
              name="JobForm" 
              component={JobFormScreen}
              options={{ 
                headerShown: true,
                title: 'Inspection',
              }}
            />
            <Stack.Screen 
              name="Signature" 
              component={SignatureScreen}
              options={{ 
                headerShown: true,
                title: 'Signature',
              }}
            />
          </Stack.Group>
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <GestureHandlerRootView style={styles.root}>
          <KeyboardProvider>
            <NavigationContainer>
              <RootNavigator />
            </NavigationContainer>
            <StatusBar style="auto" />
          </KeyboardProvider>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
