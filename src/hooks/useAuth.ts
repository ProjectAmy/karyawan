'use client';

import { useAuth as useSupabaseAuth } from '@/providers/AuthProvider';

export const useAuth = () => {
  return useSupabaseAuth();
};
