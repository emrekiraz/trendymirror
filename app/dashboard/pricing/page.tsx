'use client'

import { useState, useEffect } from 'react'
import { CheckIcon, UserGroupIcon, BuildingOfficeIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { Heading, Text } from '@/app/components/ui/Typography'
import Button from '@/app/components/ui/Button'
import Card from '@/app/components/ui/Card'
import Badge from '@/app/components/ui/Badge'

interface PricingPlan {
  name: string
  price: string | number | ((members?: number) => string | number)
  description: string
  features: string[]
  notIncluded?: string[]
  buttonText: string
  popular?: boolean
  color: string
  type?: 'individual' | 'business'
  isTeam?: boolean
  disabled?: boolean
}

// Global variables to persist timer state
const TIMER_KEY = 'discount_timer_end';
const DISCOUNT_KEY = 'discount_active';
const DISCOUNT_SHOWN_KEY = 'discount_popup_shown';

// Countdown timer component
const CountdownTimer = ({ minutes, onComplete }: { minutes: number, onComplete: () => void }) => {
  const [timeRemaining, setTimeRemaining] = useState<{seconds: number, milliseconds: number}>(() => {
    // Check if there's a saved end time in localStorage
    const savedEndTime = localStorage.getItem(TIMER_KEY);
    if (savedEndTime) {
      const endTime = parseInt(savedEndTime);
      const now = new Date().getTime();
      const remainingMs = Math.max(0, endTime - now);
      return {
        seconds: Math.floor(remainingMs / 1000),
        milliseconds: Math.floor((remainingMs % 1000) / 10)
      };
    }
    return {
      seconds: minutes * 60,
      milliseconds: 0
    };
  });
  
  useEffect(() => {
    // If this is a new timer, set the end time in localStorage
    if (timeRemaining.seconds === minutes * 60 && timeRemaining.milliseconds === 0) {
      const endTime = new Date().getTime() + (minutes * 60 * 1000);
      localStorage.setItem(TIMER_KEY, endTime.toString());
    }
    
    if (timeRemaining.seconds <= 0 && timeRemaining.milliseconds <= 0) {
      localStorage.removeItem(TIMER_KEY);
      localStorage.setItem(DISCOUNT_KEY, 'false');
      onComplete();
      return;
    }
    
    const timer = setInterval(() => {
      // Calculate remaining time based on the end time in localStorage
      const savedEndTime = localStorage.getItem(TIMER_KEY);
      if (savedEndTime) {
        const endTime = parseInt(savedEndTime);
        const now = new Date().getTime();
        const remainingMs = Math.max(0, endTime - now);
        
        if (remainingMs <= 0) {
          localStorage.removeItem(TIMER_KEY);
          localStorage.setItem(DISCOUNT_KEY, 'false');
          onComplete();
          clearInterval(timer);
        } else {
          setTimeRemaining({
            seconds: Math.floor(remainingMs / 1000),
            milliseconds: Math.floor((remainingMs % 1000) / 10)
          });
        }
      } else {
        // Fallback for when localStorage isn't available
        setTimeRemaining(prev => {
          if (prev.milliseconds > 0) {
            return { ...prev, milliseconds: prev.milliseconds - 1 };
          } else if (prev.seconds > 0) {
            return { seconds: prev.seconds - 1, milliseconds: 99 };
          } else {
            return { seconds: 0, milliseconds: 0 };
          }
        });
      }
    }, 10); // Update every 10ms for smooth millisecond display
    
    return () => clearInterval(timer);
  }, [timeRemaining.seconds, timeRemaining.milliseconds, minutes, onComplete]);
  
  const formatTime = () => {
    const mins = Math.floor(timeRemaining.seconds / 60);
    const secs = timeRemaining.seconds % 60;
    const ms = timeRemaining.milliseconds;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}:${ms.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="text-center">
      <div className="text-4xl font-bold bg-blue-100 text-blue-800 inline-block px-6 py-3 rounded-lg">
        {formatTime()}
      </div>
      <p className="mt-2 text-gray-600">This offer expires soon!</p>
    </div>
  );
};

// Discount page component
const DiscountPage = ({ onClose, selectedPlan, setSelectedPlan }: { 
  onClose: () => void, 
  selectedPlan: string, 
  setSelectedPlan: (plan: string) => void 
}) => {
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-8 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 transition-colors"
          aria-label="Close"
        >
          <XMarkIcon className="h-6 w-6 text-gray-700" />
        </button>
        
        <div className="text-center mb-8">
          <CountdownTimer minutes={5} onComplete={onClose} />
          
          <div className="my-8">
            <div className="text-6xl font-extrabold text-blue-primary">
              50% OFF
            </div>
            <div className="text-2xl mt-2 font-bold text-gray-700">
              SPECIAL OFFER
            </div>
          </div>
          
          <Text className="mb-6">
            Subscribe now and get an additional 50% discount on any plan! This exclusive offer is only available for the next 5 minutes.
          </Text>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div 
              className={`p-4 rounded-lg cursor-pointer transition-all ${selectedPlan === 'Basic' 
                ? 'bg-blue-50 border-2 border-blue-primary' 
                : 'bg-gray-50 hover:bg-gray-100'}`}
              onClick={() => setSelectedPlan('Basic')}
            >
              <div className="text-lg font-bold">Basic</div>
              <div className="text-sm text-gray-500 mb-1"><s>$9.99/mo</s></div>
              <div className="text-xl font-bold text-blue-primary">$4.99/mo</div>
              <div className="text-sm text-gray-500">billed annually</div>
            </div>
            <div 
              className={`p-4 rounded-lg cursor-pointer transition-all ${selectedPlan === 'Pro' 
                ? 'bg-blue-50 border-2 border-blue-primary' 
                : 'bg-gray-50 hover:bg-gray-100'}`}
              onClick={() => setSelectedPlan('Pro')}
            >
              <div className="text-lg font-bold">Pro</div>
              <div className="text-sm text-gray-500 mb-1"><s>$19.99/mo</s></div>
              <div className="text-xl font-bold text-blue-primary">$9.99/mo</div>
              <div className="text-sm text-gray-500">billed annually</div>
            </div>
            <div 
              className={`p-4 rounded-lg cursor-pointer transition-all ${selectedPlan === 'Team' 
                ? 'bg-blue-50 border-2 border-blue-primary' 
                : 'bg-gray-50 hover:bg-gray-100'}`}
              onClick={() => setSelectedPlan('Team')}
            >
              <div className="text-lg font-bold">Team</div>
              <div className="text-sm text-gray-500 mb-1"><s>$24.95/mo/seat</s></div>
              <div className="text-xl font-bold text-blue-primary">$12.49/mo/seat</div>
              <div className="text-sm text-gray-500">billed annually</div>
            </div>
          </div>
          
          <Button
            variant="primary"
            size="lg"
            className="w-full px-8"
            onClick={() => {
              toast.success(`Redirecting to checkout for ${selectedPlan} plan with 50% discount...`);
              setTimeout(() => onClose(), 2000);
            }}
          >
            Get This Deal Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default function PricingPage() {
  const router = useRouter()
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('yearly')
  const [teamMembers, setTeamMembers] = useState(5)
  const [showDiscount, setShowDiscount] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState('Pro')
  const [showCountdown, setShowCountdown] = useState(false)
  const [discountActive, setDiscountActive] = useState(false)
  const [discountPopupShown, setDiscountPopupShown] = useState(false)
  
  // Check for existing discount on component mount
  useEffect(() => {
    const savedEndTime = localStorage.getItem(TIMER_KEY);
    const savedDiscountActive = localStorage.getItem(DISCOUNT_KEY);
    const savedDiscountShown = localStorage.getItem(DISCOUNT_SHOWN_KEY);
    
    // Set discount popup shown state
    setDiscountPopupShown(savedDiscountShown === 'true');
    
    if (savedEndTime) {
      const endTime = parseInt(savedEndTime);
      const now = new Date().getTime();
      
      if (now < endTime) {
        setShowCountdown(true);
        setDiscountActive(true);
        localStorage.setItem(DISCOUNT_KEY, 'true');
      } else {
        localStorage.removeItem(TIMER_KEY);
        localStorage.setItem(DISCOUNT_KEY, 'false');
        setDiscountActive(false);
        setShowCountdown(false);
      }
    }
    
    if (savedDiscountActive === 'true') {
      setDiscountActive(true);
      setShowCountdown(true);
    }
  }, []);
  
  // Calculate prices based on billing period and discount
  const getMonthlyPrice = (baseMonthlyPrice: number) => {
    if (billingPeriod === 'yearly') {
      return baseMonthlyPrice / 2; // 50% off for yearly
    }
    return baseMonthlyPrice;
  }
  
  const getYearlyPrice = (baseMonthlyPrice: number) => {
    const yearlyPrice = baseMonthlyPrice * 12 * 0.5; // 50% off for yearly
    return discountActive ? yearlyPrice * 0.5 : yearlyPrice; // Additional 50% if discount is active
  }
  
  const getDiscountedMonthlyPrice = (baseMonthlyPrice: number) => {
    if (billingPeriod === 'yearly') {
      // Already 50% off for yearly, additional 50% for discount
      return baseMonthlyPrice * 0.5 * 0.5;
    }
    // Just 50% off for monthly
    return baseMonthlyPrice * 0.5;
  }
  
  const individualPlans: PricingPlan[] = [
    {
      name: 'Basic',
      price: discountActive 
        ? (billingPeriod === 'monthly' ? 9.99 : 4.99) 
        : (billingPeriod === 'monthly' ? 19.99 : 9.99),
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
      buttonText: 'Get Basic Plan',
      color: 'green',
      type: 'individual',
      disabled: false,
      popular: false
    },
    {
      name: 'Pro',
      price: discountActive 
        ? (billingPeriod === 'monthly' ? 19.99 : 9.99) 
        : (billingPeriod === 'monthly' ? 39.99 : 19.99),
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
      buttonText: 'Get Pro Plan',
      color: 'blue',
      type: 'individual',
      disabled: false,
      popular: true
    }
  ]
  
  const businessPlans: PricingPlan[] = [
    {
      name: 'Team',
      price: (members = teamMembers) => {
        const basePrice = billingPeriod === 'monthly' ? 49.99 : 24.95;
        const discountedPrice = discountActive ? basePrice * 0.5 : basePrice;
        return discountedPrice * members;
      },
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
      buttonText: 'Get Team Plan',
      color: 'indigo',
      type: 'business',
      isTeam: true,
      disabled: false,
      popular: false
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'Advanced features for large organizations',
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
      buttonText: 'Contact Sales',
      color: 'purple',
      type: 'business',
      disabled: false,
      popular: false
    }
  ]

  const handleSubscribe = (plan: PricingPlan) => {
    if (plan.name === 'Enterprise') {
      window.location.href = 'mailto:hello@trendymirror.com?subject=Enterprise Plan Inquiry'
      return
    }
    
    // In a real app, this would redirect to a payment processor
    const price = typeof plan.price === 'function' ? plan.price() : plan.price
    toast.success(`Redirecting to checkout for ${plan.name} plan (${price})...`)
    
    // Simulate redirect delay
    setTimeout(() => {
      toast.success('This is a demo - no actual payment will be processed')
    }, 2000)
  }

  // When user tries to close the pricing page, show discount popup
  const handleClose = () => {
    // Only show discount popup if it hasn't been shown before
    if (!discountPopupShown) {
      setShowDiscount(true);
      setSelectedPlan('Pro');
      // Mark that discount popup has been shown
      localStorage.setItem(DISCOUNT_SHOWN_KEY, 'true');
      setDiscountPopupShown(true);
    } else {
      // If already shown before, just close the page
      router.push('/dashboard');
    }
  }
  
  // When user closes the discount popup, show countdown and activate discount
  const handleDiscountClose = () => {
    setShowDiscount(false);
    setShowCountdown(true);
    setDiscountActive(true);
    localStorage.setItem(DISCOUNT_KEY, 'true');
  }
  
  // When countdown completes, deactivate discount
  const handleCountdownComplete = () => {
    setShowCountdown(false);
    setDiscountActive(false);
    localStorage.removeItem(TIMER_KEY);
    localStorage.setItem(DISCOUNT_KEY, 'false');
  }
  
  // When user closes the pricing page with countdown
  const handleFinalClose = () => {
    router.push('/dashboard');
  }

  // Don't show discount popup on first load
  useEffect(() => {
    // Check if this is the first load
    const isFirstLoad = !localStorage.getItem(TIMER_KEY) && !localStorage.getItem(DISCOUNT_KEY);
    
    if (isFirstLoad) {
      localStorage.removeItem(TIMER_KEY);
      localStorage.setItem(DISCOUNT_KEY, 'false');
      setDiscountActive(false);
      setShowCountdown(false);
      setShowDiscount(false); // Ensure discount popup is not shown on first load
    }
    
    // Cleanup function to reset discount popup state when navigating away
    return () => {
      // If discount is not active, reset the discount popup shown flag
      // This allows the popup to show again if they return to pricing without an active discount
      if (localStorage.getItem(DISCOUNT_KEY) !== 'true') {
        localStorage.removeItem(DISCOUNT_SHOWN_KEY);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Show discount popup only when user tries to close */}
      {showDiscount && (
        <DiscountPage 
          onClose={handleDiscountClose} 
          selectedPlan={selectedPlan} 
          setSelectedPlan={setSelectedPlan} 
        />
      )}
      
      <div className="container mx-auto px-4 py-8 relative">
        <button 
          onClick={showCountdown ? handleFinalClose : handleClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 transition-colors"
          aria-label="Close"
        >
          <XMarkIcon className="h-6 w-6 text-gray-700" />
        </button>
        
        <div className="text-center mb-6">
          {showCountdown && (
            <div className="mb-4">
              <CountdownTimer minutes={5} onComplete={handleCountdownComplete} />
              <div className="mt-2 bg-blue-100 text-blue-800 font-bold px-4 py-2 rounded-lg inline-block">
                Special 50% OFF Discount Active!
              </div>
            </div>
          )}
          
          <Heading level={1} className="mb-2">Pricing Plans</Heading>
          <Text className="max-w-2xl mx-auto">
            Choose the perfect plan for your needs. Upgrade or downgrade at any time.
          </Text>
          
          <div className="flex justify-center mt-4">
            <div className="inline-flex items-center p-2 bg-gray-100 rounded-full">
              <span className={`mr-3 text-sm font-medium ${billingPeriod === 'monthly' ? 'text-blue-primary' : 'text-gray-500'}`}>
                Monthly
              </span>
              <button
                onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
                className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-primary focus:ring-offset-2"
                style={{ backgroundColor: billingPeriod === 'yearly' ? '#3B82F6' : '#CBD5E1' }}
                role="switch"
                aria-checked={billingPeriod === 'yearly'}
              >
                <span
                  aria-hidden="true"
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    billingPeriod === 'yearly' ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
              <span className={`ml-3 text-sm font-medium ${billingPeriod === 'yearly' ? 'text-blue-primary' : 'text-gray-500'}`}>
                Yearly
              </span>
              <span className="ml-2 text-xs bg-green-100 text-green-800 font-bold px-2 py-1 rounded-full">
                Save 50%
              </span>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <Heading level={2} className="text-center mb-4">Individual Plans</Heading>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {individualPlans.map((plan) => (
              <Card 
                key={plan.name}
                className={`relative ${
                  plan.popular ? 'border-blue-primary border-2' : ''
                }`}
                hover={true}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 transform translate-x-1/3 -translate-y-1/3 z-50">
                    <div className="bg-blue-primary text-white font-bold px-3 py-1 rounded-full shadow-md">
                      Most Popular
                    </div>
                  </div>
                )}
                <div className="p-6">
                  <Heading level={2} className="mb-2">{plan.name}</Heading>
                  <div className="mb-4">
                    {typeof plan.price === 'number' ? (
                      <>
                        <div className="flex flex-col">
                          {billingPeriod === 'yearly' && (
                            <div className="text-sm text-gray-600 mb-1">
                              <s>${plan.name === 'Basic' ? '19.99' : '39.99'}/mo</s>
                            </div>
                          )}
                          <div className="flex items-baseline">
                            <span className="text-3xl font-bold">${plan.price.toFixed(2)}</span>
                            <span className="text-gray-500 ml-1">/mo</span>
                            {billingPeriod === 'yearly' && !discountActive && <span className="ml-2 text-xs bg-green-100 text-green-800 font-bold px-2 py-1 rounded-full">Save 50%</span>}
                          </div>
                          {billingPeriod === 'yearly' && (
                            <div className="text-sm text-gray-600 mt-1">
                              billed ${plan.name === 'Basic' ? '119.99' : '239.99'} annually
                            </div>
                          )}
                          {discountActive && (
                            <div className="text-sm text-green-600 font-semibold mt-1">
                              {billingPeriod === 'yearly' ? '50% + 50%' : '50%'} discount applied!
                            </div>
                          )}
                        </div>
                      </>
                    ) : (
                      <span className="text-3xl font-bold">{typeof plan.price === 'function' ? 'Custom' : plan.price}</span>
                    )}
                  </div>
                  <Text color="light" className="mb-6">{plan.description}</Text>
                  
                  <Button
                    variant={plan.popular ? 'primary' : 'secondary'}
                    fullWidth
                    disabled={plan.disabled}
                    className="mb-6 h-12"
                    onClick={() => handleSubscribe(plan)}
                  >
                    {plan.buttonText}
                  </Button>
                  
                  <div className="space-y-3">
                    <Text className="font-medium">What's included:</Text>
                    {plan.features.map((feature) => (
                      <div key={feature} className="flex items-start">
                        <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                        <Text className="text-sm">{feature}</Text>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
        
        <div className="mb-8">
          <Heading level={2} className="text-center mb-4">Business Plans</Heading>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {businessPlans.map((plan) => (
              <Card 
                key={plan.name}
                className="relative"
                hover={true}
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    {plan.name === 'Team' ? (
                      <UserGroupIcon className="h-8 w-8 text-blue-primary mr-3" />
                    ) : (
                      <BuildingOfficeIcon className="h-8 w-8 text-purple-accent mr-3" />
                    )}
                    <Heading level={2}>{plan.name}</Heading>
                  </div>
                  
                  <Text color="light" className="mb-6">{plan.description}</Text>
                  
                  <div className="mb-4">
                    {plan.name === 'Team' ? (
                      <>
                        <div className="flex flex-col mb-4">
                          {billingPeriod === 'yearly' && (
                            <div className="text-sm text-gray-600 mb-1">
                              <s>$49.99/mo/seat</s>
                            </div>
                          )}
                          <div className="flex items-baseline">
                            <span className="text-3xl font-bold">
                              ${discountActive 
                                ? (billingPeriod === 'monthly' ? '24.99' : '12.49') 
                                : (billingPeriod === 'monthly' ? '49.99' : '24.95')}
                            </span>
                            <span className="text-gray-500 ml-2">/mo/seat</span>
                            {billingPeriod === 'yearly' && !discountActive && <span className="ml-2 text-xs bg-green-100 text-green-800 font-bold px-2 py-1 rounded-full">Save 50%</span>}
                          </div>
                          {billingPeriod === 'yearly' && (
                            <div className="text-sm text-gray-600 mt-1">
                              billed $299.95/yr/seat
                            </div>
                          )}
                          {discountActive && (
                            <div className="text-sm text-green-600 font-semibold mt-1">
                              {billingPeriod === 'yearly' ? '50% + 50%' : '50%'} discount applied!
                            </div>
                          )}
                          <div className="flex items-baseline mt-2">
                            <span className="text-xl font-semibold text-blue-primary">
                              ${(discountActive 
                                ? (billingPeriod === 'monthly' ? 24.99 : 12.49) 
                                : (billingPeriod === 'monthly' ? 49.99 : 24.95)) * teamMembers}
                            </span>
                            <span className="text-gray-500 ml-2">total/mo</span>
                          </div>
                          {billingPeriod === 'yearly' && (
                            <div className="text-sm text-gray-600 mt-1">
                              ${(billingPeriod === 'yearly' ? 
                                ((discountActive ? 12.49 : 24.95) * teamMembers * 12) : 
                                (49.99 * teamMembers * 12)).toFixed(0)} billed annually
                            </div>
                          )}
                        </div>
                        <div className="mb-4">
                          <Text className="block text-sm font-medium mb-1">
                            Team Members: {teamMembers}
                          </Text>
                          <input
                            type="range"
                            min="3"
                            max="20"
                            value={teamMembers}
                            onChange={(e) => setTeamMembers(parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                          />
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>3</span>
                            <span>20</span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-baseline mb-4 justify-center">
                        <span className="text-3xl font-bold text-center py-4">{typeof plan.price === 'function' ? 'Custom' : plan.price}</span>
                      </div>
                    )}
                  </div>
                  
                  <Button
                    variant={plan.name === 'Enterprise' ? 'gradient' : 'primary'}
                    fullWidth
                    disabled={plan.disabled}
                    className="mb-6 h-12"
                    onClick={() => handleSubscribe(plan)}
                  >
                    {plan.buttonText}
                  </Button>
                  
                  <div className="space-y-3">
                    <Text className="font-medium">What's included:</Text>
                    {plan.features.map((feature) => (
                      <div key={feature} className="flex items-start">
                        <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                        <Text className="text-sm">{feature}</Text>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
        
        <div className="mt-16 max-w-3xl mx-auto">
          <Card className="p-6">
            <Heading level={2} className="mb-4">Frequently Asked Questions</Heading>
            <div className="space-y-6">
              <div>
                <Heading level={3} className="mb-2">How do the try-on credits work?</Heading>
                <Text>
                  Each plan comes with a specific number of try-on credits per month. One try-on equals one generated image. Unused credits do not roll over to the next month.
                </Text>
              </div>
              <div>
                <Heading level={3} className="mb-2">Can I upgrade or downgrade my plan?</Heading>
                <Text>
                  Yes, you can change your plan at any time. If you upgrade, you'll be charged the prorated amount for the remainder of the billing cycle. If you downgrade, the new plan will take effect at the start of the next billing cycle.
                </Text>
              </div>
              <div>
                <Heading level={3} className="mb-2">What payment methods do you accept?</Heading>
                <Text>
                  We accept all major credit cards, including Visa, Mastercard, American Express, and Discover. We also support PayPal for select countries.
                </Text>
              </div>
              <div>
                <Heading level={3} className="mb-2">Is there a refund policy?</Heading>
                <Text>
                  Yes, we offer a 14-day money-back guarantee for all paid plans. If you're not satisfied with our service, you can request a full refund within 14 days of your purchase.
                </Text>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
} 