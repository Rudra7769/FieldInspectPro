import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Pressable, RefreshControl, FlatList } from 'react-native';
import { ScreenScrollView } from '../components/ScreenScrollView';
import { ThemedText } from '../components/ThemedText';
import { Card } from '../components/Card';
import { useTheme } from '../hooks/useTheme';
import { Spacing, Typography, BorderRadius } from '../constants/theme';
import { useJobStore } from '../src/store/jobStore';
import { Assignment } from '../src/types';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

const MOCK_ASSIGNMENTS: Assignment[] = [
  {
    id: '1',
    societyName: 'Green Valley Apartments',
    flatNumbers: ['A-101', 'A-102', 'A-103'],
    address: '123 Main Street, Mumbai',
    urgency: 'high',
    status: 'pending',
  },
  {
    id: '2',
    societyName: 'Sunset Gardens',
    flatNumbers: ['B-205', 'B-206'],
    address: '456 Park Avenue, Pune',
    urgency: 'medium',
    status: 'pending',
  },
  {
    id: '3',
    societyName: 'Royal Heights',
    flatNumbers: ['C-304'],
    address: '789 Hill Road, Bangalore',
    urgency: 'low',
    status: 'pending',
  },
];

export default function DashboardScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const { assignments, isLoading, fetchAssignments } = useJobStore();
  const [refreshing, setRefreshing] = useState(false);
  const [localAssignments, setLocalAssignments] = useState<Assignment[]>([]);

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      await fetchAssignments();
      setLocalAssignments(MOCK_ASSIGNMENTS);
    } catch (error) {
      setLocalAssignments(MOCK_ASSIGNMENTS);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAssignments();
    setRefreshing(false);
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return theme.error;
      case 'medium':
        return theme.warning;
      case 'low':
        return theme.success;
      default:
        return theme.textSecondary;
    }
  };

  const renderAssignment = ({ item }: { item: Assignment }) => (
    <Card style={styles.assignmentCard}>
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleContainer}>
          <ThemedText style={styles.societyName}>{item.societyName}</ThemedText>
          <View style={[styles.urgencyBadge, { backgroundColor: getUrgencyColor(item.urgency) + '20' }]}>
            <ThemedText style={[styles.urgencyText, { color: getUrgencyColor(item.urgency) }]}>
              {item.urgency.toUpperCase()}
            </ThemedText>
          </View>
        </View>
        <Feather name="chevron-right" size={20} color={theme.textSecondary} />
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
      </View>
    </Card>
  );

  return (
    <View style={[styles.container, { paddingBottom: tabBarHeight + Spacing.xl }]}>
      <FlatList
        data={localAssignments}
        renderItem={renderAssignment}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.listContent, { paddingTop: Spacing.lg }]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.primary} />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Feather name="inbox" size={64} color={theme.textSecondary} />
            <ThemedText style={[styles.emptyText, { color: theme.textSecondary }]}>
              No assignments
            </ThemedText>
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
    padding: Spacing.lg,
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
  urgencyBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  urgencyText: {
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
