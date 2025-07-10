"use client";
import { useState } from 'react';
import Link from 'next/link';

const ChevronDownIcon = () => <span className="inline-block w-4 h-4">▼</span>;
const ChevronRightIcon = () => <span className="inline-block w-4 h-4">▶</span>;

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const faqData: FAQItem[] = [
    // Getting Started
    {
      question: "How do I get started with FlipFlop?",
      answer: "Getting started is easy! Simply sign up for a free account, verify your email, and you can immediately start searching for items to flip. Our platform provides real-time market data to help you make informed decisions.",
      category: "getting-started"
    },
    {
      question: "Is FlipFlop free to use?",
      answer: "Yes! We offer a free tier that includes 5 searches per day, basic market insights, and standard support. For power users, we offer Pro and Enterprise plans with unlimited searches and advanced features.",
      category: "getting-started"
    },
    {
      question: "What markets does FlipFlop support?",
      answer: "Currently, we support eBay market data with plans to expand to other platforms like Amazon, Facebook Marketplace, and Craigslist. Our data includes sold prices, listing durations, and market trends.",
      category: "getting-started"
    },
    {
      question: "Do I need to create an account?",
      answer: "While you can browse some basic information without an account, creating a free account gives you access to search history, transaction tracking, and personalized insights that help you make better flipping decisions.",
      category: "getting-started"
    },

    // Features & Usage
    {
      question: "How accurate is the market data?",
      answer: "Our data is sourced directly from eBay's completed listings and is updated in real-time. We aggregate thousands of data points to provide accurate market insights, including average sold prices, listing success rates, and market trends.",
      category: "features"
    },
    {
      question: "Can I track my own transactions?",
      answer: "Absolutely! Our transaction tracking feature allows you to log your purchases and sales, calculate profits, and analyze your flipping performance over time. This helps you identify your most profitable items and strategies.",
      category: "features"
    },
    {
      question: "How do search suggestions work?",
      answer: "Our search suggestions use a combination of your search history and a comprehensive database of popular items. This helps standardize item names and reduces typos, making your searches more effective.",
      category: "features"
    },
    {
      question: "Can I export my data?",
      answer: "Pro and Enterprise users can export their transaction data and search history in CSV format. This is useful for tax purposes, performance analysis, or backup purposes.",
      category: "features"
    },

    // Account & Billing
    {
      question: "How do I upgrade my subscription?",
      answer: "You can upgrade your subscription at any time from your account settings. Simply go to the Subscription page, choose your desired plan, and follow the payment process. Your new features will be available immediately.",
      category: "billing"
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Yes, you can cancel your subscription at any time from your account settings. You'll continue to have access to your paid features until the end of your current billing period.",
      category: "billing"
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and Apple Pay. All payments are processed securely through our payment partners.",
      category: "billing"
    },
    {
      question: "Is there a free trial for paid plans?",
      answer: "Yes! All paid plans come with a 7-day free trial. No credit card is required to start the trial, and you can cancel anytime during the trial period without being charged.",
      category: "billing"
    },

    // Privacy & Security
    {
      question: "Is my data secure?",
      answer: "Yes, we take data security seriously. We use industry-standard encryption, secure servers, and follow best practices for data protection. Your personal information and transaction data are never shared with third parties without your consent.",
      category: "privacy"
    },
    {
      question: "What information do you collect?",
      answer: "We collect basic account information (email, name), search queries, and any transaction data you choose to log. We also collect anonymous usage data to improve our service. You can review our full Privacy Policy for details.",
      category: "privacy"
    },
    {
      question: "Can I delete my account and data?",
      answer: "Yes, you can delete your account and all associated data at any time from your account settings. This action is permanent and cannot be undone, so please make sure to export any important data first.",
      category: "privacy"
    },

    // Technical Support
    {
      question: "What browsers are supported?",
      answer: "We support all modern browsers including Chrome, Firefox, Safari, and Edge. For the best experience, we recommend using the latest version of your browser.",
      category: "support"
    },
    {
      question: "Is there a mobile app?",
      answer: "Our web app is fully responsive and works great on mobile devices. We're currently developing native mobile apps for iOS and Android, which will be available soon.",
      category: "support"
    },
    {
      question: "How do I get help if I have issues?",
      answer: "You can contact our support team through the contact form on our website, email us at support@flipflop.com, or call us at (555) 123-FLIP during business hours. Pro users get priority support.",
      category: "support"
    },
    {
      question: "Do you offer API access?",
      answer: "Yes, Enterprise users have access to our API, allowing you to integrate FlipFlop data into your own applications or workflows. Contact us for API documentation and access.",
      category: "support"
    }
  ];

  const categories = [
    { id: 'all', name: 'All Questions' },
    { id: 'getting-started', name: 'Getting Started' },
    { id: 'features', name: 'Features & Usage' },
    { id: 'billing', name: 'Account & Billing' },
    { id: 'privacy', name: 'Privacy & Security' },
    { id: 'support', name: 'Technical Support' }
  ];

  const filteredFAQs = selectedCategory === 'all' 
    ? faqData 
    : faqData.filter(faq => faq.category === selectedCategory);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-50 flex flex-col items-center p-4">
      <div className="w-full max-w-4xl mt-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Link href="/" className="text-gray-600 hover:text-gray-800 mr-4">← Back to Home</Link>
            <h1 className="text-3xl font-bold text-gray-800">Frequently Asked Questions</h1>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow p-6 mb-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">How can we help you?</h2>
            <p className="text-gray-600 mb-6">
              Find answers to common questions about FlipFlop. Can't find what you're looking for? 
              <Link href="/contact" className="text-green-600 hover:text-green-700 ml-1">Contact us</Link>.
            </p>
          </div>
        </div>

        {/* Category Filter */}
        <div className="bg-white rounded-2xl shadow p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Filter by Category</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  selectedCategory === category.id
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Items */}
        <div className="bg-white rounded-2xl shadow p-6">
          <div className="space-y-4">
            {filteredFAQs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition"
                >
                  <span className="font-medium text-gray-800">{faq.question}</span>
                  {openItems.includes(index) ? <ChevronDownIcon /> : <ChevronRightIcon />}
                </button>
                {openItems.includes(index) && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredFAQs.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-600">No questions found for this category.</p>
            </div>
          )}
        </div>

        {/* Contact CTA */}
        <div className="bg-white rounded-2xl shadow p-8 mt-8 text-center">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Still have questions?</h3>
          <p className="text-gray-600 mb-6">
            Can't find the answer you're looking for? Our support team is here to help!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Contact Support
            </Link>
            <a
              href="mailto:support@flipflop.com"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Email Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 