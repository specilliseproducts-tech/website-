'use client';

import { useSystemIntegrators } from '@/hooks/use-queries';
import Image from 'next/image';
import ScrollReveal from '@/components/scroll-reveal';
import type { SystemIntegratorSelect } from '@/app/dashboard/system-integrators/schema';

export function SystemIntegratorSection() {
  const {
    data: systemIntegratorsData,
    isLoading,
    error,
  } = useSystemIntegrators({
    perPage: 50, // Get all system integrators
  });

  const systemIntegrators = systemIntegratorsData?.systemIntegrators || [];

  // Debug logging
  console.log('SystemIntegratorSection - isLoading:', isLoading);
  console.log('SystemIntegratorSection - error:', error);
  console.log(
    'SystemIntegratorSection - systemIntegratorsData:',
    systemIntegratorsData,
  );
  console.log(
    'SystemIntegratorSection - systemIntegrators:',
    systemIntegrators,
  );

  return (
    <section className="w-full py-20 bg-background">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Our Integration Solutions
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our comprehensive range of system integration solutions
              designed to enhance your operational efficiency.
            </p>
          </div>
        </ScrollReveal>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-background rounded-xl p-6 shadow-md animate-pulse"
              >
                <div className="w-16 h-16 bg-muted rounded-lg mb-4"></div>
                <div className="space-y-2">
                  <div className="h-6 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded"></div>
                  <div className="h-4 bg-muted rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : systemIntegrators.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {systemIntegrators.map(
              (integrator: SystemIntegratorSelect, i: number) => (
                <ScrollReveal key={integrator.id} delay={i * 0.1}>
                  <div className="bg-card p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <div className="w-16 h-16 relative mb-6 mx-auto">
                      <Image
                        src={
                          integrator.icon ||
                          '/placeholder.svg?height=64&width=64'
                        }
                        alt={integrator.title}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <h3 className="text-xl font-bold text-primary mb-3 text-center">
                      {integrator.title}
                    </h3>
                    <p className="text-muted-foreground text-center leading-relaxed">
                      {integrator.description}
                    </p>
                  </div>
                </ScrollReveal>
              ),
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No system integration solutions available at the moment. Check
              back soon!
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
