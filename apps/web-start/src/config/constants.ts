/**
 * Centralized constants - Single source of truth
 * Created: 2025-10-10 (Architecture Refactor Phase 1)
 */

// User Authentication
export const CURRENT_USER_ID = 'cmfr0jb7n0004k07ai1j02p8z'; // Dr. Bart (PROFESSOR)

// API Endpoints
export const API_ENDPOINTS = {
  users: '/users',
  courses: '/courses',
  assignments: '/assignments',
  submissions: '/submissions',
  grades: '/grades',
} as const;

// Design Tokens - Colors
export const COLORS = {
  // Primary
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    500: '#2563eb',
    600: '#1d4ed8',
    700: '#1e40af',
    900: '#1e3a8a',
  },
  // Success/Green
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    500: '#15803d',
    600: '#166534',
    700: '#14532d',
  },
  // Gray
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    400: '#9ca3af',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  // Warning/Orange
  warning: {
    100: '#fed7aa',
    500: '#d97706',
    700: '#9a3412',
  },
  // Error/Red
  error: {
    100: '#fecaca',
    200: '#fef2f2',
    500: '#dc2626',
    600: '#dc2626',
    900: '#991b1b',
  },
  // Purple
  purple: {
    100: '#f3e8ff',
    200: '#e9d5ff',
    500: '#7c3aed',
    800: '#6b21a8',
  },
} as const;

// Design Tokens - Spacing
export const SPACING = {
  xs: '0.5rem',    // 8px
  sm: '1rem',      // 16px
  md: '1.5rem',    // 24px
  lg: '2rem',      // 32px
  xl: '3rem',      // 48px
} as const;

// Design Tokens - Typography
export const TYPOGRAPHY = {
  sizes: {
    xs: '0.75rem',     // 12px
    sm: '0.875rem',    // 14px
    base: '1rem',      // 16px
    lg: '1.125rem',    // 18px
    xl: '1.25rem',     // 20px
    '2xl': '1.5rem',   // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2rem',     // 32px
  },
  weights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
} as const;
