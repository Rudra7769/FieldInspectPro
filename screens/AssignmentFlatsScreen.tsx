import React, { useEffect } from 'react';
import { View, StyleSheet, FlatList, Pressable } from 'react-native';
import { RouteProp, useRoute, useNavigation, useIsFocused } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ThemedText } from '../components/ThemedText';
import { Card } from '../components/Card';
import { useTheme } from '../hooks/useTheme';
import { Spacing, Typography, BorderRadius } from '../constants/theme';
import { HomeStackParamList } from '../navigation/HomeStackNavigator';
import { useFlatCompletionStore } from '../src/store/flatCompletionStore';
import { useTimerStore } from '../src/store/timerStore';
import { Feather } from '@expo/vector-icons';

 type AssignmentFlatsRouteProp = RouteProp<HomeStackParamList, 'AssignmentFlats'>;

type AssignmentFlatsNavigationProp = NativeStackNavigationProp<HomeStackParamList>;

export default function AssignmentFlatsScreen() {
  const { theme } = useTheme();
  const route = useRoute<AssignmentFlatsRouteProp>();
  const { assignment } = route.params;
  const navigation = useNavigation<AssignmentFlatsNavigationProp>();
  const completedFlats = useFlatCompletionStore((s) => s.completedFlats);
  const isFlatCompleted = useFlatCompletionStore((s) => s.isFlatCompleted);
  const isSocietyFinished = useFlatCompletionStore((s) => s.isSocietyFinished);
  const markSocietyFinished = useFlatCompletionStore((s) => s.markSocietyFinished);
  const timerStore = useTimerStore();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (!isFocused) return;

    if (isSocietyFinished(assignment.societyName)) {
      return;
    }

    const allCompleted = assignment.flatNumbers.every((flat) =>
      isFlatCompleted(assignment.societyName, flat)
    );

    if (allCompleted) {
      markSocietyFinished(assignment.societyName);
      timerStore.stop();
      navigation.navigate('Dashboard');
    }
  }, [isFocused, assignment, isFlatCompleted, isSocietyFinished, markSocietyFinished, timerStore, navigation]);

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}> 
      <FlatList
        data={assignment.flatNumbers}
        keyExtractor={(item) => item}
        extraData={completedFlats}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const completed = isFlatCompleted(assignment.societyName, item);
          return (
            <Pressable onPress={() => navigation.navigate('FlatWorkForm', { flatNumber: item, societyName: assignment.societyName })}>
              <Card style={styles.flatCard}>
                <View style={styles.flatRow}>
                  <ThemedText style={styles.flatLabel}>{item}</ThemedText>
                  {completed ? (
                    <Feather name="check-circle" size={20} color={theme.success} />
                  ) : null}
                </View>
              </Card>
            </Pressable>
          );
        }}
        ListHeaderComponent={
          <View style={styles.header}>
            <ThemedText style={styles.societyName}>{assignment.societyName}</ThemedText>
            <ThemedText style={[styles.address, { color: theme.textSecondary }]}>
              {assignment.address}
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
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    gap: Spacing.lg,
  },
  header: {
    marginBottom: Spacing.lg,
    gap: Spacing.xs,
  },
  societyName: {
    ...Typography.h2,
  },
  address: {
    ...Typography.body,
  },
  flatCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
  },
  flatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  flatLabel: {
    ...Typography.h2,
  },
});
