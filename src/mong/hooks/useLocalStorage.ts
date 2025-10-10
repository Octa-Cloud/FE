/**
 * localStorage를 React 훅으로 사용하는 커스텀 훅
 */
import { useState, useEffect, useCallback } from 'react';
import { storage } from '../utils/storage';

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  // 상태 초기화
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = storage.get<T>(key);
      return item !== null ? item : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // 값 설정 함수
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      storage.set(key, valueToStore);
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // 값 제거 함수
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      storage.remove(key);
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  // localStorage 변경 감지
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          const newValue = JSON.parse(e.newValue);
          setStoredValue(newValue);
        } catch (error) {
          console.warn(`Error parsing localStorage value for key "${key}":`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue, removeValue];
}

/**
 * 사용자 데이터 전용 localStorage 훅
 */
export function useUserStorage() {
  const [currentUser, setCurrentUser] = useLocalStorage('user', null);
  const [users, setUsers] = useLocalStorage('users', []);

  const updateCurrentUser = useCallback((user: any) => {
    setCurrentUser(user);
  }, [setCurrentUser]);

  const removeCurrentUser = useCallback(() => {
    setCurrentUser(null);
  }, [setCurrentUser]);

  const addUser = useCallback((newUser: any) => {
    setUsers((prevUsers: any[]) => {
      const existingUsers = prevUsers || [];
      const userExists = existingUsers.some((user: any) => user.email === newUser.email);
      
      if (!userExists) {
        return [...existingUsers, newUser];
      }
      return existingUsers;
    });
  }, [setUsers]);

  const updateUser = useCallback((userId: string, updatedUser: any) => {
    setUsers((prevUsers: any[]) => {
      if (!prevUsers) return [updatedUser];
      
      return prevUsers.map((user: any) => 
        user.id === userId ? { ...user, ...updatedUser } : user
      );
    });
  }, [setUsers]);

  const removeUser = useCallback((userId: string) => {
    setUsers((prevUsers: any[]) => {
      if (!prevUsers) return [];
      
      return prevUsers.filter((user: any) => user.id !== userId);
    });
  }, [setUsers]);

  const findUserByEmail = useCallback((email: string) => {
    const existingUsers = users || [];
    return existingUsers.find((user: any) => user.email === email);
  }, [users]);

  return {
    currentUser,
    users,
    updateCurrentUser,
    removeCurrentUser,
    addUser,
    updateUser,
    removeUser,
    findUserByEmail
  };
}

/**
 * 수면 목표 데이터 전용 localStorage 훅
 */
export function useSleepGoalsStorage(userId?: string) {
  const key = userId ? `sleepGoals_${userId}` : 'sleepGoals';
  const [sleepGoals, setSleepGoals] = useLocalStorage(key, null);

  const updateSleepGoals = useCallback((goals: any) => {
    setSleepGoals(goals);
  }, [setSleepGoals]);

  const removeSleepGoals = useCallback(() => {
    setSleepGoals(null);
  }, [setSleepGoals]);

  return {
    sleepGoals,
    updateSleepGoals,
    removeSleepGoals
  };
}
