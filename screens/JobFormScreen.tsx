import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, Pressable, ScrollView, Image, Alert } from 'react-native';
import { ScreenKeyboardAwareScrollView } from '../components/ScreenKeyboardAwareScrollView';
import { ThemedText } from '../components/ThemedText';
import { Card } from '../components/Card';
import { useTheme } from '../hooks/useTheme';
import { Spacing, Typography, BorderRadius } from '../constants/theme';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { ChecklistItem, JobStatus, QueuedJob } from '../src/types';
import { useJobStore } from '../src/store/jobStore';

const CHECKLIST_DATA: ChecklistItem[] = [
  { id: '1', category: 'Electrical', label: 'Main power supply', checked: false },
  { id: '2', category: 'Electrical', label: 'Wiring connections', checked: false },
  { id: '3', category: 'Plumbing', label: 'Water supply', checked: false },
  { id: '4', category: 'Plumbing', label: 'Drainage system', checked: false },
  { id: '5', category: 'Civil', label: 'Wall condition', checked: false },
  { id: '6', category: 'Civil', label: 'Floor finish', checked: false },
];

const STATUS_OPTIONS: JobStatus[] = ['Done', 'Client Not Available', 'Refused', 'Follow-up Needed'];

type JobFormScreenRouteProp = RouteProp<RootStackParamList, 'JobForm'>;

export default function JobFormScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<JobFormScreenRouteProp>();

  const [checklist, setChecklist] = useState<ChecklistItem[]>(CHECKLIST_DATA);
  const [status, setStatus] = useState<JobStatus>('Done');
  const [notes, setNotes] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [signature, setSignature] = useState('');
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [showStatusPicker, setShowStatusPicker] = useState(false);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      const loc = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
    }
  };

  const toggleChecklistItem = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const pickImage = async () => {
    if (photos.length >= 10) {
      Alert.alert('Limit Reached', 'You can only add up to 10 photos.');
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Camera roll permissions are required.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setPhotos([...photos, result.assets[0].uri]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSignature = () => {
    navigation.navigate('Signature', {
      onSignatureCapture: (sig: string) => {
        setSignature(sig);
      },
    });
  };

  const handleSubmit = async () => {
    if (!signature) {
      Alert.alert('Signature Required', 'Please capture a signature before submitting.');
      return;
    }

    const job = {
      id: Date.now().toString(),
      assignmentId: route.params?.assignmentId || '1',
      societyName: 'Green Valley Apartments',
      flatNumber: 'A-101',
      address: '123 Main Street, Mumbai',
      checklist,
      status,
      notes,
      photos,
      signature,
      gpsCoordinates: location || { latitude: 0, longitude: 0 },
      timestamp: new Date().toISOString(),
      synced: false,
    };

    try {
      await useJobStore.getState().addJob(job);
      
      const queuedJob: QueuedJob = {
        ...job,
        retryCount: 0,
      };
      await useJobStore.getState().addToQueue(queuedJob);
      
      Alert.alert('Success', 'Inspection saved! Will sync when online.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to save inspection. Please try again.');
    }
  };

  const groupedChecklist = checklist.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, ChecklistItem[]>);

  return (
    <ScreenKeyboardAwareScrollView contentContainerStyle={styles.container}>
      <Card style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Property Info</ThemedText>
        <View style={styles.infoRow}>
          <ThemedText style={[styles.label, { color: theme.textSecondary }]}>Society:</ThemedText>
          <ThemedText>Green Valley Apartments</ThemedText>
        </View>
        <View style={styles.infoRow}>
          <ThemedText style={[styles.label, { color: theme.textSecondary }]}>Flat:</ThemedText>
          <ThemedText>A-101</ThemedText>
        </View>
      </Card>

      <Card style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Checklist</ThemedText>
        {Object.entries(groupedChecklist).map(([category, items]) => (
          <View key={category} style={styles.checklistCategory}>
            <ThemedText style={[styles.categoryTitle, { color: theme.textSecondary }]}>{category}</ThemedText>
            {items.map((item) => (
              <Pressable
                key={item.id}
                style={styles.checklistItem}
                onPress={() => toggleChecklistItem(item.id)}
              >
                <Feather
                  name={item.checked ? 'check-square' : 'square'}
                  size={20}
                  color={item.checked ? theme.success : theme.textSecondary}
                />
                <ThemedText style={styles.checklistLabel}>{item.label}</ThemedText>
              </Pressable>
            ))}
          </View>
        ))}
      </Card>

      <Card style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Status</ThemedText>
        <Pressable
          style={[styles.picker, { borderColor: theme.border, backgroundColor: theme.surface }]}
          onPress={() => setShowStatusPicker(!showStatusPicker)}
        >
          <ThemedText>{status}</ThemedText>
          <Feather name="chevron-down" size={20} color={theme.textSecondary} />
        </Pressable>
        {showStatusPicker ? (
          <View style={[styles.pickerOptions, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            {STATUS_OPTIONS.map((option) => (
              <Pressable
                key={option}
                style={styles.pickerOption}
                onPress={() => {
                  setStatus(option);
                  setShowStatusPicker(false);
                }}
              >
                <ThemedText>{option}</ThemedText>
              </Pressable>
            ))}
          </View>
        ) : null}
      </Card>

      <Card style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Notes</ThemedText>
        <TextInput
          style={[styles.textArea, { borderColor: theme.border, color: theme.text, backgroundColor: theme.surface }]}
          value={notes}
          onChangeText={setNotes}
          placeholder="Add notes here..."
          placeholderTextColor={theme.textSecondary}
          multiline
          numberOfLines={4}
        />
      </Card>

      <Card style={styles.section}>
        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>Photos ({photos.length}/10)</ThemedText>
          <Pressable
            style={[styles.addButton, { backgroundColor: theme.primary }]}
            onPress={pickImage}
          >
            <Feather name="camera" size={16} color={theme.buttonText} />
            <ThemedText style={[styles.addButtonText, { color: theme.buttonText }]}>Add Photo</ThemedText>
          </Pressable>
        </View>
        {photos.length > 0 ? (
          <ScrollView horizontal style={styles.photoGallery} showsHorizontalScrollIndicator={false}>
            {photos.map((photo, index) => (
              <View key={index} style={styles.photoContainer}>
                <Image source={{ uri: photo }} style={styles.photo} />
                <Pressable
                  style={[styles.removePhoto, { backgroundColor: theme.error }]}
                  onPress={() => removePhoto(index)}
                >
                  <Feather name="x" size={16} color={theme.buttonText} />
                </Pressable>
              </View>
            ))}
          </ScrollView>
        ) : null}
      </Card>

      <Card style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Signature</ThemedText>
        {signature ? (
          <View>
            <Image source={{ uri: signature }} style={styles.signaturePreview} />
            <Pressable style={[styles.button, { backgroundColor: theme.textSecondary }]} onPress={handleSignature}>
              <ThemedText style={[styles.buttonText, { color: theme.buttonText }]}>Re-capture Signature</ThemedText>
            </Pressable>
          </View>
        ) : (
          <Pressable style={[styles.button, { backgroundColor: theme.primary }]} onPress={handleSignature}>
            <Feather name="edit-3" size={20} color={theme.buttonText} />
            <ThemedText style={[styles.buttonText, { color: theme.buttonText }]}>Capture Signature</ThemedText>
          </Pressable>
        )}
      </Card>

      <Card style={styles.section}>
        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>GPS Coordinates</ThemedText>
          <Pressable onPress={requestLocationPermission}>
            <Feather name="refresh-cw" size={20} color={theme.primary} />
          </Pressable>
        </View>
        {location ? (
          <ThemedText style={[styles.gpsText, { color: theme.textSecondary }]}>
            {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
          </ThemedText>
        ) : (
          <ThemedText style={[styles.gpsText, { color: theme.error }]}>Location not available</ThemedText>
        )}
      </Card>

      <Pressable
        style={[styles.submitButton, { backgroundColor: signature ? theme.success : theme.textSecondary }]}
        onPress={handleSubmit}
        disabled={!signature}
      >
        <ThemedText style={[styles.submitButtonText, { color: theme.buttonText }]}>SUBMIT INSPECTION</ThemedText>
      </Pressable>
    </ScreenKeyboardAwareScrollView>
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    ...Typography.h2,
  },
  infoRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  label: {
    ...Typography.body,
    fontWeight: '600',
  },
  checklistCategory: {
    gap: Spacing.sm,
  },
  categoryTitle: {
    ...Typography.body,
    fontWeight: '600',
    marginTop: Spacing.sm,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  checklistLabel: {
    ...Typography.body,
  },
  picker: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: BorderRadius.xs,
    padding: Spacing.lg,
  },
  pickerOptions: {
    borderWidth: 1,
    borderRadius: BorderRadius.xs,
    overflow: 'hidden',
  },
  pickerOption: {
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  textArea: {
    borderWidth: 1,
    borderRadius: BorderRadius.xs,
    padding: Spacing.lg,
    ...Typography.body,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.xs,
  },
  addButtonText: {
    ...Typography.caption,
    fontWeight: '600',
  },
  photoGallery: {
    flexDirection: 'row',
  },
  photoContainer: {
    position: 'relative',
    marginRight: Spacing.md,
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: BorderRadius.xs,
  },
  removePhoto: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xs,
  },
  buttonText: {
    ...Typography.button,
  },
  signaturePreview: {
    width: '100%',
    height: 150,
    borderRadius: BorderRadius.xs,
    marginBottom: Spacing.md,
  },
  gpsText: {
    ...Typography.body,
  },
  submitButton: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.xs,
    alignItems: 'center',
    marginBottom: Spacing['2xl'],
  },
  submitButtonText: {
    ...Typography.button,
  },
});
