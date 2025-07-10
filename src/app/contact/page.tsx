"use client";
import { useState } from 'react';
import Link from 'next/link';

const MailIcon = () => <span className="inline-block w-5 h-5 mr-2 align-middle">📧</span>;
const PhoneIcon = () => <span className="inline-block w-5 h-5 mr-2 align-middle">📞</span>;
const LocationIcon = () => <span className="inline-block w-5 h-5 mr-2 align-middle">📍</span>;
const ClockIcon = () => <span className="inline-block w-5 h-5 mr-2 align-middle">🕒</span>;

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Contact form submitted:', formData);
    setSubmitted(true);
    setIsSubmitting(false);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-50 flex flex-col items-center p-4">
      <div className="w-full max-w-6xl mt-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Link href="/" className="text-gray-600 hover:text-gray-800 mr-4">← Back to Home</Link>
            <h1 className="text-3xl font-bold text-gray-800">Contact Us</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Send us a Message</h2>
            
            {submitted ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">✅</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Message Sent!</h3>
                <p className="text-gray-600 mb-4">Thank you for contacting us. We'll get back to you soon.</p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="billing">Billing Question</option>
                    <option value="feature">Feature Request</option>
                    <option value="bug">Bug Report</option>
                    <option value="partnership">Partnership</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    required
                    rows={5}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-6 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Company Info */}
            <div className="bg-white rounded-2xl shadow p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Get in Touch</h2>
              <p className="text-gray-600 mb-6">
                Have questions about FlipFlop? We're here to help! Reach out to us through any of the channels below.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <MailIcon />
                  <div>
                    <div className="font-medium text-gray-800">Email</div>
                    <a href="mailto:support@flipflop.com" className="text-green-600 hover:text-green-700">
                      support@flipflop.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <PhoneIcon />
                  <div>
                    <div className="font-medium text-gray-800">Phone</div>
                    <a href="tel:+15551234567" className="text-green-600 hover:text-green-700">
                      (555) 123-FLIP
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <LocationIcon />
                  <div>
                    <div className="font-medium text-gray-800">Address</div>
                    <div className="text-gray-600">
                      123 Flipper Street<br />
                      Resale City, RC 12345<br />
                      United States
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <ClockIcon />
                  <div>
                    <div className="font-medium text-gray-800">Business Hours</div>
                    <div className="text-gray-600">
                      Monday - Friday: 9:00 AM - 6:00 PM EST<br />
                      Saturday: 10:00 AM - 4:00 PM EST<br />
                      Sunday: Closed
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Preview */}
            <div className="bg-white rounded-2xl shadow p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h3>
              <div className="space-y-3">
                <div>
                  <div className="font-medium text-gray-800">How do I get started?</div>
                  <div className="text-sm text-gray-600">Sign up for a free account and start searching for items to flip!</div>
                </div>
                <div>
                  <div className="font-medium text-gray-800">Is my data secure?</div>
                  <div className="text-sm text-gray-600">Yes, we use industry-standard encryption and security measures.</div>
                </div>
                <div>
                  <div className="font-medium text-gray-800">Can I cancel anytime?</div>
                  <div className="text-sm text-gray-600">Absolutely! You can cancel your subscription at any time.</div>
                </div>
              </div>
              <Link href="/faq" className="inline-block mt-4 text-green-600 hover:text-green-700 font-medium">
                View all FAQs →
              </Link>
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-2xl shadow p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-600 hover:text-blue-600 transition">
                  <span className="text-2xl">📘</span>
                </a>
                <a href="#" className="text-gray-600 hover:text-blue-400 transition">
                  <span className="text-2xl">🐦</span>
                </a>
                <a href="#" className="text-gray-600 hover:text-pink-600 transition">
                  <span className="text-2xl">📷</span>
                </a>
                <a href="#" className="text-gray-600 hover:text-blue-700 transition">
                  <span className="text-2xl">💼</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 