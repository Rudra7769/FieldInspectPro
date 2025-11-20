import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Pressable, ActivityIndicator, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { useTheme } from '../hooks/useTheme';
import { Spacing, Typography, BorderRadius } from '../constants/theme';
import { useAuthStore } from '../src/store/authStore';
import { Feather } from '@expo/vector-icons';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const login = useAuthStore((state) => state.login);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      setIsLoading(false);
    }
  };

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top + 60, paddingBottom: insets.bottom + 40 }]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Feather name="clipboard" size={48} color={theme.primary} />
          <ThemedText style={[styles.title, { color: theme.text }]}>Field Inspector</ThemedText>
          <ThemedText style={[styles.subtitle, { color: theme.textSecondary }]}>Engineer Login</ThemedText>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <ThemedText style={[styles.label, { color: theme.text }]}>Email</ThemedText>
            <TextInput
              style={[styles.input, { borderColor: theme.border, color: theme.text, backgroundColor: theme.surface }]}
              value={email}
              onChangeText={setEmail}
              placeholder="engineer@example.com"
              placeholderTextColor={theme.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
            />
          </View>

          <View style={styles.inputContainer}>
            <ThemedText style={[styles.label, { color: theme.text }]}>Password</ThemedText>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, styles.passwordInput, { borderColor: theme.border, color: theme.text, backgroundColor: theme.surface }]}
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                placeholderTextColor={theme.textSecondary}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />
              <Pressable
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                <Feather name={showPassword ? 'eye-off' : 'eye'} size={20} color={theme.textSecondary} />
              </Pressable>
            </View>
          </View>

          {error ? (
            <View style={[styles.errorContainer, { backgroundColor: theme.error + '20' }]}>
              <Feather name="alert-circle" size={16} color={theme.error} />
              <ThemedText style={[styles.errorText, { color: theme.error }]}>{error}</ThemedText>
            </View>
          ) : null}

          <Pressable
            style={[styles.button, { backgroundColor: theme.primary, opacity: isLoading ? 0.7 : 1 }]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={theme.buttonText} />
            ) : (
              <ThemedText style={[styles.buttonText, { color: theme.buttonText }]}>LOGIN</ThemedText>
            )}
          </Pressable>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing['4xl'],
  },
  title: {
    ...Typography.h1,
    marginTop: Spacing.lg,
  },
  subtitle: {
    ...Typography.body,
    marginTop: Spacing.xs,
  },
  form: {
    gap: Spacing.lg,
  },
  inputContainer: {
    gap: Spacing.sm,
  },
  label: {
    ...Typography.body,
  },
  input: {
    height: Spacing.inputHeight,
    borderWidth: 1,
    borderRadius: BorderRadius.xs,
    paddingHorizontal: Spacing.lg,
    ...Typography.body,
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: Spacing['5xl'],
  },
  eyeIcon: {
    position: 'absolute',
    right: Spacing.lg,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: BorderRadius.xs,
  },
  errorText: {
    ...Typography.caption,
    flex: 1,
  },
  button: {
    height: Spacing.buttonHeight,
    borderRadius: BorderRadius.xs,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.md,
  },
  buttonText: {
    ...Typography.button,
    textTransform: 'uppercase',
  },
});
