"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const EmailIcon = () => <span className="inline-block w-5 h-5 mr-2 align-middle">📧</span>;
const ClockIcon = () => <span className="inline-block w-5 h-5 mr-2 align-middle">🕒</span>;

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
  category: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Here you would typically send the form data to your backend
      console.log('Form submitted:', formData);
      
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        category: 'general'
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactMethods = [
    {
      icon: <EmailIcon />,
      title: 'Email Support',
      description: 'Get help via email',
      contact: 'flipdarllc@gmail.com',
      response: 'Within 24 hours',
      action: 'mailto:flipdarllc@gmail.com'
    }
  ];

  const faqCategories = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'technical', label: 'Technical Support' },
    { value: 'billing', label: 'Billing & Subscription' },
    { value: 'feature', label: 'Feature Request' },
    { value: 'bug', label: 'Bug Report' },
    { value: 'partnership', label: 'Partnership' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">Contact Us</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have questions or need help? We're here to support your flipping journey. 
            Choose the best way to reach us below.
          </p>
        </div>

        {/* Contact Methods */}
        <div className="mb-12 flex flex-col sm:flex-row gap-6 justify-center items-stretch">
          {/* Email Support Bubble */}
          {contactMethods.map((method, index) => (
            <div key={index} className="bg-white rounded-xl shadow p-6 text-center flex-1 min-w-[260px] max-w-xs flex flex-col justify-between">
              <div className="text-3xl mb-4">{method.icon}</div>
              <h3 className="font-semibold text-gray-800 mb-2">{method.title}</h3>
              <p className="text-sm text-gray-600 mb-3">{method.description}</p>
              <div className="text-sm text-gray-800 font-medium mb-2">{method.contact}</div>
              <a
                href={method.action}
                className="inline-block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
              >
                Contact Now
              </a>
            </div>
          ))}
          {/* Business Hours Bubble */}
          <div className="bg-white rounded-xl shadow p-6 text-center flex-1 min-w-[260px] max-w-xs flex flex-col justify-center items-center">
            <div className="text-3xl mb-4"><ClockIcon /></div>
            <h3 className="font-semibold text-gray-800 mb-2">Business Hours</h3>
            <p className="text-gray-700 text-sm mb-1">Mon – Fri</p>
            <p className="text-gray-700 text-sm mb-2">9:00 AM – 6:00 PM</p>
            <p className="text-gray-500 text-xs">We respond to inquiries during these hours.</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form */}
          <div className="bg-white rounded-2xl shadow p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Send us a Message</h2>
            
            {submitStatus === 'success' && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800">Thank you! Your message has been sent successfully. We'll get back to you soon.</p>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800">Sorry, there was an error sending your message. Please try again or contact us directly.</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {faqCategories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Brief description of your inquiry"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  placeholder="Please provide details about your inquiry..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-6 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

          {/* Info */}
          <div className="space-y-8">

            {/* Email Mention */}
            <div className="bg-white rounded-2xl shadow p-6 flex items-center">
              <EmailIcon />
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">Contact Email</h3>
                <a href="mailto:flipdarllc@gmail.com" className="text-green-600 hover:text-green-700 font-medium text-sm">flipdarllc@gmail.com</a>
                <p className="text-gray-500 text-xs">Feel free to email us directly for any inquiries.</p>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-2xl shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Links</h3>
              <div className="space-y-3">
                <Link href="/faq" className="block text-green-600 hover:text-green-700 font-medium">
                  FAQ & Help Center →
                </Link>
                <Link href="/account/subscription" className="block text-green-600 hover:text-green-700 font-medium">
                  Subscription Plans →
                </Link>
                <Link href="/privacy" className="block text-green-600 hover:text-green-700 font-medium">
                  Privacy Policy →
                </Link>
                <Link href="/terms" className="block text-green-600 hover:text-green-700 font-medium">
                  Terms of Service →
                </Link>
              </div>
            </div>

            {/* Related Topics */}
            <div className="bg-white rounded-2xl shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Related Topics</h3>
              <div className="space-y-3">
                <Link href="/suggestions" className="block text-green-600 hover:text-green-700 font-medium">
                  💡 Suggestions & Feedback →
                </Link>
                <Link href="/faq" className="block text-green-600 hover:text-green-700 font-medium">
                  ❓ Frequently Asked Questions →
                </Link>
                <Link href="/account/subscription" className="block text-green-600 hover:text-green-700 font-medium">
                  💳 Billing & Subscriptions →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 