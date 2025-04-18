import React from 'react'
import { Metadata } from 'next'
import { 
  Sparkles, 
  Smartphone, 
  Zap, 
  Shield, 
  BarChart, 
  Users, 
  Layers, 
  Globe, 
  PenTool,
  CheckCircle,
  Cloud,
  Cpu,
  BarChart2,
  Database,
  Eye
} from 'lucide-react'
import CTA from '../components/CTA'

export const metadata: Metadata = {
  title: 'TrendyMirror Features - Advanced Virtual Try-On Technology',
  description: 'Explore TrendyMirror\'s innovative features that make our virtual try-on technology the best solution for fashion retailers and consumers.',
  keywords: 'virtual try-on features, fashion tech innovations, AI fashion, virtual fitting room capabilities, e-commerce solution features',
}

const featureCategories = [
  {
    name: 'Core Technology',
    description: 'Powered by advanced AI and computer vision',
    features: [
      {
        icon: Sparkles,
        title: 'AI-Powered Accuracy',
        description: 'Our advanced AI algorithms ensure realistic and accurate virtual try-on results that consider body shape, lighting, and fabric properties.'
      },
      {
        icon: Cpu,
        title: 'Deep Learning Models',
        description: 'Trained on millions of fashion images to deliver photorealistic and physically accurate visualization of garments.'
      },
      {
        icon: Zap,
        title: 'Lightning Fast Processing',
        description: 'Generate virtual try-on results in seconds, not minutes, even for complex garments and body types.'
      },
      {
        icon: Eye,
        title: 'High-Detail Visualization',
        description: 'See intricate details including fabric texture, folds, shadows, and how garments drape on different body types.'
      }
    ]
  },
  {
    name: 'Platform Features',
    description: 'Designed for seamless user experience',
    features: [
      {
        icon: Smartphone,
        title: 'Mobile & Desktop Compatible',
        description: 'Use TrendyMirror across all your devices with a responsive design optimized for any screen size.'
      },
      {
        icon: Cloud,
        title: 'Cloud Storage',
        description: 'Save your favorite outfits and try-ons in the cloud to access them from anywhere.'
      },
      {
        icon: Users,
        title: 'Diverse Model Library',
        description: 'Choose from hundreds of diverse model avatars representing different body types, or upload your own photos.'
      },
      {
        icon: PenTool,
        title: 'Customizable Experience',
        description: 'Adjust lighting, angles, and backgrounds to see exactly how garments will look in different environments.'
      }
    ]
  },
  {
    name: 'Business Tools',
    description: 'Built for retail and e-commerce success',
    features: [
      {
        icon: Layers,
        title: 'E-commerce Integration',
        description: 'Seamlessly integrate with major e-commerce platforms including Shopify, WooCommerce, and Magento.'
      },
      {
        icon: BarChart,
        title: 'Analytics Dashboard',
        description: 'Track user engagement, conversion rates, and return reductions with comprehensive analytics.'
      },
      {
        icon: Database,
        title: 'Product Management',
        description: 'Easily manage and update your virtual product catalog through our intuitive dashboard.'
      },
      {
        icon: BarChart2,
        title: 'A/B Testing',
        description: 'Test different product presentations and user experiences to optimize conversion rates.'
      }
    ]
  },
  {
    name: 'Security & Support',
    description: 'Enterprise-grade protection and assistance',
    features: [
      {
        icon: Shield,
        title: 'Data Security',
        description: 'Your data and customer images are encrypted and protected with enterprise-grade security protocols.'
      },
      {
        icon: Globe,
        title: '24/7 Global Support',
        description: 'Our support team is available around the clock to help with any questions or issues.'
      },
      {
        icon: CheckCircle,
        title: 'Compliance Ready',
        description: 'Fully compliant with GDPR, CCPA, and other data protection regulations worldwide.'
      }
    ]
  }
]

export default function FeaturesPage() {
  return (
    <div className="pt-16">
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              Powerful Features for Virtual Try-On
            </h1>
            <p className="text-xl text-gray-600">
              TrendyMirror's advanced technology provides a seamless and realistic virtual try-on experience
            </p>
          </div>
          
          <div className="space-y-24">
            {featureCategories.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <div className="max-w-3xl mx-auto text-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-3">
                    {category.name}
                  </h2>
                  <p className="text-lg text-gray-600">
                    {category.description}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-8">
                  {category.features.map((feature, featureIndex) => {
                    const Icon = feature.icon
                    return (
                      <div
                        key={featureIndex}
                        className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                      >
                        <div className="flex items-center mb-4">
                          <div className="flex-shrink-0 mr-3">
                            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-50 text-blue-primary">
                              <Icon className="h-6 w-6" />
                            </div>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {feature.title}
                          </h3>
                        </div>
                        <p className="text-gray-600">
                          {feature.description}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <CTA 
        title="Ready to Explore TrendyMirror?"
        description="Try our virtual try-on technology today and revolutionize your shopping experience."
        primaryButtonText="Get Started"
        primaryButtonAction="signup"
        variant="dark"
      />
    </div>
  )
} 