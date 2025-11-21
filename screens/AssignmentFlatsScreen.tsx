import React from 'react';
import { View, StyleSheet, FlatList, Pressable } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ThemedText } from '../components/ThemedText';
import { Card } from '../components/Card';
import { useTheme } from '../hooks/useTheme';
import { Spacing, Typography, BorderRadius } from '../constants/theme';
import { HomeStackParamList } from '../navigation/HomeStackNavigator';

 type AssignmentFlatsRouteProp = RouteProp<HomeStackParamList, 'AssignmentFlats'>;

type AssignmentFlatsNavigationProp = NativeStackNavigationProp<HomeStackParamList>;

export default function AssignmentFlatsScreen() {
  const { theme } = useTheme();
  const route = useRoute<AssignmentFlatsRouteProp>();
  const { assignment } = route.params;
  const navigation = useNavigation<AssignmentFlatsNavigationProp>();

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}> 
      <FlatList
        data={assignment.flatNumbers}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <Pressable onPress={() => navigation.navigate('FlatWorkForm', { flatNumber: item, societyName: assignment.societyName })}>
            <Card style={styles.flatCard}>
              <ThemedText style={styles.flatLabel}>{item}</ThemedText>
            </Card>
          </Pressable>
        )}
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
  flatLabel: {
    ...Typography.h2,
  },
});
