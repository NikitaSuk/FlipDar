"use client";
import { useSession } from '@supabase/auth-helpers-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useProtectedRoute } from '../../../hooks/useProtectedRoute';

const CrownIcon = () => <span className="inline-block w-5 h-5 mr-2 align-middle">👑</span>;
const CheckIcon = () => <span className="inline-block w-4 h-4 text-green-500">✓</span>;
const StarIcon = () => <span className="inline-block w-5 h-5 mr-2 align-middle">⭐</span>;

export default function SubscriptionPage() {
  const { session, isLoading } = useProtectedRoute();
  const [currentPlan, setCurrentPlan] = useState('free');
  const [billingCycle, setBillingCycle] = useState('monthly');

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      period: 'forever',
      features: [
        '10 searches per day',
        'Basic market insights',
        'Standard support',
        'Mobile app access'
      ],
      popular: false
    },
    {
      id: 'pro',
      name: 'Pro',
      price: billingCycle === 'monthly' ? 4.99 : 49.99,
      period: billingCycle === 'monthly' ? 'month' : 'year',
      features: [
        '100 searches per day',
        'Advanced market insights',
        'Priority support',
        'Export data to CSV',
        'Price alerts',
        'Trend analysis'
      ],
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: billingCycle === 'monthly' ? 14.99 : 149.99,
      period: billingCycle === 'monthly' ? 'month' : 'year',
      features: [
        'Everything in Pro',
        'Unlimited searches',
        'Bulk data export',
        'Advanced analytics',
        'Custom reports',
        'API access'
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading subscription...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null; // This will be handled by useProtectedRoute
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-50 flex flex-col items-center p-4">
      <div className="w-full max-w-6xl mt-8">
        {/* Header */}
        <div className="relative mb-8">
          <div className="absolute left-0 top-0">
            <Link href="/account" className="text-gray-600 hover:text-gray-800">← Back to Account</Link>
          </div>
          <div className="text-center">
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
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center shadow-md whitespace-nowrap min-w-max">
                    <span className="mr-2"><StarIcon /></span>
                    <span className="tracking-tight">Most Popular</span>
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
        <div className="mt-12 bg-white rounded-2xl shadow p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Frequently Asked Questions</h2>
            <p className="text-gray-600">Everything you need to know about FlipDar subscriptions</p>
          </div>
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-sm font-bold">?</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 mb-2 text-lg">Can I cancel anytime?</h3>
                  <p className="text-gray-600 leading-relaxed">Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.</p>
                </div>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-colors">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-sm font-bold">$</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 mb-2 text-lg">What payment methods do you accept?</h3>
                  <p className="text-gray-600 leading-relaxed">We accept all major credit cards, PayPal, and Apple Pay for your convenience.</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 text-sm font-bold">✓</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 mb-2 text-lg">Is there a free trial?</h3>
                  <p className="text-gray-600 leading-relaxed">Yes, all paid plans come with a 3-day free trial. No credit card required to start exploring FlipDar's features.</p>
                </div>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-colors">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 text-sm font-bold">⚡</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 mb-2 text-lg">How quickly can I start using FlipDar?</h3>
                  <p className="text-gray-600 leading-relaxed">You can start using FlipDar immediately after signing up. No setup required - just search and analyze!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 