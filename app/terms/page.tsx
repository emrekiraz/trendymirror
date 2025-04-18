import React from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service - TrendyMirror',
  description: 'Terms and conditions that govern your use of the TrendyMirror virtual try-on platform.',
}

export default function TermsOfServicePage() {
  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms of Service</h1>
          <p className="text-gray-600 mb-4">Last Updated: June 15, 2023</p>
          
          <div className="prose prose-blue max-w-none">
            <h2 className="text-2xl font-semibold mt-8 mb-4">1. Agreement to Terms</h2>
            <p>
              These Terms of Service ("Terms") constitute a legally binding agreement between you and TrendyMirror Inc. ("Company," "we," "us," or "our") governing your access to and use of the TrendyMirror website, mobile application, and virtual try-on services (collectively, the "Service").
            </p>
            <p>
              By accessing or using our Service, you agree to be bound by these Terms. If you do not agree to these Terms, do not access or use the Service.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">2. Changes to Terms</h2>
            <p>
              We may revise these Terms at any time by posting an updated version on our website. Your continued use of the Service after the posting of revised Terms means that you accept and agree to the changes. You are expected to check this page frequently so you are aware of any changes.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">3. Eligibility</h2>
            <p>
              You must be at least 16 years old to use the Service. By using the Service, you represent and warrant that you meet the eligibility requirements and have the right, authority, and capacity to enter into these Terms.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">4. Account Registration</h2>
            <p>
              To access certain features of the Service, you may need to register for an account. When you register, you agree to:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and promptly update your account information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Accept responsibility for all activities that occur under your account</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
            </ul>
            <p>
              We reserve the right to suspend or terminate your account if you violate these Terms or if we determine that your account information is inaccurate.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">5. Subscription Services and Payments</h2>
            <h3 className="text-xl font-medium mt-6 mb-3">5.1 Subscription Plans</h3>
            <p>
              We offer both free and paid subscription plans. The specific features and limitations of each plan are described on our website. We reserve the right to modify, terminate, or otherwise amend our offered subscription plans.
            </p>
            
            <h3 className="text-xl font-medium mt-6 mb-3">5.2 Free Trial</h3>
            <p>
              We may offer a free trial period for our paid subscription plans. At the end of the trial period, you will be automatically charged the applicable subscription fee unless you cancel your subscription prior to the end of the trial period.
            </p>
            
            <h3 className="text-xl font-medium mt-6 mb-3">5.3 Payments and Billing</h3>
            <p>
              You agree to pay all fees and charges associated with your subscription plan according to the pricing and billing terms in effect at the time a fee or charge is due. Payment must be made by the methods specified, and you authorize us to charge your chosen payment provider.
            </p>
            
            <h3 className="text-xl font-medium mt-6 mb-3">5.4 Subscription Term and Renewal</h3>
            <p>
              Subscriptions automatically renew for the same term unless you cancel your subscription before the renewal date. You may cancel your subscription at any time through your account settings or by contacting our customer support.
            </p>
            
            <h3 className="text-xl font-medium mt-6 mb-3">5.5 Refunds</h3>
            <p>
              All payments are non-refundable except where required by law. We may provide refunds at our sole discretion.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">6. Intellectual Property Rights</h2>
            <h3 className="text-xl font-medium mt-6 mb-3">6.1 Our Intellectual Property</h3>
            <p>
              The Service and its content, features, and functionality are owned by TrendyMirror Inc. and are protected by copyright, trademark, patent, trade secret, and other intellectual property laws. You agree not to copy, modify, create derivative works, publicly display, publicly perform, republish, or transmit any of the material obtained through the Service without our prior written consent.
            </p>
            
            <h3 className="text-xl font-medium mt-6 mb-3">6.2 Your Content</h3>
            <p>
              By uploading, posting, or submitting content to the Service (including photos, images, and user feedback), you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, translate, distribute, and display such content in connection with providing and promoting the Service.
            </p>
            <p>
              You represent and warrant that you own or have the necessary rights to the content you submit and that the content does not violate the rights of any third party.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">7. Prohibited Activities</h2>
            <p>
              You agree not to engage in any of the following prohibited activities:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Use the Service for any illegal purpose or in violation of any local, state, national, or international law</li>
              <li>Violate or encourage others to violate the rights of third parties, including intellectual property rights</li>
              <li>Upload or transmit viruses, malware, or other types of malicious software</li>
              <li>Attempt to gain unauthorized access to, interfere with, damage, or disrupt the Service or our servers</li>
              <li>Use automated means or processes to access or use the Service without our express permission</li>
              <li>Engage in any activity that could disable, overburden, or impair the proper working of the Service</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">8. Disclaimer of Warranties</h2>
            <p>
              THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED OR ERROR-FREE, THAT DEFECTS WILL BE CORRECTED, OR THAT THE SERVICE IS FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">9. Limitation of Liability</h2>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL TRENDYMIRROR INC., ITS DIRECTORS, EMPLOYEES, PARTNERS, AGENTS, SUPPLIERS, OR AFFILIATES BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE SERVICE.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">10. Indemnification</h2>
            <p>
              You agree to defend, indemnify, and hold harmless TrendyMirror Inc., its officers, directors, employees, and agents, from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising out of or relating to your violation of these Terms or your use of the Service.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">11. Termination</h2>
            <p>
              We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason, including without limitation if you breach these Terms. Upon termination, your right to use the Service will cease immediately.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">12. Governing Law and Dispute Resolution</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the State of New York, without regard to its conflict of law provisions. Any dispute arising from or relating to these Terms or your use of the Service shall be resolved exclusively in the state or federal courts located in New York County, New York.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">13. Entire Agreement</h2>
            <p>
              These Terms, together with our Privacy Policy, constitute the entire agreement between you and TrendyMirror Inc. regarding the Service and supersede all prior agreements and understandings, whether written or oral.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">14. Contact Information</h2>
            <p>
              If you have any questions about these Terms, please contact us at:
            </p>
            <p className="mb-2">Email: <a href="mailto:hello@trendymirror.com" className="text-blue-primary">hello@trendymirror.com</a></p>
            <p>Address: TrendyMirror Inc., 123 Fashion Avenue, New York, NY 10001, USA</p>
          </div>
        </div>
      </div>
    </div>
  )
} 