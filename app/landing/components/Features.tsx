'use client'

import React from 'react'
import Image from 'next/image'
import { TrendingUp, Image as ImageIcon, Zap, Users, ShoppingBag, BarChart } from 'lucide-react'

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  color: string
  gradient: string
}

const FeatureCard = ({ icon, title, description, color, gradient }: FeatureCardProps) => (
  <div className="relative p-8 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white overflow-hidden group">
    <div className={`absolute top-0 left-0 w-2 h-full ${color}`}></div>
    <div className={`w-16 h-16 rounded-xl mb-4 flex items-center justify-center ${gradient} text-white`}>
      {icon}
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
    <p className="text-gray-600">{description}</p>
    
    {/* Background decorative effect */}
    <div className={`absolute -bottom-16 -right-16 w-32 h-32 rounded-full ${color} opacity-10 transform scale-0 group-hover:scale-100 transition-transform duration-500`}></div>
  </div>
);

export default function Features() {
  const features = [
    {
      icon: <ImageIcon className="h-8 w-8" />,
      title: "Photorealistic Rendering",
      description: "Our advanced AI creates true-to-life images showing how clothes fit on real body types.",
      color: "bg-blue-600",
      gradient: "bg-gradient-to-br from-blue-500 to-blue-700",
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Instant Results",
      description: "Generate virtual try-on images in seconds, not minutes, for a seamless shopping experience.",
      color: "bg-purple-600",
      gradient: "bg-gradient-to-br from-purple-500 to-purple-700",
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Body Type Diversity",
      description: "See how clothes look on different body shapes and sizes for more inclusive shopping.",
      color: "bg-indigo-600",
      gradient: "bg-gradient-to-br from-indigo-500 to-indigo-700",
    },
    {
      icon: <ShoppingBag className="h-8 w-8" />,
      title: "Retail Integration",
      description: "Seamlessly integrate with existing e-commerce platforms for a unified shopping experience.",
      color: "bg-pink-600",
      gradient: "bg-gradient-to-br from-pink-500 to-pink-700",
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Increased Conversions",
      description: "Boost sales by 27% on average when shoppers can visualize products before buying.",
      color: "bg-green-600",
      gradient: "bg-gradient-to-br from-green-500 to-green-700",
    },
    {
      icon: <BarChart className="h-8 w-8" />,
      title: "Reduced Returns",
      description: "Cut return rates by up to 40% by helping customers make more confident purchase decisions.",
      color: "bg-orange-600",
      gradient: "bg-gradient-to-br from-orange-500 to-orange-700",
    },
  ];

  return (
    <section className="py-24 bg-gray-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-96 h-96 rounded-full bg-blue-100 opacity-20 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-96 h-96 rounded-full bg-indigo-100 opacity-20 blur-3xl"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section header */}
        <div className="max-w-3xl mx-auto text-center mb-20">
          <div className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-blue-100 text-blue-600 font-medium text-sm mb-6">
            <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2"></span>
            Powerful Features
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Everything You Need for Virtual Try-On
          </h2>
          <p className="text-xl text-gray-600">
            Our comprehensive platform offers advanced features designed to transform the online shopping experience and increase your sales.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              color={feature.color}
              gradient={feature.gradient}
            />
          ))}
        </div>

        {/* Stats section */}
        <div className="mt-24 bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold text-gray-900">Why Businesses Choose TrendyMirror</h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text mb-2">40%</div>
              <p className="text-gray-600">Reduction in Returns</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text mb-2">27%</div>
              <p className="text-gray-600">Increase in Sales</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text mb-2">15K+</div>
              <p className="text-gray-600">Active Users</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text mb-2">98%</div>
              <p className="text-gray-600">Customer Satisfaction</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 