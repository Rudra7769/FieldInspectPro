import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { ThemedText } from "./ThemedText";
import { useTimerStore } from "../src/store/timerStore";

export function HeaderTimer() {
  const { isRunning, startTime } = useTimerStore();
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (!isRunning || !startTime) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [isRunning, startTime]);

  if (!isRunning || !startTime) {
    return null;
  }

  const elapsedMs = now - startTime;
  const minutes = Math.floor(elapsedMs / 60000);
  const seconds = Math.floor((elapsedMs % 60000) / 1000);

  return (
    <ThemedText style={styles.timer}>
      {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
    </ThemedText>
  );
}

const styles = StyleSheet.create({
  timer: {
    fontSize: 12,
    fontWeight: "600",
  },
});
