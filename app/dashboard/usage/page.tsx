'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Heading, Text } from '@/app/components/ui/Typography'
import Button from '@/app/components/ui/Button'
import Card from '@/app/components/ui/Card'
import { ArrowUpTrayIcon, SparklesIcon, UserIcon, PhotoIcon } from '@heroicons/react/24/outline'

// Usage metrics interface
interface UsageMetric {
  name: string
  description: string
  used: number
  max: number
  icon: React.ElementType
  bgColorClass: string
  textColorClass: string
  barColorClass: string
}

export default function UsagePage() {
  const router = useRouter()
  
  // Sample usage metrics - in a real app, these would come from an API
  const [usageMetrics, setUsageMetrics] = useState<UsageMetric[]>([
    {
      name: 'AI Model Creations',
      description: 'Custom AI models you can create',
      used: 3,
      max: 10,
      icon: SparklesIcon,
      bgColorClass: 'bg-blue-100',
      textColorClass: 'text-blue-600',
      barColorClass: 'bg-blue-600'
    },
    {
      name: 'Try-Ons',
      description: 'Virtual try-ons you can generate',
      used: 45,
      max: 100,
      icon: PhotoIcon,
      bgColorClass: 'bg-green-100',
      textColorClass: 'text-green-600',
      barColorClass: 'bg-green-600'
    },
    {
      name: 'Model Uploads',
      description: 'Custom models you can upload',
      used: 12,
      max: 30,
      icon: UserIcon,
      bgColorClass: 'bg-purple-100',
      textColorClass: 'text-purple-600',
      barColorClass: 'bg-purple-600'
    },
    {
      name: 'Storage',
      description: 'Storage space for your models and try-ons',
      used: 1.2, // GB
      max: 5, // GB
      icon: ArrowUpTrayIcon,
      bgColorClass: 'bg-orange-100',
      textColorClass: 'text-orange-600',
      barColorClass: 'bg-orange-600'
    }
  ])

  // Calculate percentage for progress bars
  const calculatePercentage = (used: number, max: number) => {
    return Math.min(Math.round((used / max) * 100), 100)
  }

  // Format the usage numbers
  const formatUsage = (used: number, max: number, isStorage = false) => {
    if (isStorage) {
      return `${used.toFixed(1)} GB / ${max} GB`
    }
    return `${used} / ${max}`
  }

  // Handle upgrade button click
  const handleUpgradeClick = () => {
    router.push('/dashboard/pricing')
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8">
        <Heading level={1} className="text-3xl font-bold text-gray-900 mb-2">Usage</Heading>
        <Text color="light">Monitor your current plan usage and limits</Text>
      </div>

      {/* Current Plan Section */}
      <Card className="mb-8 p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <Heading level={2} className="text-xl font-semibold text-gray-900">Current Plan: Pro</Heading>
            <Text color="light">Your plan renews on May 15, 2023</Text>
          </div>
          <Button 
            variant="primary"
            onClick={handleUpgradeClick}
          >
            Upgrade Plan
          </Button>
        </div>

        {/* Usage Metrics */}
        <div className="space-y-6">
          {usageMetrics.map((metric) => (
            <div key={metric.name} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
              <div className="flex items-start mb-2">
                <div className={`p-2 rounded-full ${metric.bgColorClass} mr-3`}>
                  <metric.icon className={`h-5 w-5 ${metric.textColorClass}`} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <Text className="text-gray-900 font-medium">{metric.name}</Text>
                    <Text className="text-gray-700">
                      {formatUsage(metric.used, metric.max, metric.name === 'Storage')}
                    </Text>
                  </div>
                  <Text color="light" variant="body-sm" className="mb-2">{metric.description}</Text>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className={`${metric.barColorClass} h-2.5 rounded-full`} 
                      style={{ width: `${calculatePercentage(metric.used, metric.max)}%` }}
                    ></div>
                  </div>
                  
                  {/* Usage Percentage */}
                  <Text variant="body-xs" color="light" className="mt-1 text-right">
                    {calculatePercentage(metric.used, metric.max)}% used
                  </Text>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Upgrade Section */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100">
        <div className="flex items-center justify-between">
          <div>
            <Heading level={2} className="text-xl font-semibold text-gray-900 mb-2">Need More Resources?</Heading>
            <Text className="text-gray-700 max-w-xl">
              Upgrade to a higher plan to get more AI model creations, try-ons, and storage space. 
              Our Team plan offers even more flexibility for collaborative work.
            </Text>
          </div>
          <Button 
            variant="primary"
            size="lg"
            onClick={handleUpgradeClick}
            className="whitespace-nowrap ml-4"
          >
            View Pricing Plans
          </Button>
        </div>
      </Card>
    </div>
  )
} 