import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Pressable } from 'react-native';
import { ThemedText } from '../components/ThemedText';
import { Card } from '../components/Card';
import { useTheme } from '../hooks/useTheme';
import { Spacing, Typography, BorderRadius } from '../constants/theme';
import { useJobStore } from '../src/store/jobStore';
import { Job } from '../src/types';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { JobsStackParamList } from '../navigation/JobsStackNavigator';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

const MOCK_JOBS: Job[] = [
  {
    id: '1',
    assignmentId: '1',
    societyName: 'Green Valley Apartments',
    flatNumber: 'A-101',
    address: '123 Main Street, Mumbai',
    checklist: [],
    status: 'Done',
    notes: 'All electrical connections verified and working properly.',
    photos: [],
    signature: '',
    gpsCoordinates: { latitude: 19.0760, longitude: 72.8777 },
    timestamp: new Date().toISOString(),
    synced: true,
  },
  {
    id: '2',
    assignmentId: '2',
    societyName: 'Sunset Gardens',
    flatNumber: 'B-205',
    address: '456 Park Avenue, Pune',
    checklist: [],
    status: 'Follow-up Needed',
    notes: 'Minor plumbing issue needs follow-up.',
    photos: [],
    signature: '',
    gpsCoordinates: { latitude: 18.5204, longitude: 73.8567 },
    timestamp: new Date().toISOString(),
    synced: true,
  },
];

export default function JobsScreen() {
  const { theme } = useTheme();
  const tabBarHeight = useBottomTabBarHeight();
  const navigation = useNavigation<NativeStackNavigationProp<JobsStackParamList>>();
  const { jobs, fetchJobs } = useJobStore();
  const [localJobs, setLocalJobs] = useState<Job[]>([]);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      await fetchJobs();
      setLocalJobs(MOCK_JOBS);
    } catch (error) {
      setLocalJobs(MOCK_JOBS);
    }
  };

  const getStatusColor = (status: Job['status']) => {
    switch (status) {
      case 'Done':
        return theme.success;
      case 'Client Not Available':
      case 'Follow-up Needed':
        return theme.warning;
      case 'Refused':
        return theme.error;
      default:
        return theme.textSecondary;
    }
  };

  const renderJob = ({ item }: { item: Job }) => (
    <Pressable
      style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
      onPress={() => navigation.navigate('JobDetails', { jobId: item.id })}
    >
      <Card style={styles.jobCard}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleContainer}>
            <ThemedText style={styles.societyName}>{item.societyName}</ThemedText>
            {item.synced ? (
              <Feather name="check-circle" size={20} color={theme.success} />
            ) : (
              <Feather name="clock" size={20} color={theme.warning} />
            )}
          </View>
        </View>
        
        <View style={styles.cardContent}>
          <View style={styles.infoRow}>
            <Feather name="home" size={16} color={theme.textSecondary} />
            <ThemedText style={[styles.infoText, { color: theme.textSecondary }]}>
              {item.flatNumber}
            </ThemedText>
          </View>
          
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
            <ThemedText style={[styles.statusText, { color: getStatusColor(item.status) }]}>
              {item.status}
            </ThemedText>
          </View>
          
          <View style={styles.infoRow}>
            <Feather name="calendar" size={16} color={theme.textSecondary} />
            <ThemedText style={[styles.infoText, { color: theme.textSecondary }]}>
              {new Date(item.timestamp).toLocaleDateString()}
            </ThemedText>
          </View>
        </View>
      </Card>
    </Pressable>
  );

  return (
    <View style={[styles.container, { paddingBottom: tabBarHeight + Spacing.xl }]}>
      <FlatList
        data={localJobs}
        renderItem={renderJob}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.listContent, { paddingTop: Spacing.lg }]}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Feather name="check-square" size={64} color={theme.textSecondary} />
            <ThemedText style={[styles.emptyText, { color: theme.textSecondary }]}>
              No completed jobs
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
  statusBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    alignSelf: 'flex-start',
  },
  statusText: {
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
