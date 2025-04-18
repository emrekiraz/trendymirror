import React from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy - TrendyMirror',
  description: 'TrendyMirror privacy policy page outlining how we collect, use, and protect your personal information.',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
          <p className="text-gray-600 mb-4">Last Updated: June 15, 2023</p>
          
          <div className="prose prose-blue max-w-none">
            <h2 className="text-2xl font-semibold mt-8 mb-4">1. Introduction</h2>
            <p>
              Welcome to TrendyMirror ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our virtual try-on service.
            </p>
            <p>
              Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site or use our services.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">2. Information We Collect</h2>
            
            <h3 className="text-xl font-medium mt-6 mb-3">2.1 Personal Data</h3>
            <p>
              We may collect personal information that you voluntarily provide to us when you register on our platform, express interest in obtaining information about us or our products, or otherwise contact us. The personal information we collect may include:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Name and contact information (email address, phone number)</li>
              <li>Account credentials (username, password)</li>
              <li>Profile information (body measurements, preferences)</li>
              <li>Image data when using our virtual try-on features</li>
              <li>Payment and billing information</li>
              <li>User-generated content and feedback</li>
            </ul>
            
            <h3 className="text-xl font-medium mt-6 mb-3">2.2 Automatically Collected Information</h3>
            <p>
              When you access or use our services, we automatically collect certain information, including:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Device information (browser type, operating system, IP address)</li>
              <li>Usage data (pages visited, time spent)</li>
              <li>Location data (country, region)</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">3. How We Use Your Information</h2>
            <p>
              We use the information we collect for various purposes, including to:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and send related information</li>
              <li>Create and manage your account</li>
              <li>Generate personalized virtual try-on experiences</li>
              <li>Respond to inquiries and provide customer support</li>
              <li>Send marketing communications (with your consent)</li>
              <li>Monitor and analyze usage patterns and trends</li>
              <li>Detect, prevent, and address technical issues or fraudulent activities</li>
              <li>Comply with legal obligations</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">4. Data Sharing and Disclosure</h2>
            <p>
              We may share your information with:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Service providers who perform services on our behalf</li>
              <li>Business partners with whom we jointly offer products or services</li>
              <li>Affiliated companies within our corporate family</li>
              <li>Third parties in connection with a business transaction (e.g., merger, acquisition)</li>
              <li>Law enforcement or other authorities when required by law</li>
            </ul>
            <p>
              We will not sell your personal information to third parties for marketing purposes.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">5. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect the security of your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">6. Your Rights and Choices</h2>
            <p>
              Depending on your location, you may have certain rights regarding your personal information, including:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Access and receive a copy of your personal data</li>
              <li>Rectify inaccurate or incomplete information</li>
              <li>Request deletion of your personal data</li>
              <li>Restrict or object to processing of your data</li>
              <li>Data portability</li>
              <li>Withdraw consent</li>
            </ul>
            <p>
              To exercise these rights, please contact us at hello@trendymirror.com.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">7. Children's Privacy</h2>
            <p>
              Our services are not intended for individuals under the age of 16. We do not knowingly collect personal information from children. If we learn that we have collected personal information from a child, we will take steps to delete that information.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">8. International Data Transfers</h2>
            <p>
              Your information may be transferred to and processed in countries other than your country of residence. These countries may have different data protection laws. We will take appropriate measures to ensure that your personal information receives an adequate level of protection.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">9. Changes to This Privacy Policy</h2>
            <p>
              We may update this privacy policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the new privacy policy on our website and updating the "Last Updated" date.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">10. Contact Us</h2>
            <p>
              If you have any questions or concerns about this privacy policy or our privacy practices, please contact us at:
            </p>
            <p className="mb-2">Email: <a href="mailto:hello@trendymirror.com" className="text-blue-primary">hello@trendymirror.com</a></p>
            <p>Address: TrendyMirror Inc., 123 Fashion Avenue, New York, NY 10001, USA</p>
          </div>
        </div>
      </div>
    </div>
  )
} 