import React from 'react'
import { Metadata } from 'next'
import Button from '@/app/components/ui/Button'
import { Check } from 'lucide-react'
import CTA from '../components/CTA'

export const metadata: Metadata = {
  title: 'TrendyMirror Pricing - Virtual Try-On Solutions and Plans',
  description: 'Explore TrendyMirror\'s flexible pricing plans for individuals and businesses. Find the perfect plan for your virtual try-on needs.',
  keywords: 'virtual try-on pricing, fashion tech pricing, virtual fitting room plans, e-commerce solution cost',
}

const pricingPlans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'For individuals who want to try virtual try-on technology',
    features: [
      'Up to 10 try-ons per month',
      'Basic virtual try-on features',
      'Standard model library access',
      'Email support',
    ],
    cta: {
      text: 'Get Started',
      href: '/auth/signup',
    },
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$49',
    period: 'per month',
    description: 'For small businesses and fashion bloggers',
    features: [
      'Unlimited try-ons',
      'Advanced visualization options',
      'Full model library access',
      'API access (1000 calls/day)',
      'Priority email support',
      'Basic analytics',
    ],
    cta: {
      text: 'Start 14-Day Trial',
      href: '/auth/signup?plan=pro',
    },
    highlighted: true,
  },
  {
    name: 'Business',
    price: '$199',
    period: 'per month',
    description: 'For established fashion retailers and e-commerce',
    features: [
      'Everything in Pro plan',
      'E-commerce integration',
      'Custom model library',
      'API access (unlimited)',
      'Advanced analytics dashboard',
      'Dedicated account manager',
      'Phone & email support',
    ],
    cta: {
      text: 'Contact Sales',
      href: '/landing/contact',
    },
    highlighted: false,
  },
]

export default function PricingPage() {
  return (
    <div className="pt-16">
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-gray-600">
              Choose the plan that's right for you or your business
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div 
                key={index}
                className={`rounded-xl overflow-hidden border ${
                  plan.highlighted 
                    ? 'border-blue-primary shadow-lg' 
                    : 'border-gray-200 shadow-sm'
                }`}
              >
                <div className={`p-8 ${plan.highlighted ? 'bg-blue-50' : 'bg-white'}`}>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h2>
                  <div className="flex items-baseline mb-2">
                    <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                    <span className="ml-1 text-gray-500">/{plan.period}</span>
                  </div>
                  <p className="text-gray-600 mb-6">
                    {plan.description}
                  </p>
                  
                  <Button 
                    href={plan.cta.href} 
                    variant={plan.highlighted ? 'gradient' : 'primary'} 
                    fullWidth
                  >
                    {plan.cta.text}
                  </Button>
                </div>
                
                <div className="p-8 bg-white border-t border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
                    What's included
                  </h3>
                  <ul className="space-y-4">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0 mr-2" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
          
          <div className="max-w-3xl mx-auto mt-16 p-8 border border-gray-200 rounded-xl bg-gray-50">
            <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">
              Need a custom solution?
            </h3>
            <p className="text-gray-600 text-center mb-6">
              Contact our sales team for a custom plan tailored to your specific requirements.
            </p>
            <div className="flex justify-center">
              <Button href="mailto:hello@trendymirror.com" variant="secondary">
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      <CTA 
        title="Ready to Experience TrendyMirror?"
        description="Start with our free plan today. No credit card required."
        primaryButtonText="Get Started"
        primaryButtonAction="signup"
        variant="dark"
      />
    </div>
  )
} 