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
    <ThemedView style={[styles.container, { paddingTop: insets.top + 60 }]}>
      <View style={styles.header}>
        <Feather name="clipboard" size={48} color="#007aff" />
        <ThemedText style={styles.title}>Field Inspector</ThemedText>
        <ThemedText style={styles.subtitle}>Engineer Login</ThemedText>
      </View>

      <View style={styles.form}>
        <ThemedText>Email</ThemedText>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        <ThemedText>Password</ThemedText>
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, { paddingRight: 45 }]}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <Pressable
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Feather name={showPassword ? "eye-off" : "eye"} size={20} color="#555" />
          </Pressable>
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
  container: { flex: 1, padding: 20 },
  header: { alignItems: "center", marginBottom: 40 },
  title: { fontSize: 28, fontWeight: "700", marginTop: 12 },
  subtitle: { color: "#666" },
  form: { gap: 14 },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#ddd",
    paddingHorizontal: 12,
  },
  passwordContainer: { position: "relative" },
  eyeIcon: {
    position: "absolute",
    right: 12,
    top: 14,
  },
  button: {
    backgroundColor: "#007aff",
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: { color: "white", fontWeight: "700" },
  error: { color: "red", marginTop: 4 },
});
