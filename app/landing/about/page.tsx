import React from 'react'
import { Metadata } from 'next'
import Image from 'next/image'
import CTA from '../components/CTA'
import { Building, Users, Globe, Heart } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About TrendyMirror - Our Mission and Team',
  description: 'Learn about TrendyMirror\'s mission to transform fashion retail with AI-powered virtual try-on technology. Meet our team and discover our values.',
  keywords: 'about TrendyMirror, fashion tech mission, virtual try-on team, AI fashion company, fashion tech innovation',
}

const values = [
  {
    icon: Users,
    title: 'Customer-Focused',
    description: 'We put our customers at the center of everything we do, constantly seeking feedback to improve our platform.'
  },
  {
    icon: Globe,
    title: 'Sustainability',
    description: 'We\'re committed to reducing fashion waste by helping consumers make more informed purchasing decisions.'
  },
  {
    icon: Building,
    title: 'Innovation',
    description: 'We continuously push the boundaries of what\'s possible with AI and computer vision technology.'
  },
  {
    icon: Heart,
    title: 'Inclusivity',
    description: 'We strive to make fashion more accessible and inclusive for people of all body types and backgrounds.'
  }
]

export default function AboutPage() {
  return (
    <div className="pt-16">
      {/* Hero section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              About TrendyMirror
            </h1>
            <p className="text-xl text-gray-600 mb-12">
              Transforming how the world experiences fashion through AI technology
            </p>
          </div>
          
          <div className="max-w-5xl mx-auto bg-gray-50 rounded-xl overflow-hidden shadow-md">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="relative h-64 lg:h-auto">
                <Image
                  src="/images/trendymirror-og.jpg"
                  alt="TrendyMirror Team"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-8 lg:p-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Our Story
                </h2>
                <div className="space-y-4 text-gray-600">
                  <p>
                    TrendyMirror was founded in 2023 with a clear mission: to solve the biggest challenges in online fashion shopping — uncertainty about fit and appearance.
                  </p>
                  <p>
                    Our team of AI researchers, fashion industry experts, and e-commerce specialists came together to create a platform that uses cutting-edge artificial intelligence to provide realistic virtual try-on experiences.
                  </p>
                  <p>
                    Today, TrendyMirror is helping fashion retailers reduce return rates while increasing customer satisfaction and confidence in online purchases.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Values section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-lg text-gray-600">
              The principles that guide our work and decisions
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm text-center">
                  <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-blue-50 text-blue-primary mb-4">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {value.title}
                  </h3>
                  <p className="text-gray-600">
                    {value.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>
      
      {/* Team section (placeholder) */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Team
            </h2>
            <p className="text-lg text-gray-600">
              The talented individuals behind TrendyMirror
            </p>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-8 max-w-3xl mx-auto text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Coming Soon
            </h3>
            <p className="text-gray-600">
              We're currently updating this section with information about our team members. Check back soon to meet the people behind TrendyMirror.
            </p>
          </div>
        </div>
      </section>
      
      <CTA 
        title="Join the Fashion Tech Revolution"
        description="Experience the future of online fashion shopping with TrendyMirror's virtual try-on technology."
        primaryButtonText="Try For Free"
        primaryButtonAction="signup"
        variant="light"
      />
    </div>
  )
} 