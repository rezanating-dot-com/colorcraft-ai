"use client";

import { useState, useCallback, useEffect } from "react";

const DAILY_LIMIT = 3;
const STORAGE_KEY = "colorcraft:daily-generations";
const PASSCODE = "1122";

interface DailyRecord {
  date: string;
  count: number;
}

function getTodayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function getRecord(): DailyRecord {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const record: DailyRecord = JSON.parse(raw);
      if (record.date === getTodayKey()) {
        return record;
      }
    }
  } catch {
    // ignore corrupt data
  }
  return { date: getTodayKey(), count: 0 };
}

function saveRecord(record: DailyRecord) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
}

export function useRateLimit() {
  const [remaining, setRemaining] = useState(DAILY_LIMIT);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    const record = getRecord();
    setRemaining(Math.max(0, DAILY_LIMIT - record.count));
  }, []);

  const canGenerate = unlocked || remaining > 0;

  const recordGeneration = useCallback(() => {
    const record = getRecord();
    record.count += 1;
    saveRecord(record);
    setRemaining(Math.max(0, DAILY_LIMIT - record.count));
  }, []);

  const verifyPasscode = useCallback((code: string): boolean => {
    if (code === PASSCODE) {
      setUnlocked(true);
      return true;
    }
    return false;
  }, []);

  return { remaining, canGenerate, unlocked, recordGeneration, verifyPasscode };
}
