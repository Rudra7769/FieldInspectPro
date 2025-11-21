// screens/LoginScreen.tsx

import React, { useState } from "react";
import { View, StyleSheet, TextInput, Pressable, ActivityIndicator } from "react-native";
import { ThemedText } from "../components/ThemedText";
import { ThemedView } from "../components/ThemedView";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuthStore } from "../src/store/authStore";
import { Feather } from "@expo/vector-icons";

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const login = useAuthStore((s) => s.login);

  const [email, setEmail] = useState("demo@engineer.com");
  const [password, setPassword] = useState("demo123");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Enter email & password");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await login(email.trim(), password);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top + 40 }]}>
      <View style={styles.header}>
        <View style={styles.iconCircle}>
          <Feather name="clipboard" size={32} color="#0ea5e9" />
        </View>
        <ThemedText style={styles.title}>Field Inspector</ThemedText>
        <ThemedText style={styles.subtitle}>Engineer login to continue</ThemedText>
      </View>

      <View style={styles.form}>
        <View style={styles.fieldGroup}>
          <ThemedText style={styles.label}>Email</ThemedText>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            placeholder="Enter your email"
            placeholderTextColor="rgba(255,255,255,0.5)"
          />
        </View>

        <View style={styles.fieldGroup}>
          <ThemedText style={styles.label}>Password</ThemedText>
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, { paddingRight: 45 }]}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              placeholder="Enter your password"
              placeholderTextColor="rgba(255,255,255,0.5)"
            />
            <Pressable
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Feather name={showPassword ? "eye-off" : "eye"} size={20} color="rgba(255,255,255,0.7)" />
            </Pressable>
          </View>
        </View>

        {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}

        <Pressable
          style={styles.button}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <ThemedText style={styles.buttonText}>LOGIN</ThemedText>
          )}
        </Pressable>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: "#020617" },
  header: { alignItems: "center", marginBottom: 40, gap: 8 },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(15,23,42,0.9)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.4)",
  },
  title: { fontSize: 26, fontWeight: "700", marginTop: 12, color: "#fff" },
  subtitle: { color: "rgba(255,255,255,0.7)" },
  form: { gap: 18 },
  fieldGroup: { gap: 6 },
  label: { color: "rgba(255,255,255,0.9)", fontSize: 14 },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "rgba(148,163,184,0.5)",
    paddingHorizontal: 14,
    color: "#fff",
    backgroundColor: "rgba(15,23,42,0.9)",
  },
  passwordContainer: { position: "relative" },
  eyeIcon: {
    position: "absolute",
    right: 12,
    top: 14,
  },
  button: {
    backgroundColor: "#0ea5e9",
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 999,
    marginTop: 18,
  },
  buttonText: { color: "white", fontWeight: "700" },
  error: { color: "#f97373", marginTop: 6 },
});
