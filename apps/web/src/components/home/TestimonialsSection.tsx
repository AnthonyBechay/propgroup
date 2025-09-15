'use client'

import { useState } from 'react'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import Image from 'next/image'

const testimonials = [
  {
    id: 1,
    name: 'Sarah Mitchell',
    role: 'Real Estate Investor',
    location: 'New York, USA',
    image: '/testimonials/sarah.jpg',
    rating: 5,
    text: "PropGroup transformed my investment strategy. Their AI-powered insights helped me identify opportunities I would have never found on my own. My portfolio has grown by 40% in just 18 months!",
    investment: '$1.2M invested',
    returns: '14.5% annual return',
  },
  {
    id: 2,
    name: 'Ahmed Al-Rashid',
    role: 'Tech Entrepreneur',
    location: 'Dubai, UAE',
    image: '/testimonials/ahmed.jpg',
    rating: 5,
    text: "The platform's transparency and data-driven approach gave me the confidence to diversify internationally. The golden visa support was invaluable for my family's future planning.",
    investment: '$2.5M invested',
    returns: '16.2% annual return',
  },
  {
    id: 3,
    name: 'Maria González',
    role: 'Portfolio Manager',
    location: 'Madrid, Spain',
    image: '/testimonials/maria.jpg',
    rating: 5,
    text: "As a professional investor, I appreciate the depth of market analysis PropGroup provides. Their team's expertise in emerging markets has been instrumental in achieving consistent returns.",
    investment: '$3.8M invested',
    returns: '13.8% annual return',
  },
]

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900/50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Success <span className="text-gradient">Stories</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Hear from investors who have achieved their financial goals with PropGroup
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Quote icon */}
            <Quote className="absolute -top-4 -left-4 w-16 h-16 text-blue-500/20 dark:text-blue-400/20" />

            {/* Testimonial card */}
            <div className="glass-card p-8 md:p-12 rounded-3xl shadow-2xl">
              <div className="grid md:grid-cols-3 gap-8 items-center">
                {/* Author info */}
                <div className="md:col-span-1 text-center md:text-left">
                  <div className="relative w-32 h-32 mx-auto md:mx-0 mb-4">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
                      {testimonials[currentIndex].name.split(' ').map(n => n[0]).join('')}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {testimonials[currentIndex].name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {testimonials[currentIndex].role}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    {testimonials[currentIndex].location}
                  </p>
                  
                  {/* Rating */}
                  <div className="flex justify-center md:justify-start gap-1 mt-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < testimonials[currentIndex].rating
                            ? 'text-yellow-500 fill-yellow-500'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Testimonial content */}
                <div className="md:col-span-2 space-y-4">
                  <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed italic">
                    "{testimonials[currentIndex].text}"
                  </p>
                  
                  {/* Investment stats */}
                  <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {testimonials[currentIndex].investment}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {testimonials[currentIndex].returns}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={prevTestimonial}
                className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transform hover:scale-110 transition-all"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>

              {/* Dots indicator */}
              <div className="flex items-center gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`h-2 transition-all duration-300 rounded-full ${
                      index === currentIndex
                        ? 'w-8 bg-gradient-to-r from-blue-500 to-purple-600'
                        : 'w-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={nextTestimonial}
                className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transform hover:scale-110 transition-all"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Trust badges */}
        <div className="mt-16 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Trusted by investors from</p>
          <div className="flex flex-wrap justify-center gap-8 items-center">
            {['USA', 'UAE', 'UK', 'Singapore', 'Canada'].map((country) => (
              <div
                key={country}
                className="px-6 py-3 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <span className="font-semibold text-gray-700 dark:text-gray-300">{country}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
