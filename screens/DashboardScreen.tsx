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
import { useFlatCompletionStore } from '../src/store/flatCompletionStore';
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
  const isFlatCompleted = useFlatCompletionStore((s) => s.isFlatCompleted);
  const [expandedId, setExpandedId] = useState<string | null>(null);

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

    const allFlatsCompleted = item.flatNumbers.length > 0 &&
      item.flatNumbers.every((flat) => isFlatCompleted(item.societyName, flat));

    const isExpanded = expandedId === item.id;

    return (
      <Pressable
        onPress={() => {
          // toggle expand/collapse for this card
          setExpandedId((prev) => (prev === item.id ? null : item.id));
          // if timer already running, also navigate to flats
          if (isRunning) {
            navigation.navigate('AssignmentFlats', { assignment: item });
          }
        }}
      >
        <Card style={styles.assignmentCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleContainer}>
              <ThemedText style={styles.societyName}>{item.societyName}</ThemedText>
            </View>
            <Feather
              name={isExpanded ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={theme.textSecondary}
            />
          </View>

          <View style={styles.cardContent}>
            <View style={styles.infoRow}>
              <Feather name="home" size={16} color={theme.textSecondary} />
              <ThemedText style={[styles.infoText, { color: theme.textSecondary }]}>
                {item.flatNumbers.length} {item.flatNumbers.length === 1 ? 'flat' : 'flats'}
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

          {isExpanded ? (
            <View style={styles.footerRow}>
              {allFlatsCompleted ? (
                <View style={[styles.fullWidthFooter, { backgroundColor: theme.success }]}> 
                  <ThemedText style={[styles.fullWidthFooterText, { color: theme.buttonText }]}>Done</ThemedText>
                </View>
              ) : (
                <Pressable
                  style={[styles.fullWidthFooter, { backgroundColor: isRunning ? theme.error : theme.primary }]}
                  onPress={() => (isRunning ? handleStop(item) : handleStart(item))}
                >
                  <ThemedText style={[styles.fullWidthFooterText, { color: theme.buttonText }]}>
                    {isRunning ? 'Stop' : 'Start'}
                  </ThemedText>
                </Pressable>
              )}
            </View>
          ) : null}
        </Card>
      </Pressable>
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
        ListHeaderComponent={
          assignments.length > 0 ? (
            <View style={styles.listHeader}>
              <ThemedText style={styles.listTitle}>Assigned Societies</ThemedText>
              <ThemedText style={[styles.listSubtitle, { color: theme.textSecondary }]}>
                {assignments.length} {assignments.length === 1 ? 'society' : 'societies'} assigned
              </ThemedText>
            </View>
          ) : null
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
    paddingBottom: Spacing['2xl'],
    gap: Spacing.lg,
  },
  listHeader: {
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    gap: Spacing.xs,
  },
  listTitle: {
    ...Typography.h1,
  },
  listSubtitle: {
    ...Typography.body,
  },
  assignmentCard: {
    padding: Spacing.lg,
    gap: Spacing.md,
    borderRadius: BorderRadius.md,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 2,
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
  doneBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.xs,
  },
  doneBadgeText: {
    ...Typography.caption,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  cardContent: {
    gap: Spacing.sm,
  },
  footerRow: {
    marginTop: Spacing.md,
    flexDirection: 'row',
  },
  fullWidthFooter: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidthFooterText: {
    ...Typography.button,
    fontWeight: '700',
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
