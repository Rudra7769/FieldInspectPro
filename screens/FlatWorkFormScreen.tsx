import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Pressable, Alert, Platform } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ThemedText } from '../components/ThemedText';
import { Card } from '../components/Card';
import { useTheme } from '../hooks/useTheme';
import { Spacing, Typography, BorderRadius } from '../constants/theme';
import { HomeStackParamList } from '../navigation/HomeStackNavigator';
import type { RootStackParamList } from '../App';
import { ScreenKeyboardAwareScrollView } from '../components/ScreenKeyboardAwareScrollView';

 type FlatWorkFormRouteProp = RouteProp<HomeStackParamList, 'FlatWorkForm'>;

export default function FlatWorkFormScreen() {
  const { theme } = useTheme();
  const route = useRoute<FlatWorkFormRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { flatNumber, societyName } = route.params;

  const [mode, setMode] = useState<'completed' | 'not_completed'>('completed');
  const [ownerName, setOwnerName] = useState('');
  const [ownerNumber, setOwnerNumber] = useState('');
  const [serviceType, setServiceType] = useState('WiFi');
  const [serviceOther, setServiceOther] = useState('');
  const [reason, setReason] = useState('');
  const [selectedReasonKey, setSelectedReasonKey] = useState<
    'customer_not_home' | 'customer_refused' | 'flat_locked' | 'customer_rescheduled' | 'power_outage' | 'other'
  >('customer_not_home');
  const [signature, setSignature] = useState('');

  const handleSignature = () => {
    navigation.navigate('Signature', {
      onSignatureCapture: (sig: string) => {
        setSignature(sig);
      },
    });
  };

  const handleOwnerNameChange = (text: string) => {
    const lettersOnly = text.replace(/[^a-zA-Z\s]/g, '');
    const capitalized = lettersOnly
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
    setOwnerName(capitalized);
  };

  const handleOwnerNumberChange = (text: string) => {
    const digitsOnly = text.replace(/[^0-9]/g, '');
    setOwnerNumber(digitsOnly);
  };

  const handleSubmitCompleted = () => {
    if (!ownerName || !ownerNumber || !serviceType) {
      Alert.alert('Missing Info', 'Please fill all fields before submitting.');
      return;
    }

    if (serviceType === 'Other' && !serviceOther.trim()) {
      Alert.alert('Missing Info', 'Please enter the service type for Other.');
      return;
    }
    if (!signature) {
      Alert.alert('Signature Required', 'Please capture a signature before submitting.');
      return;
    }

    Alert.alert('Submitted', 'Work completed details submitted successfully.', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  const handleSubmitNotCompleted = () => {
    const finalReason =
      selectedReasonKey === 'other'
        ? reason.trim()
        : {
            customer_not_home: 'Customer not at home',
            customer_refused: 'Customer refused entry',
            flat_locked: 'Flat locked',
            customer_rescheduled: 'Customer rescheduled',
            power_outage: 'Power outage',
            other: reason.trim(),
          }[selectedReasonKey];

    if (!finalReason) {
      Alert.alert('Missing Info', 'Please select or enter a reason for not completing the work.');
      return;
    }

    Alert.alert('Submitted', 'Work not completed details submitted successfully.', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  const renderServiceButton = (label: string) => {
    const selected = serviceType === label;
    return (
      <Pressable
        key={label}
        style={[
          styles.chip,
          {
            backgroundColor: selected ? theme.primary : theme.surface,
            borderColor: selected ? theme.primary : theme.border,
          },
        ]}
        onPress={() => setServiceType(label)}
      >
        <ThemedText style={[styles.chipLabel, { color: selected ? theme.buttonText : theme.text }]}>
          {label}
        </ThemedText>
      </Pressable>
    );
  };

  const isCompletedValid =
    !!ownerName.trim() &&
    !!ownerNumber.trim() &&
    !!serviceType &&
    (serviceType !== 'Other' ? true : !!serviceOther.trim()) &&
    !!signature;

  const hasNotCompletedReason =
    selectedReasonKey === 'other' ? !!reason.trim() : true;

  return (
    <ScreenKeyboardAwareScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerInfo}>
          <ThemedText style={styles.societyName}>{societyName}</ThemedText>
          <ThemedText style={[styles.flatNumber, { color: theme.textSecondary }]}>Flat: {flatNumber}</ThemedText>
        </View>

        <View style={styles.modeToggle}>
          <Pressable
            style={[
              styles.modeButton,
              { backgroundColor: mode === 'completed' ? theme.primary : theme.surface },
            ]}
            onPress={() => setMode('completed')}
          >
            <ThemedText
              style={[
                styles.modeButtonText,
                { color: mode === 'completed' ? theme.buttonText : theme.text },
              ]}
            >
              Work Completed
            </ThemedText>
          </Pressable>
          <Pressable
            style={[
              styles.modeButton,
              { backgroundColor: mode === 'not_completed' ? theme.primary : theme.surface },
            ]}
            onPress={() => setMode('not_completed')}
          >
            <ThemedText
              style={[
                styles.modeButtonText,
                { color: mode === 'not_completed' ? theme.buttonText : theme.text },
              ]}
            >
              Work Not Completed
            </ThemedText>
          </Pressable>
        </View>

        {mode === 'completed' ? (
          <>
            <Card style={styles.section}>
              <ThemedText style={styles.sectionTitle}>Owner Details</ThemedText>
              <TextInput
                style={[styles.input, { borderColor: theme.border, color: theme.text, backgroundColor: theme.surface }]}
                placeholder="Owner Name"
                placeholderTextColor={theme.textSecondary}
                value={ownerName}
                onChangeText={handleOwnerNameChange}
              />
              <TextInput
                style={[styles.input, { borderColor: theme.border, color: theme.text, backgroundColor: theme.surface }]}
                placeholder="Owner Number"
                placeholderTextColor={theme.textSecondary}
                keyboardType="number-pad"
                value={ownerNumber}
                onChangeText={handleOwnerNumberChange}
              />
            </Card>

            <Card style={styles.section}>
              <ThemedText style={styles.sectionTitle}>Service Details</ThemedText>
              <ThemedText style={[styles.label, { color: theme.textSecondary }]}>Type of Service</ThemedText>
              <View style={styles.chipRow}>
                {['WiFi', 'Fiber', 'Landline', 'CCTV', 'Intercom', 'Other'].map(renderServiceButton)}
              </View>
              {serviceType === 'Other' ? (
                <TextInput
                  style={[styles.input, { borderColor: theme.border, color: theme.text, backgroundColor: theme.surface }]}
                  placeholder="Enter service type"
                  placeholderTextColor={theme.textSecondary}
                  value={serviceOther}
                  onChangeText={setServiceOther}
                />
              ) : null}
            </Card>

            <Card style={styles.section}>
              <ThemedText style={styles.sectionTitle}>Digital Signature</ThemedText>
              {signature ? (
                <ThemedText style={{ marginBottom: Spacing.md }}>Signature captured</ThemedText>
              ) : (
                <ThemedText style={{ marginBottom: Spacing.md, color: theme.textSecondary }}>
                  No signature yet
                </ThemedText>
              )}
              <Pressable
                style={[styles.primaryButton, { backgroundColor: theme.primary }]}
                onPress={handleSignature}
              >
                <ThemedText style={[styles.primaryButtonText, { color: theme.buttonText }]}>
                  {signature ? 'Re-capture Signature' : 'Capture Signature'}
                </ThemedText>
              </Pressable>
              {isCompletedValid ? (
                <Pressable
                  style={[styles.submitButton, { backgroundColor: theme.success, marginTop: Spacing.md }]}
                  onPress={handleSubmitCompleted}
                >
                  <ThemedText style={[styles.submitButtonText, { color: theme.buttonText }]}>Submit</ThemedText>
                </Pressable>
              ) : null}
            </Card>
          </>
        ) : (
          <>
            <Card style={styles.section}>
              <ThemedText style={styles.sectionTitle}>Reason for Not Completing Work</ThemedText>
              <View style={styles.reasonChipsRow}>
                {[
                  { key: 'customer_not_home' as const, label: 'Customer not at home' },
                  { key: 'customer_refused' as const, label: 'Customer refused entry' },
                  { key: 'flat_locked' as const, label: 'Flat locked' },
                  { key: 'customer_rescheduled' as const, label: 'Customer rescheduled' },
                  { key: 'power_outage' as const, label: 'Power outage' },
                  { key: 'other' as const, label: 'Other' },
                ].map(({ key, label }) => {
                  const selected = selectedReasonKey === key;
                  return (
                    <Pressable
                      key={key}
                      style={[
                        styles.chip,
                        {
                          backgroundColor: selected ? theme.primary : theme.surface,
                          borderColor: selected ? theme.primary : theme.border,
                        },
                      ]}
                      onPress={() => setSelectedReasonKey(key)}
                    >
                      <ThemedText
                        style={[
                          styles.chipLabel,
                          { color: selected ? theme.buttonText : theme.text },
                        ]}
                      >
                        {label}
                      </ThemedText>
                    </Pressable>
                  );
                })}
              </View>

              {selectedReasonKey === 'other' ? (
                <TextInput
                  style={[
                    styles.textArea,
                    { borderColor: theme.border, color: theme.text, backgroundColor: theme.surface },
                  ]}
                  placeholder="Enter reason here"
                  placeholderTextColor={theme.textSecondary}
                  value={reason}
                  onChangeText={setReason}
                  multiline
                  numberOfLines={4}
                />
              ) : null}
            </Card>

            {hasNotCompletedReason ? (
              <Pressable
                style={[styles.submitButton, { backgroundColor: theme.error }]}
                onPress={handleSubmitNotCompleted}
              >
                <ThemedText style={[styles.submitButtonText, { color: theme.buttonText }]}>Submit</ThemedText>
              </Pressable>
            ) : null}
          </>
        )}
    </ScreenKeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: 0,
    paddingBottom: Spacing['5xl'],
    gap: Spacing.lg,
    flexGrow: 1,
  },
  headerInfo: {
    gap: Spacing.xs,
  },
  societyName: {
    ...Typography.h2,
  },
  flatNumber: {
    ...Typography.body,
  },
  modeToggle: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  modeButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.xs,
    alignItems: 'center',
  },
  modeButtonText: {
    ...Typography.button,
  },
  section: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    gap: Spacing.md,
  },
  sectionTitle: {
    ...Typography.h2,
  },
  input: {
    borderWidth: 1,
    borderRadius: BorderRadius.xs,
    padding: Spacing.md,
    ...Typography.body,
  },
  readonlyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    ...Typography.body,
    fontWeight: '600',
  },
  value: {
    ...Typography.body,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  reasonChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Platform.OS === 'ios' ? Spacing.xs : Spacing.sm,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  chipLabel: {
    ...Typography.caption,
    fontWeight: '600',
  },
  primaryButton: {
    padding: Spacing.md,
    borderRadius: BorderRadius.xs,
    alignItems: 'center',
  },
  primaryButtonText: {
    ...Typography.button,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: BorderRadius.xs,
    padding: Spacing.md,
    ...Typography.body,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.xs,
    alignItems: 'center',
  },
  submitButtonText: {
    ...Typography.button,
  },
});
