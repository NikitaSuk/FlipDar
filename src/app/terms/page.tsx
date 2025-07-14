"use client";
import Link from 'next/link';
import { useEffect } from 'react';

const DocumentIcon = () => <span className="inline-block w-5 h-5 mr-2 align-middle">📄</span>;
const CheckIcon = () => <span className="inline-block w-4 h-4 text-green-500">✓</span>;
const XIcon = () => <span className="inline-block w-4 h-4 text-red-500">✗</span>;

export default function TermsPage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <DocumentIcon />
            <h1 className="text-3xl font-bold text-gray-800 text-center">Terms of Service</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Please read these terms carefully before using FlipDar. By using our service, you agree to these terms.
          </p>
          <p className="text-sm text-gray-500 mt-2">Last updated: December 2024</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow p-8 space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              By accessing and using FlipDar ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
            <p className="text-gray-600 leading-relaxed">
              These Terms of Service ("Terms") govern your use of the FlipDar platform, including all features, content, and services available through our website and applications.
            </p>
          </section>

          {/* Service Description */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">2. Service Description</h2>
            <p className="text-gray-600 mb-4">
              FlipDar is a reselling analytics platform that provides:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Market price analysis and research tools</li>
              <li>Transaction tracking and profit calculation</li>
              <li>Search history and analytics</li>
              <li>User account management and data storage</li>
              <li>Integration with third-party marketplaces</li>
            </ul>
          </section>

          {/* User Accounts */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">3. User Accounts</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Account Creation</h3>
                <p className="text-gray-600 mb-3">To use certain features of our service, you must create an account. You agree to:</p>
                <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                  <li>Provide accurate, current, and complete information</li>
                  <li>Maintain and update your account information</li>
                  <li>Keep your password secure and confidential</li>
                  <li>Accept responsibility for all activities under your account</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Account Security</h3>
                <p className="text-gray-600">
                  You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. Notify us immediately of any unauthorized use.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Account Termination</h3>
                <p className="text-gray-600">
                  We reserve the right to terminate or suspend your account at any time for violations of these terms or for any other reason at our sole discretion.
                </p>
              </div>
            </div>
          </section>

          {/* Acceptable Use */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">4. Acceptable Use Policy</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">You May:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start space-x-2">
                    <CheckIcon />
                    <span className="text-gray-600">Use the service for legitimate reselling research</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckIcon />
                    <span className="text-gray-600">Track your own buying and selling transactions</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckIcon />
                    <span className="text-gray-600">Export your data for personal use</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckIcon />
                    <span className="text-gray-600">Contact support for legitimate issues</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">You May Not:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start space-x-2">
                    <XIcon />
                    <span className="text-gray-600">Use the service for illegal activities</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <XIcon />
                    <span className="text-gray-600">Attempt to reverse engineer our systems</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <XIcon />
                    <span className="text-gray-600">Share your account credentials with others</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <XIcon />
                    <span className="text-gray-600">Use automated tools to access our service</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <XIcon />
                    <span className="text-gray-600">Attempt to overload or crash our servers</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <XIcon />
                    <span className="text-gray-600">Violate any applicable laws or regulations</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Subscription and Payment */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Subscription and Payment</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Subscription Plans</h3>
                <p className="text-gray-600 mb-3">
                  We offer various subscription plans with different features and usage limits. All subscriptions are billed in advance on a recurring basis.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Payment Terms</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                  <li>All fees are non-refundable except as required by law</li>
                  <li>Prices may change with 30 days notice</li>
                  <li>Failed payments may result in service suspension</li>
                  <li>You authorize us to charge your payment method</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Cancellation</h3>
                <p className="text-gray-600">
                  You may cancel your subscription at any time. You'll continue to have access until the end of your current billing period. No refunds are provided for partial months.
                </p>
              </div>
            </div>
          </section>

          {/* Data and Privacy */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">6. Data and Privacy</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Data Collection</h3>
                <p className="text-gray-600">
                  We collect and process data as described in our Privacy Policy. By using our service, you consent to such collection and processing.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Data Ownership</h3>
                <p className="text-gray-600">
                  You retain ownership of your personal data. We process your data to provide our services and improve our platform.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Data Security</h3>
                <p className="text-gray-600">
                  We implement appropriate security measures to protect your data, but no system is completely secure. You are responsible for maintaining the security of your account.
                </p>
              </div>
            </div>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">7. Intellectual Property</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Our Rights</h3>
                <p className="text-gray-600">
                  The service and its original content, features, and functionality are owned by FlipDar and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Your Rights</h3>
                <p className="text-gray-600">
                  You retain ownership of any content you submit to our service. By submitting content, you grant us a license to use, store, and display that content in connection with providing our services.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Third-Party Content</h3>
                <p className="text-gray-600">
                  Our service may contain content from third parties, including market data from eBay and other sources. We are not responsible for the accuracy or completeness of such content.
                </p>
              </div>
            </div>
          </section>

          {/* Disclaimers and Limitations */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">8. Disclaimers and Limitations</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Service Availability</h3>
                <p className="text-gray-600">
                  We strive to maintain high availability but do not guarantee uninterrupted access. The service is provided "as is" without warranties of any kind.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Data Accuracy</h3>
                <p className="text-gray-600">
                  While we strive for accuracy, market data and analytics are estimates based on available information. We do not guarantee the accuracy, completeness, or timeliness of any data.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Limitation of Liability</h3>
                <p className="text-gray-600">
                  In no event shall FlipDar be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
                </p>
              </div>
            </div>
          </section>

          {/* Indemnification */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">9. Indemnification</h2>
            <p className="text-gray-600">
              You agree to defend, indemnify, and hold harmless FlipDar and its officers, directors, employees, and agents from and against any claims, damages, obligations, losses, liabilities, costs, or debt arising from your use of the service or violation of these terms.
            </p>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">10. Governing Law</h2>
            <p className="text-gray-600">
              These terms shall be governed by and construed in accordance with the laws of the jurisdiction in which FlipDar operates, without regard to its conflict of law provisions.
            </p>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">11. Changes to Terms</h2>
            <p className="text-gray-600">
              We reserve the right to modify these terms at any time. We will notify users of material changes via email or through our service. Your continued use of the service after such changes constitutes acceptance of the new terms.
            </p>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">12. Contact Information</h2>
            <p className="text-gray-600 mb-4">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="space-y-2 text-gray-600">
                <p><strong>Email:</strong> legal@flipdar.com</p>
                <p><strong>Address:</strong> FlipDar Inc., 123 Flipper Street, Resale City, RC 12345</p>
                <p><strong>Phone:</strong> (555) 123-FLIP</p>
              </div>
            </div>
          </section>
        </div>

        {/* Footer Links */}
        <div className="mt-8 text-center">
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link href="/privacy" className="text-green-600 hover:text-green-700">
              Privacy Policy
            </Link>
            <Link href="/contact" className="text-green-600 hover:text-green-700">
              Contact Us
            </Link>
            <Link href="/faq" className="text-green-600 hover:text-green-700">
              FAQ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 