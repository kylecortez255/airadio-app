import { create } from 'zustand';

export interface Plan {
  id: string;
  name: string;
  price: number;
  features: string[];
  isPopular?: boolean;
}

interface SubscriptionState {
  plans: Plan[];
  currentPlan: string | null;
  setPlan: (planId: string) => void;
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

export const plans: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    features: [
      'Ad-supported streaming',
      'Basic AI recommendations',
      'Standard audio quality',
      'Limited skips'
    ]
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 9.99,
    features: [
      'Ad-free streaming',
      'Advanced AI recommendations',
      'High-quality audio',
      'Unlimited skips',
      'Offline listening',
      'Custom playlists'
    ],
    isPopular: true
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 14.99,
    features: [
      'Everything in Premium',
      'Ultra-high quality audio',
      'Early access to features',
      'Priority support',
      'Exclusive content',
      'Family sharing (up to 6 accounts)'
    ]
  }
];

export const useSubscriptionStore = create<SubscriptionState>((set) => ({
  plans,
  currentPlan: 'free',
  isLoading: false,
  setPlan: (planId) => set({ currentPlan: planId }),
  setLoading: (loading) => set({ isLoading: loading })
}));