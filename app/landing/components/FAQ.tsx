'use client'

import React, { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

const faqs = [
  {
    question: 'How accurate is the virtual try-on technology?',
    answer: 'TrendyMirror uses advanced AI algorithms to provide highly accurate virtual try-on results. Our technology considers body shape, fabric properties, and lighting to create realistic visualizations. While no virtual try-on is 100% perfect, our users consistently rate our accuracy as excellent, with many reporting that the virtual results closely match their actual experience with the garments.'
  },
  {
    question: 'Can I use my own photo for virtual try-on?',
    answer: 'Yes! You can upload your own photo to see how clothes will look specifically on you. We recommend using a well-lit, front-facing photo against a simple background for best results. Alternatively, you can choose from our diverse library of models if you prefer not to use your own image.'
  },
  {
    question: 'How do I integrate TrendyMirror with my e-commerce store?',
    answer: 'TrendyMirror offers seamless integration with major e-commerce platforms including Shopify, WooCommerce, Magento, and custom solutions. Our team provides comprehensive documentation and support throughout the integration process. We offer both API integration and plug-and-play options depending on your technical requirements.'
  },
  {
    question: 'Is my data secure when using TrendyMirror?',
    answer: 'Absolutely. We take data privacy and security very seriously. All images and personal data are encrypted both in transit and at rest. We never share your data with third parties without explicit consent, and you can request deletion of your data at any time. Our systems comply with GDPR, CCPA, and other relevant data protection regulations.'
  },
  {
    question: 'What pricing plans do you offer?',
    answer: 'TrendyMirror offers flexible pricing plans to suit businesses of all sizes. We have a free tier for individual users, and business plans starting from $49/month. Enterprise plans with custom features and dedicated support are also available. Visit our pricing page for detailed information on all plans and features.'
  },
  {
    question: 'How long does it take to generate a virtual try-on?',
    answer: 'Most virtual try-ons are generated within seconds. For complex garments or high-resolution images, it may take up to 10-15 seconds. Our technology is optimized for speed without compromising quality, ensuring a smooth user experience even during peak traffic periods.'
  },
  {
    question: 'Do you offer a free trial for businesses?',
    answer: 'Yes, we offer a 14-day free trial for all our business plans. During the trial, you\'ll have access to all features included in your selected plan. No credit card is required to start your trial, and you can upgrade, downgrade, or cancel at any time.'
  },
  {
    question: 'What types of clothing can be used with TrendyMirror?',
    answer: 'TrendyMirror supports a wide range of clothing items including tops, dresses, pants, skirts, outerwear, and accessories. Our technology works best with clearly photographed items against a white or transparent background. We\'re constantly expanding our capabilities to include more complex items like layered outfits and accessories.'
  }
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-gray-900">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Find answers to common questions about TrendyMirror
          </p>
        </div>

        <div className="max-w-3xl mx-auto divide-y divide-gray-200">
          {faqs.map((faq, index) => (
            <div key={index} className="py-6">
              <button
                onClick={() => toggleFAQ(index)}
                className="flex justify-between items-center w-full text-left focus:outline-none"
              >
                <h3 className="text-lg font-semibold text-gray-900">
                  {faq.question}
                </h3>
                <span className="ml-6 flex-shrink-0 text-blue-primary">
                  {openIndex === index ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </span>
              </button>
              {openIndex === index && (
                <div className="mt-3 pr-12">
                  <p className="text-base text-gray-600">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600">
            Still have questions? We're here to help.
          </p>
          <a
            href="mailto:hello@trendymirror.com"
            className="mt-4 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-primary hover:bg-blue-600"
          >
            Contact Support
          </a>
        </div>
      </div>
    </section>
  )
} 