/**
 * LocalStorage 유틸리티 함수들
 * 타입 안전성과 에러 처리를 포함한 localStorage 관리
 */

import { StorageOptions } from '../types/utils';

/**
 * 타입 안전한 localStorage 읽기
 */
export const storage = {
  /**
   * localStorage에서 값을 읽어옵니다
   */
  get: <T>(key: string, options?: StorageOptions): T | null => {
    try {
      const item = localStorage.getItem(key);
      if (item === null) {
        return options?.defaultValue ?? null;
      }
      
      if (options?.serializer) {
        return options.serializer.read(item);
      }
      
      return JSON.parse(item);
    } catch (error) {
      console.warn(`Failed to read from localStorage key "${key}":`, error);
      return options?.defaultValue ?? null;
    }
  },

  /**
   * localStorage에 값을 저장합니다
   */
  set: <T>(key: string, value: T, options?: StorageOptions): boolean => {
    try {
      let serializedValue: string;
      
      if (options?.serializer) {
        serializedValue = options.serializer.write(value);
      } else {
        serializedValue = JSON.stringify(value);
      }
      
      localStorage.setItem(key, serializedValue);
      return true;
    } catch (error) {
      console.warn(`Failed to write to localStorage key "${key}":`, error);
      return false;
    }
  },

  /**
   * localStorage에서 값을 제거합니다
   */
  remove: (key: string): boolean => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn(`Failed to remove from localStorage key "${key}":`, error);
      return false;
    }
  },

  /**
   * localStorage를 초기화합니다
   */
  clear: (): boolean => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.warn('Failed to clear localStorage:', error);
      return false;
    }
  },

  /**
   * localStorage 키가 존재하는지 확인합니다
   */
  has: (key: string): boolean => {
    return localStorage.getItem(key) !== null;
  },

  /**
   * localStorage의 모든 키를 반환합니다
   */
  keys: (): string[] => {
    return Object.keys(localStorage);
  }
};

/**
 * 사용자 데이터 전용 storage 헬퍼
 */
export const userStorage = {
  getCurrentUser: () => storage.get('user'),
  setCurrentUser: (user: any) => storage.set('user', user),
  removeCurrentUser: () => storage.remove('user'),
  
  getUsers: () => storage.get<any[]>('users', { defaultValue: [] }),
  setUsers: (users: any[]) => storage.set('users', users),
  
  getSleepGoals: (userId?: string) => {
    const key = userId ? `sleepGoals_${userId}` : 'sleepGoals';
    return storage.get(key, { defaultValue: null });
  },
  setSleepGoals: (sleepGoals: any, userId?: string) => {
    const key = userId ? `sleepGoals_${userId}` : 'sleepGoals';
    return storage.set(key, sleepGoals);
  }
};

/**
 * 에러 처리를 포함한 localStorage 작업
 */
export const safeStorage = {
  get: <T>(key: string, defaultValue?: T): T | null => {
    try {
      return storage.get<T>(key, { defaultValue });
    } catch {
      return defaultValue ?? null;
    }
  },
  
  set: <T>(key: string, value: T): boolean => {
    try {
      return storage.set(key, value);
    } catch {
      return false;
    }
  },
  
  remove: (key: string): boolean => {
    try {
      return storage.remove(key);
    } catch {
      return false;
    }
  }
};
