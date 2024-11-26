import React from 'react';
import { SubscriptionPlans } from '../components/SubscriptionPlans';

export function PlansPage() {
  return (
    <div className="px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Unlock the full potential of AI-powered music and content with our premium plans.
            Cancel anytime.
          </p>
        </div>
        <SubscriptionPlans />
      </div>
    </div>
  );
}