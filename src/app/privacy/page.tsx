"use client";
import Link from 'next/link';

const ShieldIcon = () => <span className="inline-block w-5 h-5 mr-2 align-middle">🛡️</span>;
const LockIcon = () => <span className="inline-block w-5 h-5 mr-2 align-middle">🔒</span>;
const EyeIcon = () => <span className="inline-block w-5 h-5 mr-2 align-middle">👁️</span>;

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <ShieldIcon />
            <h1 className="text-3xl font-bold text-gray-800">Privacy Policy</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your privacy is important to us. This policy explains how we collect, use, and protect your information.
          </p>
          <p className="text-sm text-gray-500 mt-2">Last updated: December 2024</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow p-8 space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Introduction</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              FlipDar ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our reselling analytics platform and related services.
            </p>
            <p className="text-gray-600 leading-relaxed">
              By using FlipDar, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our service.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Information We Collect</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Personal Information</h3>
                <p className="text-gray-600 mb-3">We may collect the following personal information:</p>
                <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                  <li>Email address and password for account creation</li>
                  <li>Name and contact information</li>
                  <li>Payment information (processed securely by our payment partners)</li>
                  <li>Profile information and preferences</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Usage Information</h3>
                <p className="text-gray-600 mb-3">We automatically collect certain information about your use of our service:</p>
                <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                  <li>Search queries and browsing history</li>
                  <li>Transaction data you choose to log</li>
                  <li>Device information and IP address</li>
                  <li>Usage patterns and feature interactions</li>
                  <li>Error logs and performance data</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Third-Party Data</h3>
                <p className="text-gray-600 mb-3">We may collect data from third-party sources:</p>
                <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                  <li>eBay market data for price analysis</li>
                  <li>Analytics services for service improvement</li>
                  <li>Payment processors for subscription management</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Information */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">How We Use Your Information</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Service Provision</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                  <li>Provide and maintain our reselling analytics platform</li>
                  <li>Process your searches and generate market insights</li>
                  <li>Track your transactions and calculate profits</li>
                  <li>Manage your account and subscription</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Communication</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                  <li>Send important service updates and notifications</li>
                  <li>Respond to your support requests and inquiries</li>
                  <li>Send marketing communications (with your consent)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Improvement</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                  <li>Analyze usage patterns to improve our service</li>
                  <li>Develop new features and functionality</li>
                  <li>Ensure security and prevent fraud</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Information Sharing */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Information Sharing and Disclosure</h2>
            
            <p className="text-gray-600 mb-4">
              We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except in the following circumstances:
            </p>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Service Providers</h3>
                <p className="text-gray-600">
                  We may share information with trusted third-party service providers who assist us in operating our platform, such as hosting providers, payment processors, and analytics services.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Legal Requirements</h3>
                <p className="text-gray-600">
                  We may disclose your information if required by law or in response to valid legal requests, such as subpoenas or court orders.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Business Transfers</h3>
                <p className="text-gray-600">
                  In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of the business transaction.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Aggregated Data</h3>
                <p className="text-gray-600">
                  We may share anonymized, aggregated data that does not identify individual users for research, analytics, or business purposes.
                </p>
              </div>
            </div>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Data Security</h2>
            
            <p className="text-gray-600 mb-4">
              We implement appropriate technical and organizational measures to protect your personal information:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <LockIcon />
                  <h3 className="font-semibold text-gray-800">Encryption</h3>
                </div>
                <p className="text-sm text-gray-600">
                  All data is encrypted in transit and at rest using industry-standard encryption protocols.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <ShieldIcon />
                  <h3 className="font-semibold text-gray-800">Access Controls</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Strict access controls and authentication measures protect your data from unauthorized access.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <EyeIcon />
                  <h3 className="font-semibold text-gray-800">Regular Audits</h3>
                </div>
                <p className="text-sm text-gray-600">
                  We conduct regular security audits and assessments to maintain data protection standards.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <ShieldIcon />
                  <h3 className="font-semibold text-gray-800">Employee Training</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Our team receives regular training on data protection and privacy best practices.
                </p>
              </div>
            </div>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Rights and Choices</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Access and Control</h3>
                <p className="text-gray-600 mb-3">You have the right to:</p>
                <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                  <li>Access and review your personal information</li>
                  <li>Update or correct inaccurate information</li>
                  <li>Request deletion of your account and data</li>
                  <li>Export your data in a portable format</li>
                  <li>Opt out of marketing communications</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Cookies and Tracking</h3>
                <p className="text-gray-600">
                  We use cookies and similar technologies to enhance your experience. You can control cookie settings through your browser preferences.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Data Retention</h3>
                <p className="text-gray-600">
                  We retain your information for as long as necessary to provide our services and comply with legal obligations. You can request deletion of your data at any time.
                </p>
              </div>
            </div>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Children's Privacy</h2>
            <p className="text-gray-600">
              Our service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.
            </p>
          </section>

          {/* International Transfers */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">International Data Transfers</h2>
            <p className="text-gray-600">
              Your information may be transferred to and processed in countries other than your own. We ensure that such transfers comply with applicable data protection laws and implement appropriate safeguards to protect your information.
            </p>
          </section>

          {/* Changes to Policy */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Changes to This Privacy Policy</h2>
            <p className="text-gray-600">
              We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date. Your continued use of our service after such changes constitutes acceptance of the updated policy.
            </p>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Contact Us</h2>
            <p className="text-gray-600 mb-4">
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="space-y-2 text-gray-600">
                <p><strong>Email:</strong> privacy@flipdar.com</p>
                <p><strong>Address:</strong> FlipDar Inc., 123 Flipper Street, Resale City, RC 12345</p>
                <p><strong>Phone:</strong> (555) 123-FLIP</p>
              </div>
            </div>
          </section>
        </div>

        {/* Footer Links */}
        <div className="mt-8 text-center">
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link href="/terms" className="text-green-600 hover:text-green-700">
              Terms of Service
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