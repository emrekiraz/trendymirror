'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'

const testimonials = [
  {
    id: 1,
    content: "TrendyMirror has completely transformed our online shopping experience. Our return rates have dropped by 35% since implementing their virtual try-on solution.",
    author: {
      name: "Sarah Johnson",
      title: "E-commerce Director, FashionHub",
      avatar: "/images/testimonials/person1.jpg"
    },
    rating: 5
  },
  {
    id: 2,
    content: "The accuracy of the virtual try-on is impressive. Our customers love being able to see how clothes will actually look on them before purchasing.",
    author: {
      name: "Michael Chen",
      title: "CEO, StyleTech",
      avatar: "/images/testimonials/person2.jpg"
    },
    rating: 5
  },
  {
    id: 3,
    content: "Implementation was seamless and the support team was incredibly helpful. We've seen a 28% increase in conversion rates since adding TrendyMirror to our site.",
    author: {
      name: "Emma Rodriguez",
      title: "Digital Marketing Manager, TrendSetters",
      avatar: "/images/testimonials/person3.jpg"
    },
    rating: 5
  }
]

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };
  
  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };
  
  const goToTestimonial = (index: number) => {
    setActiveIndex(index);
  };
  
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-gray-900">
            Trusted by Leading Brands
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            See what our customers have to say about their experience with TrendyMirror.
          </p>
        </div>

        {/* Testimonial Carousel */}
        <div className="max-w-5xl mx-auto">
          <div className="relative bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <div className="absolute -top-6 left-10 text-blue-500">
              <Quote className="w-12 h-12 fill-blue-100 stroke-blue-500" />
            </div>
            
            <div className="relative z-10">
              {/* Testimonial Content */}
              <div className="mb-8">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < testimonials[activeIndex].rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                
                <p className="text-xl md:text-2xl text-gray-700 font-medium italic">
                  "{testimonials[activeIndex].content}"
                </p>
              </div>
              
              <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                {/* Author */}
                <div className="flex items-center mb-4 md:mb-0">
                  <div className="flex-shrink-0 mr-4">
                    <Image
                      src={testimonials[activeIndex].author.avatar}
                      alt={testimonials[activeIndex].author.name}
                      width={64}
                      height={64}
                      className="rounded-full object-cover border-2 border-blue-100"
                    />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">
                      {testimonials[activeIndex].author.name}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {testimonials[activeIndex].author.title}
                    </p>
                  </div>
                </div>
                
                {/* Navigation Controls */}
                <div className="flex space-x-4">
                  <button 
                    onClick={prevTestimonial}
                    className="h-10 w-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-blue-500 hover:border-blue-500 transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button 
                    onClick={nextTestimonial}
                    className="h-10 w-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-blue-500 hover:border-blue-500 transition-colors"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Pagination Indicators */}
          <div className="flex justify-center mt-6 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToTestimonial(index)}
                className={`h-2 rounded-full transition-all ${
                  index === activeIndex ? 'w-8 bg-blue-500' : 'w-2 bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Logos */}
        <div className="mt-24">
          <p className="text-center text-sm font-medium text-gray-500 mb-10">
            TRUSTED BY INNOVATIVE COMPANIES WORLDWIDE
          </p>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-8 opacity-70">
            {/* These would be replaced with actual client logos */}
            <div className="h-12 flex items-center justify-center">
              <div className="h-8 w-24 bg-gray-200 rounded"></div>
            </div>
            <div className="h-12 flex items-center justify-center">
              <div className="h-8 w-24 bg-gray-200 rounded"></div>
            </div>
            <div className="h-12 flex items-center justify-center">
              <div className="h-8 w-24 bg-gray-200 rounded"></div>
            </div>
            <div className="h-12 flex items-center justify-center">
              <div className="h-8 w-24 bg-gray-200 rounded"></div>
            </div>
            <div className="h-12 flex items-center justify-center">
              <div className="h-8 w-24 bg-gray-200 rounded"></div>
            </div>
            <div className="h-12 flex items-center justify-center">
              <div className="h-8 w-24 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 