import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Pressable, Alert } from 'react-native';
import { ThemedText } from '../components/ThemedText';
import { Card } from '../components/Card';
import { useTheme } from '../hooks/useTheme';
import { Spacing, Typography, BorderRadius } from '../constants/theme';
import { useJobStore } from '../src/store/jobStore';
import { QueuedJob } from '../src/types';
import { Feather } from '@expo/vector-icons';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import NetInfo from '@react-native-community/netinfo';

export default function SyncQueueScreen() {
  const { theme } = useTheme();
  const tabBarHeight = useBottomTabBarHeight();
  const { queuedJobs, removeFromQueue } = useJobStore();
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(state.isConnected ?? false);
    });
    return () => unsubscribe();
  }, []);

  const handleDelete = (jobId: string) => {
    Alert.alert(
      'Delete Job',
      'Are you sure you want to delete this queued job?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => removeFromQueue(jobId),
        },
      ]
    );
  };

  const handleRetry = async (job: QueuedJob) => {
    Alert.alert('Retry', 'Sync functionality will be implemented with backend integration.');
  };

  const renderQueuedJob = ({ item }: { item: QueuedJob }) => (
    <Card style={styles.jobCard}>
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleContainer}>
          <ThemedText style={styles.societyName}>{item.societyName}</ThemedText>
          <View style={[styles.statusBadge, { backgroundColor: theme.warning + '20' }]}>
            <ThemedText style={[styles.statusText, { color: theme.warning }]}>PENDING</ThemedText>
          </View>
        </View>
      </View>
      
      <View style={styles.cardContent}>
        <View style={styles.infoRow}>
          <Feather name="home" size={16} color={theme.textSecondary} />
          <ThemedText style={[styles.infoText, { color: theme.textSecondary }]}>
            {item.flatNumber}
          </ThemedText>
        </View>
        
        <View style={styles.infoRow}>
          <Feather name="calendar" size={16} color={theme.textSecondary} />
          <ThemedText style={[styles.infoText, { color: theme.textSecondary }]}>
            {new Date(item.timestamp).toLocaleString()}
          </ThemedText>
        </View>

        {item.error ? (
          <View style={[styles.errorContainer, { backgroundColor: theme.error + '10' }]}>
            <Feather name="alert-circle" size={16} color={theme.error} />
            <ThemedText style={[styles.errorText, { color: theme.error }]}>{item.error}</ThemedText>
          </View>
        ) : null}
      </View>

      <View style={styles.actions}>
        <Pressable
          style={({ pressed }) => [
            styles.actionButton,
            { backgroundColor: theme.primary, opacity: pressed ? 0.6 : 1 },
          ]}
          onPress={() => handleRetry(item)}
        >
          <Feather name="refresh-cw" size={16} color={theme.buttonText} />
          <ThemedText style={[styles.actionText, { color: theme.buttonText }]}>Retry</ThemedText>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.actionButton,
            { backgroundColor: theme.error, opacity: pressed ? 0.6 : 1 },
          ]}
          onPress={() => handleDelete(item.id)}
        >
          <Feather name="trash-2" size={16} color={theme.buttonText} />
          <ThemedText style={[styles.actionText, { color: theme.buttonText }]}>Delete</ThemedText>
        </Pressable>
      </View>
    </Card>
  );

  return (
    <View style={[styles.container, { paddingBottom: tabBarHeight + Spacing.xl }]}>
      <View style={[styles.connectionBanner, { backgroundColor: isOnline ? theme.success + '20' : theme.error + '20' }]}>
        <Feather 
          name={isOnline ? 'wifi' : 'wifi-off'} 
          size={16} 
          color={isOnline ? theme.success : theme.error} 
        />
        <ThemedText style={[styles.connectionText, { color: isOnline ? theme.success : theme.error }]}>
          {isOnline ? 'Online' : 'Offline'}
        </ThemedText>
      </View>

      <FlatList
        data={queuedJobs}
        renderItem={renderQueuedJob}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Feather name="check-circle" size={64} color={theme.success} />
            <ThemedText style={[styles.emptyText, { color: theme.textSecondary }]}>
              All synced
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
  connectionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
  },
  connectionText: {
    ...Typography.caption,
    fontWeight: '600',
  },
  listContent: {
    padding: Spacing.lg,
    gap: Spacing.lg,
  },
  jobCard: {
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
  statusBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  statusText: {
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
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.sm,
    borderRadius: BorderRadius.xs,
  },
  errorText: {
    ...Typography.caption,
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.sm,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.xs,
    flex: 1,
  },
  actionText: {
    ...Typography.caption,
    fontWeight: '600',
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
