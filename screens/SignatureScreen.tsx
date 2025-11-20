import React, { useRef } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { useTheme } from '../hooks/useTheme';
import { Spacing, BorderRadius } from '../constants/theme';
import SignatureCanvas from 'react-native-signature-canvas';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type SignatureScreenRouteProp = RouteProp<RootStackParamList, 'Signature'>;

export default function SignatureScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<SignatureScreenRouteProp>();
  const signatureRef = useRef<any>(null);

  const handleSignature = (signature: string) => {
    route.params.onSignatureCapture(signature);
    navigation.goBack();
  };

  const handleClear = () => {
    signatureRef.current?.clearSignature();
  };

  const handleConfirm = () => {
    signatureRef.current?.readSignature();
  };

  const webStyle = `
    .m-signature-pad {
      box-shadow: none;
      border: none;
      background-color: ${theme.surface};
    }
    .m-signature-pad--body {
      border: none;
    }
    .m-signature-pad--footer {
      display: none;
    }
    body,html {
      width: 100%;
      height: 100%;
      margin: 0;
      padding: 0;
    }
  `;

  return (
    <ThemedView style={styles.container}>
      <View style={styles.canvasContainer}>
        <SignatureCanvas
          ref={signatureRef}
          onOK={handleSignature}
          descriptionText="Sign here"
          clearText="Clear"
          confirmText="Confirm"
          webStyle={webStyle}
          backgroundColor={theme.surface}
          penColor={theme.text}
        />
      </View>

      <View style={styles.footer}>
        <Pressable
          style={[styles.button, { backgroundColor: theme.textSecondary }]}
          onPress={handleClear}
        >
          <ThemedText style={[styles.buttonText, { color: theme.buttonText }]}>Clear</ThemedText>
        </Pressable>

        <Pressable
          style={[styles.button, { backgroundColor: theme.primary }]}
          onPress={handleConfirm}
        >
          <ThemedText style={[styles.buttonText, { color: theme.buttonText }]}>Done</ThemedText>
        </Pressable>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  canvasContainer: {
    flex: 1,
    margin: Spacing.lg,
  },
  footer: {
    flexDirection: 'row',
    gap: Spacing.lg,
    padding: Spacing.lg,
  },
  button: {
    flex: 1,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xs,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
