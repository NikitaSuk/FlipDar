"use client";
import { useSession } from '@supabase/auth-helpers-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useProtectedRoute } from '../../hooks/useProtectedRoute';

const QuestionIcon = () => <span className="inline-block w-5 h-5 mr-2 align-middle">❓</span>;
const ArrowIcon = ({ isOpen }: { isOpen: boolean }) => (
  <span className={`inline-block w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
    ▼
  </span>
);

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQPage() {
  const { session, isLoading } = useProtectedRoute();
  const [openItems, setOpenItems] = useState<number[]>([]);

  const faqData: FAQItem[] = [
    {
      question: "What is FlipDar?",
      answer: "FlipDar is a comprehensive reselling analytics platform that helps you research market prices, track your transactions, and maximize your profits when buying and selling items. We integrate with eBay to provide real-time market data and insights."
    },
    {
      question: "How does the price analysis work?",
      answer: "Our platform searches eBay's completed listings to find recently sold items that match your search. We then calculate average prices, price ranges, and market trends to help you make informed buying and selling decisions."
    },
    {
      question: "Is FlipDar free to use?",
      answer: "We offer a free tier with limited searches per day, plus premium plans with unlimited searches and advanced features. Check our subscription page for detailed pricing and feature comparisons."
    },
    {
      question: "How accurate are the price estimates?",
      answer: "Our price estimates are based on real eBay sales data from completed listings. However, prices can vary based on condition, timing, and market fluctuations. We recommend using our data as a guide alongside your own research."
    },
    {
      question: "Can I track my own buying and selling?",
      answer: "Yes! You can add your purchases and sales to track your profits, analyze your performance, and identify your most profitable items. Our analytics dashboard provides detailed insights into your flipping business."
    },
    {
      question: "What items can I research?",
      answer: "You can research virtually any item that's sold on eBay. Popular categories include electronics, collectibles, clothing, books, and more. The more specific your search terms, the more accurate your results will be."
    },
    {
      question: "How often is the data updated?",
      answer: "Our data is updated in real-time as we fetch the latest completed sales from eBay. This ensures you're always working with the most current market information."
    },
    {
      question: "Can I export my data?",
      answer: "Premium subscribers can export their transaction history and search data for further analysis in spreadsheets or other tools. This feature is available in our Pro and Enterprise plans."
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely. We use industry-standard encryption and security practices to protect your data. Your personal information and transaction history are never shared with third parties without your explicit consent."
    },
    {
      question: "What if I find incorrect data?",
      answer: "If you notice any discrepancies in our data, please contact our support team. We continuously monitor and improve our data accuracy, and your feedback helps us maintain high quality standards."
    },
    {
      question: "Can I use FlipDar on mobile?",
      answer: "Yes! FlipDar is fully responsive and works great on mobile devices. You can search for items, track transactions, and view analytics from your smartphone or tablet."
    },
    {
      question: "How do I get started?",
      answer: "Simply sign up for a free account and start searching for items you're interested in buying or selling. Add your first transaction to begin tracking your profits and building your analytics dashboard."
    }
  ];

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading FAQ...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null; // This will be handled by useProtectedRoute
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <QuestionIcon />
            <h1 className="text-3xl font-bold text-gray-800">Frequently Asked Questions</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about FlipDar, our features, and how to get the most out of your reselling business.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4 mb-12">
          {faqData.map((item, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-800 pr-4">{item.question}</span>
                <ArrowIcon isOpen={openItems.includes(index)} />
              </button>
              {openItems.includes(index) && (
                <div className="px-6 pb-4">
                  <p className="text-gray-600 leading-relaxed">{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Additional Help Section */}
        <div className="bg-white rounded-2xl shadow p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Still Need Help?</h2>
          <p className="text-gray-600 mb-6">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/contact" 
              className="btn-primary"
            >
              Contact Support
            </Link>
            <Link 
              href="/account" 
              className="btn-secondary"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="font-semibold text-gray-800 mb-2">Analytics</h3>
            <p className="text-sm text-gray-600 mb-4">Track your profits and performance</p>
            <Link href="/account/analytics" className="text-green-600 hover:text-green-700 font-medium">
              View Analytics →
            </Link>
          </div>
          
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <div className="text-3xl mb-3">💳</div>
            <h3 className="font-semibold text-gray-800 mb-2">Pricing</h3>
            <p className="text-sm text-gray-600 mb-4">Compare plans and features</p>
            <Link href="/account/subscription" className="text-green-600 hover:text-green-700 font-medium">
              View Plans →
            </Link>
          </div>
          
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <div className="text-3xl mb-3">⚙️</div>
            <h3 className="font-semibold text-gray-800 mb-2">Settings</h3>
            <p className="text-sm text-gray-600 mb-4">Customize your experience</p>
            <Link href="/account/settings" className="text-green-600 hover:text-green-700 font-medium">
              Manage Settings →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 