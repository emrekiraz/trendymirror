'use client'

import React, { useState } from 'react'
import Button from '@/app/components/ui/Button'
import { Check, X } from 'lucide-react'
import CTA from '../../landing/components/CTA'
import useAuthModal from '@/app/hooks/useAuthModal'

const individualPlans = [
  {
    name: 'Basic',
    price: '$19.99',
    yearlyPrice: '$119.99',
    discountedPrice: '$9.99',
    period: 'monthly',
    yearlyPeriod: 'annually',
    description: 'Perfect for casual users who need basic try-ons',
    features: [
      'No AI Model Creation',
      '30 Try-Ons',
      '5 Model Uploads',
      '10 TrendyMirror Models',
      '30-Day Saved Generation History',
      'No Shareable Public Links',
      'Ticket-Based Support',
      'No Early Access to New Features'
    ],
    cta: {
      text: 'Get Basic Plan',
      href: '/auth/signup?plan=basic',
    },
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$39.99',
    yearlyPrice: '$239.99',
    discountedPrice: '$19.99',
    period: 'monthly',
    yearlyPeriod: 'annually',
    description: 'Everything you need for professional try-ons',
    features: [
      '10 AI Model Creations',
      '100 Try-Ons',
      '30 Model Uploads',
      'Access to All TrendyMirror Models',
      '60-Day Saved Generation History',
      'Shareable Public Links',
      'Priority Support',
      'Early Access to New Features'
    ],
    cta: {
      text: 'Get Pro Plan',
      href: '/auth/signup?plan=pro',
    },
    highlighted: true,
  },
]

const businessPlans = [
  {
    name: 'Team',
    price: '$49.99',
    yearlyPrice: '$299.95',
    discountedPrice: '$24.95',
    period: 'monthly/seat',
    yearlyPeriod: 'annually/seat',
    description: 'Perfect for small teams and businesses',
    features: [
      '20 AI Model Creations per member',
      '150 Try-Ons per member',
      '50 Model Uploads per member',
      'Access to All TrendyMirror Models',
      '90-Day Saved Generation History',
      'Shareable Public Links',
      'Priority Support',
      'Early Access to New Features',
      'Team Collaboration Features',
      'Shared Asset Library'
    ],
    cta: {
      text: 'Get Team Plan',
      href: '/auth/signup?plan=team',
    },
    highlighted: false,
  },
  {
    name: 'Enterprise',
    description: 'Custom',
    price: 'Custom',
    features: [
      'Custom AI Model Creations',
      'Custom Try-Ons',
      'Custom Model Uploads',
      'Access to All TrendyMirror Models',
      'Custom Saved Generation History',
      'Shareable Public Links',
      'Premium Support',
      'Early Access to New Features',
      'Custom Features',
      'Advanced Security and Compliance Controls',
      'Training and Onboarding'
    ],
    cta: {
      text: 'Contact Sales',
      href: '/home/business#calendar-section',
    },
    highlighted: false,
  }
]

const featureCategories = [
  {
    name: 'Core Features',
    features: [
      {
        name: 'AI Model Creation',
        values: ['No', '10', '20 per member', 'Custom'],
      },
      {
        name: 'Try-Ons Per Month',
        values: ['30', '100', '150 per member', 'Custom'],
      },
      {
        name: 'Model Uploads',
        values: ['5', '30', '50 per member', 'Custom'],
      },
      {
        name: 'TrendyMirror Models',
        values: ['10', 'All', 'All', 'All'],
      },
      {
        name: 'Saved Generation History',
        values: ['30-Day', '60-Day', '90-Day', 'Custom'],
      },
    ],
  },
  {
    name: 'Platform Features',
    features: [
      {
        name: 'Shareable Public Links',
        values: ['No', 'Yes', 'Yes', 'Yes'],
      },
      {
        name: 'Team Collaboration Features',
        values: ['No', 'No', 'Yes', 'Yes'],
      },
      {
        name: 'Shared Asset Library',
        values: ['No', 'No', 'Yes', 'Yes'],
      },
      {
        name: 'Advanced Security Controls',
        values: ['No', 'No', 'No', 'Yes'],
      },
    ],
  },
  {
    name: 'Support',
    features: [
      {
        name: 'Support Type',
        values: ['Ticket-Based', 'Priority', 'Priority', 'Premium'],
      },
      {
        name: 'Early Access to New Features',
        values: ['No', 'Yes', 'Yes', 'Yes'],
      },
      {
        name: 'Training and Onboarding',
        values: ['No', 'No', 'No', 'Yes'],
      },
    ],
  },
]

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState('yearly')
  const { openSignupModal } = useAuthModal()

  const handlePlanSelection = (plan: string) => {
    // This would ideally store the selected plan in state or context
    // before opening the signup modal
    console.log(`Selected plan: ${plan}`)
    openSignupModal()
  }

  return (
    <div className="pt-16">
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              Pricing Plans
            </h1>
            <p className="text-xl text-gray-600">
              Choose the perfect plan for your needs. Upgrade or downgrade at any time.
            </p>
            <div className="flex justify-center mt-6">
              <div className="inline-flex items-center p-2 bg-gray-100 rounded-full">
                <span className={`mr-3 text-sm font-medium ${billingPeriod === 'monthly' ? 'text-blue-primary' : 'text-gray-500'}`}>Monthly</span>
                <button 
                  onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
                  className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out bg-blue-500 focus:outline-none"
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    billingPeriod === 'yearly' ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
                <span className={`ml-3 text-sm font-medium ${billingPeriod === 'yearly' ? 'text-blue-primary' : 'text-gray-500'}`}>Yearly</span>
                <span className="ml-2 text-xs bg-green-100 text-green-800 font-bold px-2 py-1 rounded-full">
                  Save 50%
                </span>
              </div>
            </div>
          </div>
          
          {/* Individual Plans */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-center mb-8">Individual Plans</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {individualPlans.map((plan, index) => (
                <div 
                  key={index}
                  className={`rounded-xl overflow-hidden border ${
                    plan.highlighted 
                      ? 'border-blue-primary shadow-lg' 
                      : 'border-gray-200 shadow-sm'
                  }`}
                >
                  <div className={`p-8 ${plan.highlighted ? 'bg-blue-50' : 'bg-white'} relative`}>
                    {plan.highlighted && (
                      <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-2 bg-blue-primary text-white font-bold px-3 py-1 rounded-full shadow-md z-10">
                        Most Popular
                      </div>
                    )}
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {plan.name}
                    </h2>
                    <div className="mb-4">
                      <div className="text-sm text-gray-600 mb-1">
                        <s>{plan.price}/{plan.period}</s>
                      </div>
                      <div className="flex items-baseline">
                        <span className="text-4xl font-extrabold text-gray-900">
                          {billingPeriod === 'monthly' ? plan.price : plan.discountedPrice}
                        </span>
                        <span className="ml-1 text-gray-500">/{plan.period}</span>
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {billingPeriod === 'yearly' && `billed ${plan.yearlyPrice} ${plan.yearlyPeriod}`}
                      </div>
                    </div>
                    <p className="text-gray-600 mb-6">
                      {plan.description}
                    </p>
                    
                    <Button 
                      onClick={() => handlePlanSelection(plan.name)} 
                      variant={plan.highlighted ? 'gradient' : 'primary'} 
                      fullWidth
                      className="inline-flex items-center justify-center mb-6"
                    >
                      {plan.cta.text}
                    </Button>
                    
                    <div className="space-y-3">
                      <p className="font-medium text-gray-900">What's included:</p>
                      {plan.features.map((feature, i) => (
                        <div key={i} className="flex items-start">
                          {feature.startsWith('No ') ? (
                            <>
                              <X className="h-5 w-5 text-gray-300 mr-2 flex-shrink-0" />
                              <p className="text-sm text-gray-700">{feature.substring(3)}</p>
                            </>
                          ) : (
                            <>
                              <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                              <p className="text-sm text-gray-700">{feature}</p>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Business Plans */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-center mb-8">Business Plans</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {businessPlans.map((plan, index) => (
                <div 
                  key={index}
                  className="rounded-xl overflow-hidden border border-gray-200 shadow-sm"
                >
                  <div className="p-8 bg-white">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {plan.name}
                    </h2>
                    <div className="mb-4">
                      {plan.name === 'Team' ? (
                        <>
                          <div className="text-sm text-gray-600 mb-1">
                            <s>{plan.price}/{plan.period}</s>
                          </div>
                          <div className="flex items-baseline">
                            <span className="text-4xl font-extrabold text-gray-900">
                              {billingPeriod === 'monthly' ? plan.price : plan.discountedPrice}
                            </span>
                            <span className="ml-1 text-gray-500">/{plan.period}</span>
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            {billingPeriod === 'yearly' && `billed ${plan.yearlyPrice} ${plan.yearlyPeriod}`}
                          </div>
                        </>
                      ) : (
                        <div className="flex items-baseline mb-4">
                          <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-gray-600 mb-6">
                      {plan.description}
                    </p>
                    
                    <Button 
                      href={plan.name === 'Enterprise' ? plan.cta.href : undefined}
                      onClick={plan.name === 'Enterprise' ? undefined : () => handlePlanSelection(plan.name)} 
                      variant={plan.name === 'Enterprise' ? 'gradient' : 'primary'} 
                      fullWidth
                      className="inline-flex items-center justify-center mb-6"
                    >
                      {plan.cta.text}
                    </Button>
                    
                    <div className="space-y-3">
                      <p className="font-medium text-gray-900">What's included:</p>
                      {plan.features.map((feature, i) => (
                        <div key={i} className="flex items-start">
                          {feature.startsWith('No ') ? (
                            <>
                              <X className="h-5 w-5 text-gray-300 mr-2 flex-shrink-0" />
                              <p className="text-sm text-gray-700">{feature.substring(3)}</p>
                            </>
                          ) : (
                            <>
                              <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                              <p className="text-sm text-gray-700">{feature}</p>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Feature comparison table */}
          <div className="max-w-7xl mx-auto overflow-hidden border border-gray-200 rounded-xl shadow-sm mb-16">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider w-1/4">
                      Features
                    </th>
                    {individualPlans.map((plan, index) => (
                      <th key={index} scope="col" className="px-6 py-4 text-center text-sm font-medium text-gray-500 uppercase tracking-wider">
                        {plan.name}
                      </th>
                    ))}
                    {businessPlans.map((plan, index) => (
                      <th key={`business-${index}`} scope="col" className="px-6 py-4 text-center text-sm font-medium text-gray-500 uppercase tracking-wider">
                        {plan.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {featureCategories.map((category, categoryIndex) => (
                    <React.Fragment key={categoryIndex}>
                      <tr className="bg-gray-50">
                        <td colSpan={5} className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                          {category.name}
                        </td>
                      </tr>
                      
                      {category.features.map((feature, featureIndex) => (
                        <tr key={`${categoryIndex}-${featureIndex}`} className={featureIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            {feature.name}
                          </td>
                          
                          {feature.values.map((value, valueIndex) => (
                            <td key={valueIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">
                              {value === 'Yes' ? (
                                <div className="flex justify-center">
                                  <Check className="h-5 w-5 text-green-500" />
                                </div>
                              ) : value === 'No' ? (
                                <div className="flex justify-center">
                                  <X className="h-5 w-5 text-gray-300" />
                                </div>
                              ) : (
                                <span>{value}</span>
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="max-w-3xl mx-auto mt-16 p-8 border border-gray-200 rounded-xl bg-gray-50">
            <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">
              Need a custom solution?
            </h3>
            <p className="text-gray-600 text-center mb-6">
              Contact our sales team for a custom plan tailored to your specific requirements.
            </p>
            <div className="flex justify-center">
              <Button href="mailto:hello@trendymirror.com" variant="secondary" className="inline-flex items-center justify-center">
                Contact Sales
              </Button>
            </div>
          </div>
          
          {/* FAQ Section */}
          <div className="max-w-3xl mx-auto mt-16 p-8 border border-gray-200 rounded-xl bg-white">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Frequently Asked Questions
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">How do the try-on credits work?</h4>
                <p className="text-gray-600">
                  Each plan comes with a specific number of try-on credits per month. One try-on equals one generated image. Unused credits do not roll over to the next month.
                </p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Can I upgrade or downgrade my plan?</h4>
                <p className="text-gray-600">
                  Yes, you can change your plan at any time. If you upgrade, you'll be charged the prorated amount for the remainder of the billing cycle. If you downgrade, the new plan will take effect at the start of the next billing cycle.
                </p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">What payment methods do you accept?</h4>
                <p className="text-gray-600">
                  We accept all major credit cards, including Visa, Mastercard, American Express, and Discover. We also support PayPal for select countries.
                </p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Is there a refund policy?</h4>
                <p className="text-gray-600">
                  Yes, we offer a 14-day money-back guarantee for all paid plans. If you're not satisfied with our service, you can request a full refund within 14 days of your purchase.
                </p>
              </div>
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