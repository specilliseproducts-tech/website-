'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import ScrollReveal from '@/components/scroll-reveal';
import { useSolutions } from '@/hooks/use-queries';

export default function SolutionsClientPage() {
  const { data: solutionsData, isLoading } = useSolutions({
    perPage: 50, // Get all solutions
  });

  const solutions = solutionsData?.solutions || [];

  return (
    <>
      {/* Hero Section */}
      <section className="relative w-full py-24 bg-gradient-to-br from-primary/20 to-secondary/20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              Our Solutions
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Comprehensive solutions tailored to meet the unique needs of
              various industries.
            </p>
          </div>
        </div>
      </section>

      {/* Solutions Overview */}
      <section className="w-full py-20 bg-card">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                Comprehensive Solutions
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We provide end-to-end solutions that address complex challenges
                across various industries, combining our expertise in laser
                technology, thermal mapping, 3D printing, and communications.
              </p>
            </div>
          </ScrollReveal>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading solutions...</p>
              </div>
            </div>
          ) : solutions.length > 0 ? (
            <div className="space-y-24">
              {solutions.map((solution, index) => (
                <div
                  key={solution.id}
                  id={solution.slug}
                  className="scroll-mt-20"
                >
                  <ScrollReveal direction={index % 2 === 0 ? 'left' : 'right'}>
                    <div
                      className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                        index % 2 === 1 ? 'lg:grid-cols-2' : ''
                      }`}
                      style={{
                        gridTemplateColumns:
                          index % 2 === 1 ? '2fr 1fr' : '1fr 2fr',
                      }}
                    >
                      {index % 2 === 0 ? (
                        <>
                          <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg">
                            <Image
                              src={solution.imagePath || '/placeholder.svg'}
                              alt={solution.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="text-2xl md:text-3xl font-bold text-primary mb-4">
                              {solution.title}
                            </h3>
                            <p className="text-muted-foreground mb-6">
                              {solution.description}
                            </p>
                            <Button asChild className="group">
                              <Link
                                href={solution.link}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Learn More
                                <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-2" />
                              </Link>
                            </Button>
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <h3 className="text-2xl md:text-3xl font-bold text-primary mb-4">
                              {solution.title}
                            </h3>
                            <p className="text-muted-foreground mb-6">
                              {solution.description}
                            </p>
                            <Button asChild className="group">
                              <Link
                                href={solution.link}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Learn More
                                <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-2" />
                              </Link>
                            </Button>
                          </div>
                          <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg">
                            <Image
                              src={solution.imagePath || '/placeholder.svg'}
                              alt={solution.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </ScrollReveal>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <h3 className="text-xl font-bold text-primary mb-2">
                No Solutions Available
              </h3>
              <p className="text-muted-foreground">
                Please check back later for our comprehensive solutions.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Industries We Serve */}
      <section className="w-full py-20 bg-background">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                Industries We Serve
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our solutions are designed to meet the specific needs of various
                industries.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              'Research & Education',
              'Telecom',
              'Medical',
              'Aerospace & Defense',
              'Manufacturing',
              'Oil & Gas',
              'Petrochemical',
              'Engineering',
            ].map((industry, i) => (
              <ScrollReveal key={industry} delay={i * 0.1}>
                <div
                  className="bg-card p-6 rounded-xl shadow-md hover:shadow-lg 
                transition-all duration-300 hover:-translate-y-1 text-center"
                >
                  <h3 className="text-xl font-bold text-primary mb-2">
                    {industry}
                  </h3>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-20 bg-gradient-to-br from-primary/20 to-secondary/20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
            Need a Customized Solution?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Contact us to discuss how we can create a tailored solution for your
            specific requirements.
          </p>
          <Button asChild size="lg" className="group">
            <Link href="/contact">
              Get in Touch
              <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-2" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
