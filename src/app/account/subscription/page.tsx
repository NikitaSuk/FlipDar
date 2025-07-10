"use client";
import { useSession } from '@supabase/auth-helpers-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const CrownIcon = () => <span className="inline-block w-5 h-5 mr-2 align-middle">👑</span>;
const CheckIcon = () => <span className="inline-block w-4 h-4 text-green-500">✓</span>;
const StarIcon = () => <span className="inline-block w-5 h-5 mr-2 align-middle">⭐</span>;

export default function SubscriptionPage() {
  const session = useSession();
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [currentPlan, setCurrentPlan] = useState('free');
  const [billingCycle, setBillingCycle] = useState('monthly');

  useEffect(() => {
    if (session === undefined) return;
    if (session === null) {
      router.push('/');
    }
    setChecked(true);
  }, [session, router]);

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      period: 'forever',
      features: [
        '5 searches per day',
        'Basic market insights',
        'Standard support',
        'Mobile app access'
      ],
      popular: false
    },
    {
      id: 'pro',
      name: 'Pro',
      price: billingCycle === 'monthly' ? 9.99 : 99.99,
      period: billingCycle === 'monthly' ? 'month' : 'year',
      features: [
        'Unlimited searches',
        'Advanced analytics',
        'Priority support',
        'Export data',
        'Custom alerts',
        'API access'
      ],
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: billingCycle === 'monthly' ? 29.99 : 299.99,
      period: billingCycle === 'monthly' ? 'month' : 'year',
      features: [
        'Everything in Pro',
        'Team collaboration',
        'White-label options',
        'Dedicated support',
        'Custom integrations',
        'Advanced reporting'
      ],
      popular: false
    }
  ];

  const handlePlanChange = (planId: string) => {
    if (planId === 'free') {
      setCurrentPlan('free');
      return;
    }
    
    // Here you would integrate with a payment processor
    console.log(`Upgrading to ${planId} plan (${billingCycle})`);
    alert(`This would redirect to payment for ${planId} plan`);
  };

  if (session === undefined || !checked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading subscription...</p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-50 flex flex-col items-center p-4">
      <div className="w-full max-w-6xl mt-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Link href="/account" className="text-gray-600 hover:text-gray-800 mr-4">← Back to Account</Link>
            <h1 className="text-2xl font-bold text-gray-800">Subscription Plans</h1>
          </div>
        </div>

        {/* Current Plan Status */}
        <div className="bg-white rounded-2xl shadow p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Current Plan</h2>
              <p className="text-gray-600">
                You're currently on the <span className="font-semibold text-green-600">{plans.find(p => p.id === currentPlan)?.name}</span> plan
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-800">
                ${plans.find(p => p.id === currentPlan)?.price}
                <span className="text-sm font-normal text-gray-600">
                  /{plans.find(p => p.id === currentPlan)?.period}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Billing Cycle Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-xl shadow p-1">
            <div className="flex">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-2 rounded-lg font-medium transition ${
                  billingCycle === 'monthly'
                    ? 'bg-green-600 text-white'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-6 py-2 rounded-lg font-medium transition ${
                  billingCycle === 'yearly'
                    ? 'bg-green-600 text-white'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Yearly
                <span className="ml-1 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                  Save 17%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white rounded-2xl shadow-lg p-6 relative ${
                plan.popular ? 'ring-2 ring-green-500' : ''
              } ${currentPlan === plan.id ? 'border-2 border-green-500' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
                    <StarIcon />
                    Most Popular
                  </div>
                </div>
              )}
              
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                <div className="text-3xl font-bold text-gray-800 mb-1">
                  ${plan.price}
                  <span className="text-sm font-normal text-gray-600">/{plan.period}</span>
                </div>
                {plan.id === 'free' && (
                  <p className="text-sm text-gray-600">No credit card required</p>
                )}
              </div>

              <div className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <CheckIcon />
                    <span className="ml-2 text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => handlePlanChange(plan.id)}
                className={`w-full py-3 px-4 rounded-lg font-medium transition ${
                  currentPlan === plan.id
                    ? 'bg-gray-100 text-gray-600 cursor-default'
                    : plan.popular
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-800 text-white hover:bg-gray-900'
                }`}
                disabled={currentPlan === plan.id}
              >
                {currentPlan === plan.id ? 'Current Plan' : plan.id === 'free' ? 'Get Started' : 'Upgrade'}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-12 bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-800 mb-2">Can I cancel anytime?</h3>
              <p className="text-gray-600">Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-800 mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600">We accept all major credit cards, PayPal, and Apple Pay.</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-800 mb-2">Is there a free trial?</h3>
              <p className="text-gray-600">Yes, all paid plans come with a 7-day free trial. No credit card required to start.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 