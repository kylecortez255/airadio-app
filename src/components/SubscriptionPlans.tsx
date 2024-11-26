import React from 'react';
import { Check, Crown, Sparkles } from 'lucide-react';
import { useSubscriptionStore, type Plan } from '../store/subscriptionStore';
import { cn } from '../lib/utils';

export function SubscriptionPlans() {
  const { plans, currentPlan, setPlan, isLoading } = useSubscriptionStore();

  const handleSubscribe = async (plan: Plan) => {
    if (plan.id === currentPlan) return;
    
    // Here you would integrate with your payment processor
    console.log(`Subscribing to ${plan.name} plan`);
  };

  return (
    <div className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Choose Your Plan</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Unlock the full potential of AI-powered music and content with our premium plans.
            Cancel anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={cn(
                "relative rounded-2xl p-8",
                plan.isPopular
                  ? "bg-blue-500 text-white"
                  : "bg-gray-800 text-white"
              )}
            >
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="bg-yellow-500 text-black text-sm font-medium px-3 py-1 rounded-full flex items-center gap-1">
                    <Crown className="w-4 h-4" />
                    Most Popular
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-center justify-center gap-1">
                  <span className="text-3xl font-bold">
                    ${plan.price}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-sm opacity-80">/month</span>
                  )}
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="w-5 h-5 mt-0.5 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan)}
                disabled={isLoading || plan.id === currentPlan}
                className={cn(
                  "w-full py-3 px-4 rounded-lg font-medium transition",
                  plan.isPopular
                    ? "bg-white text-blue-500 hover:bg-gray-100"
                    : "bg-blue-500 text-white hover:bg-blue-600",
                  (isLoading || plan.id === currentPlan) && "opacity-50 cursor-not-allowed"
                )}
              >
                {plan.id === currentPlan ? 'Current Plan' : 'Subscribe'}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-400">
            All plans include a 14-day free trial. No credit card required.
          </p>
        </div>
      </div>
    </div>
  );
}