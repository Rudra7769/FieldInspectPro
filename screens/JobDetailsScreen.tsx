import React from 'react';
import { View, StyleSheet, Image, ScrollView } from 'react-native';
import { ScreenScrollView } from '../components/ScreenScrollView';
import { ThemedText } from '../components/ThemedText';
import { Card } from '../components/Card';
import { useTheme } from '../hooks/useTheme';
import { Spacing, Typography, BorderRadius } from '../constants/theme';
import { Feather } from '@expo/vector-icons';
import { useRoute, RouteProp } from '@react-navigation/native';
import { JobsStackParamList } from '../navigation/JobsStackNavigator';

type JobDetailsScreenRouteProp = RouteProp<JobsStackParamList, 'JobDetails'>;

const MOCK_JOB = {
  id: '1',
  societyName: 'Green Valley Apartments',
  flatNumber: 'A-101',
  address: '123 Main Street, Mumbai',
  status: 'Done',
  notes: 'All electrical connections verified and working properly. Minor cosmetic issues noted.',
  checklist: [
    { label: 'Main power supply', checked: true },
    { label: 'Wiring connections', checked: true },
    { label: 'Water supply', checked: true },
    { label: 'Drainage system', checked: true },
  ],
  photos: [],
  signature: '',
  gpsCoordinates: { latitude: 19.076, longitude: 72.8777 },
  timestamp: new Date().toISOString(),
};

export default function JobDetailsScreen() {
  const { theme } = useTheme();
  const route = useRoute<JobDetailsScreenRouteProp>();

  return (
    <ScreenScrollView contentContainerStyle={styles.container}>
      <Card style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Property Info</ThemedText>
        <View style={styles.infoRow}>
          <Feather name="home" size={20} color={theme.textSecondary} />
          <View style={styles.infoContent}>
            <ThemedText style={[styles.label, { color: theme.textSecondary }]}>Society</ThemedText>
            <ThemedText style={styles.value}>{MOCK_JOB.societyName}</ThemedText>
          </View>
        </View>
        <View style={styles.infoRow}>
          <Feather name="hash" size={20} color={theme.textSecondary} />
          <View style={styles.infoContent}>
            <ThemedText style={[styles.label, { color: theme.textSecondary }]}>Flat</ThemedText>
            <ThemedText style={styles.value}>{MOCK_JOB.flatNumber}</ThemedText>
          </View>
        </View>
        <View style={styles.infoRow}>
          <Feather name="map-pin" size={20} color={theme.textSecondary} />
          <View style={styles.infoContent}>
            <ThemedText style={[styles.label, { color: theme.textSecondary }]}>Address</ThemedText>
            <ThemedText style={styles.value}>{MOCK_JOB.address}</ThemedText>
          </View>
        </View>
      </Card>

      <Card style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Status</ThemedText>
        <View style={[styles.statusBadge, { backgroundColor: theme.success + '20' }]}>
          <ThemedText style={[styles.statusText, { color: theme.success }]}>{MOCK_JOB.status}</ThemedText>
        </View>
      </Card>

      <Card style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Checklist</ThemedText>
        {MOCK_JOB.checklist.map((item, index) => (
          <View key={index} style={styles.checklistItem}>
            <Feather
              name={item.checked ? 'check-circle' : 'circle'}
              size={20}
              color={item.checked ? theme.success : theme.textSecondary}
            />
            <ThemedText style={styles.checklistLabel}>{item.label}</ThemedText>
          </View>
        ))}
      </Card>

      <Card style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Notes</ThemedText>
        <ThemedText style={[styles.notes, { color: theme.textSecondary }]}>{MOCK_JOB.notes}</ThemedText>
      </Card>

      <Card style={styles.section}>
        <ThemedText style={styles.sectionTitle}>GPS Coordinates</ThemedText>
        <View style={styles.infoRow}>
          <Feather name="map-pin" size={20} color={theme.primary} />
          <ThemedText style={[styles.gpsText, { color: theme.textSecondary }]}>
            {MOCK_JOB.gpsCoordinates.latitude.toFixed(6)}, {MOCK_JOB.gpsCoordinates.longitude.toFixed(6)}
          </ThemedText>
        </View>
      </Card>

      <Card style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Timestamp</ThemedText>
        <View style={styles.infoRow}>
          <Feather name="calendar" size={20} color={theme.textSecondary} />
          <ThemedText style={[styles.value, { color: theme.textSecondary }]}>
            {new Date(MOCK_JOB.timestamp).toLocaleString()}
          </ThemedText>
        </View>
      </Card>
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
    gap: Spacing.lg,
  },
  section: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  sectionTitle: {
    ...Typography.h2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  infoContent: {
    flex: 1,
    gap: Spacing.xs,
  },
  label: {
    ...Typography.caption,
    fontWeight: '600',
  },
  value: {
    ...Typography.body,
  },
  statusBadge: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.sm,
    alignSelf: 'flex-start',
  },
  statusText: {
    ...Typography.body,
    fontWeight: '600',
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  checklistLabel: {
    ...Typography.body,
  },
  notes: {
    ...Typography.body,
  },
  gpsText: {
    ...Typography.body,
    fontFamily: 'monospace',
  },
});
