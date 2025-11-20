import React from 'react';
import { View, StyleSheet, Pressable, Alert } from 'react-native';
import { ScreenScrollView } from '../components/ScreenScrollView';
import { ThemedText } from '../components/ThemedText';
import { Card } from '../components/Card';
import { useTheme } from '../hooks/useTheme';
import { Spacing, Typography, BorderRadius } from '../constants/theme';
import { useAuthStore } from '../src/store/authStore';
import { Feather } from '@expo/vector-icons';

export default function ProfileScreen() {
  const { theme } = useTheme();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            await logout();
          }
        },
      ]
    );
  };

  return (
    <ScreenScrollView contentContainerStyle={styles.container}>
      <Card style={styles.profileCard}>
        <View style={[styles.avatarContainer, { backgroundColor: theme.primary + '20' }]}>
          <Feather name="user" size={48} color={theme.primary} />
        </View>
        <ThemedText style={styles.name}>{user?.name || 'Engineer'}</ThemedText>
        <ThemedText style={[styles.email, { color: theme.textSecondary }]}>{user?.email || ''}</ThemedText>
        {user?.engineerId ? (
          <ThemedText style={[styles.id, { color: theme.textSecondary }]}>ID: {user.engineerId}</ThemedText>
        ) : null}
      </Card>

      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Settings</ThemedText>
        
        <Pressable 
          style={({ pressed }) => [
            styles.menuItem,
            { backgroundColor: theme.surface, opacity: pressed ? 0.6 : 1 }
          ]}
        >
          <Feather name="bell" size={20} color={theme.text} />
          <ThemedText style={styles.menuText}>Notifications</ThemedText>
          <Feather name="chevron-right" size={20} color={theme.textSecondary} />
        </Pressable>

        <Pressable 
          style={({ pressed }) => [
            styles.menuItem,
            { backgroundColor: theme.surface, opacity: pressed ? 0.6 : 1 }
          ]}
        >
          <Feather name="refresh-cw" size={20} color={theme.text} />
          <ThemedText style={styles.menuText}>Sync Preferences</ThemedText>
          <Feather name="chevron-right" size={20} color={theme.textSecondary} />
        </Pressable>

        <Pressable 
          style={({ pressed }) => [
            styles.menuItem,
            { backgroundColor: theme.surface, opacity: pressed ? 0.6 : 1 }
          ]}
        >
          <Feather name="database" size={20} color={theme.text} />
          <ThemedText style={styles.menuText}>Cache Management</ThemedText>
          <Feather name="chevron-right" size={20} color={theme.textSecondary} />
        </Pressable>
      </View>

      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>About</ThemedText>
        
        <View style={[styles.infoItem, { backgroundColor: theme.surface }]}>
          <ThemedText style={[styles.infoLabel, { color: theme.textSecondary }]}>App Version</ThemedText>
          <ThemedText style={styles.infoValue}>1.0.0</ThemedText>
        </View>

        <View style={[styles.infoItem, { backgroundColor: theme.surface }]}>
          <ThemedText style={[styles.infoLabel, { color: theme.textSecondary }]}>Sync Status</ThemedText>
          <View style={styles.statusBadge}>
            <View style={[styles.statusDot, { backgroundColor: theme.success }]} />
            <ThemedText style={styles.infoValue}>Online</ThemedText>
          </View>
        </View>
      </View>

      <Pressable 
        style={({ pressed }) => [
          styles.logoutButton,
          { backgroundColor: theme.error, opacity: pressed ? 0.6 : 1 }
        ]}
        onPress={handleLogout}
      >
        <Feather name="log-out" size={20} color={theme.buttonText} />
        <ThemedText style={[styles.logoutText, { color: theme.buttonText }]}>Logout</ThemedText>
      </Pressable>
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
    gap: Spacing['2xl'],
  },
  profileCard: {
    alignItems: 'center',
    padding: Spacing['2xl'],
    gap: Spacing.md,
  },
  avatarContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    ...Typography.h1,
  },
  email: {
    ...Typography.body,
  },
  id: {
    ...Typography.caption,
  },
  section: {
    gap: Spacing.md,
  },
  sectionTitle: {
    ...Typography.h2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.sm,
    gap: Spacing.md,
  },
  menuText: {
    ...Typography.body,
    flex: 1,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
    borderRadius: BorderRadius.sm,
  },
  infoLabel: {
    ...Typography.body,
  },
  infoValue: {
    ...Typography.body,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.xs,
    gap: Spacing.sm,
    marginTop: Spacing.lg,
  },
  logoutText: {
    ...Typography.button,
    textTransform: 'uppercase',
  },
});
