import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Pressable, RefreshControl, FlatList, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenScrollView } from '../components/ScreenScrollView';
import { ThemedText } from '../components/ThemedText';
import { Card } from '../components/Card';
import { useTheme } from '../hooks/useTheme';
import { Spacing, Typography, BorderRadius } from '../constants/theme';
import { useJobStore } from '../src/store/jobStore';
import { Assignment } from '../src/types';
import { useTimerStore } from '../src/store/timerStore';
import type { HomeStackParamList } from '../navigation/HomeStackNavigator';
import { Feather } from '@expo/vector-icons';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
 

export default function DashboardScreen() {
  const { theme } = useTheme();
  const tabBarHeight = useBottomTabBarHeight();
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const { assignments, isLoading, fetchAssignments, error } = useJobStore();
  const [refreshing, setRefreshing] = useState(false);
  const [timers, setTimers] = useState<Record<string, { isRunning: boolean; startTime: number | null; elapsedMs?: number }>>({});
  const timerStore = useTimerStore();

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      await fetchAssignments();
    } catch (error) {
      console.error('Error loading assignments:', error);
    }
  };

  const handleStart = (assignment: Assignment) => {
    Alert.alert(
      'Start Work',
      `Start work for ${assignment.societyName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Start',
          style: 'default',
          onPress: () => {
            setTimers((prev) => ({
              ...prev,
              [assignment.id]: { isRunning: true, startTime: Date.now(), elapsedMs: prev[assignment.id]?.elapsedMs },
            }));
            timerStore.start();
            navigation.navigate('AssignmentFlats', { assignment });
          },
        },
      ]
    );
  };

  const handleStop = (assignment: Assignment) => {
    const current = timers[assignment.id];
    if (!current?.isRunning || !current.startTime) return;

    const elapsedMs = Date.now() - current.startTime;
    const minutes = Math.floor(elapsedMs / 60000);
    const seconds = Math.floor((elapsedMs % 60000) / 1000);

    setTimers((prev) => ({
      ...prev,
      [assignment.id]: { isRunning: false, startTime: null, elapsedMs },
    }));

    timerStore.stop();

    Alert.alert('Work Time', `Total time: ${minutes}m ${seconds}s`);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAssignments();
    setRefreshing(false);
  };

  const renderAssignment = ({ item }: { item: Assignment }) => {
    const timer = timers[item.id];
    const isRunning = !!timer?.isRunning;
    const elapsedMs = timer?.elapsedMs;
    const minutes = elapsedMs != null ? Math.floor(elapsedMs / 60000) : null;
    const seconds = elapsedMs != null ? Math.floor((elapsedMs % 60000) / 1000) : null;

    return (
      <Card style={styles.assignmentCard}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleContainer}>
            <ThemedText style={styles.societyName}>{item.societyName}</ThemedText>
          </View>
          <View style={styles.actionsRow}>
            {!isRunning ? (
              <Pressable style={[styles.actionButton, { backgroundColor: theme.primary }]} onPress={() => handleStart(item)}>
                <ThemedText style={[styles.actionButtonText, { color: theme.buttonText }]}>Start</ThemedText>
              </Pressable>
            ) : (
              <Pressable style={[styles.actionButton, { backgroundColor: theme.error }]} onPress={() => handleStop(item)}>
                <ThemedText style={[styles.actionButtonText, { color: theme.buttonText }]}>Stop</ThemedText>
              </Pressable>
            )}
            <Pressable onPress={() => navigation.navigate('AssignmentFlats', { assignment: item })}>
              <Feather name="chevron-right" size={20} color={theme.textSecondary} />
            </Pressable>
          </View>
        </View>

        <View style={styles.cardContent}>
          <View style={styles.infoRow}>
            <Feather name="home" size={16} color={theme.textSecondary} />
            <ThemedText style={[styles.infoText, { color: theme.textSecondary }]}>
              {item.flatNumbers.join(', ')}
            </ThemedText>
          </View>
          <View style={styles.infoRow}>
            <Feather name="map-pin" size={16} color={theme.textSecondary} />
            <ThemedText style={[styles.infoText, { color: theme.textSecondary }]}>
              {item.address}
            </ThemedText>
          </View>
          {elapsedMs != null ? (
            <ThemedText style={{ marginTop: Spacing.xs, color: theme.textSecondary }}>
              Last time: {minutes}m {seconds}s
            </ThemedText>
          ) : null}
        </View>
      </Card>
    );
  };

  return (
    <View style={[styles.container, { paddingBottom: tabBarHeight + Spacing.xl }]}> 
      <FlatList
        data={assignments}
        renderItem={renderAssignment}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.listContent, { paddingTop: 0 }]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.primary} />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            {error ? (
              <>
                <Feather name="alert-circle" size={64} color={theme.error} />
                <ThemedText style={[styles.emptyText, { color: theme.error }]}>
                  {error}
                </ThemedText>
              </>
            ) : (
              <>
                <Feather name="inbox" size={64} color={theme.textSecondary} />
                <ThemedText style={[styles.emptyText, { color: theme.textSecondary }]}>
                  No assignments
                </ThemedText>
              </>
            )}
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingTop: 0,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    gap: Spacing.lg,
  },
  assignmentCard: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  cardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  societyName: {
    ...Typography.h2,
    flex: 1,
  },
  actionButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.xs,
  },
  actionButtonText: {
    ...Typography.caption,
    fontWeight: '600',
  },
  cardContent: {
    gap: Spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  infoText: {
    ...Typography.body,
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing['5xl'],
    gap: Spacing.lg,
  },
  emptyText: {
    ...Typography.h2,
  },
});
