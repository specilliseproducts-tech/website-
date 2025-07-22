'use client';

import { useTeams } from '@/hooks/use-queries';
import Image from 'next/image';
import ScrollReveal from '@/components/scroll-reveal';
import type { TeamSelect } from '@/app/dashboard/teams/schema';

export function TeamSection() {
  const {
    data: teamsData,
    isLoading,
    error,
  } = useTeams({
    perPage: 50, // Get all team members
  });

  const teams = teamsData?.teams || [];

  // Debug logging
  console.log('TeamSection - isLoading:', isLoading);
  console.log('TeamSection - error:', error);
  console.log('TeamSection - teamsData:', teamsData);
  console.log('TeamSection - teams:', teams);

  return (
    <section className="w-full py-20 bg-card">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Meet Our Team
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The talented individuals who make Spécialisé Products a success.
            </p>
          </div>
        </ScrollReveal>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-background rounded-xl overflow-hidden shadow-md animate-pulse"
              >
                <div className="aspect-square bg-muted"></div>
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-muted rounded"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : teams.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teams.map((member: TeamSelect, i: number) => (
              <ScrollReveal key={member.id} delay={i * 0.05}>
                <div className="bg-background rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
                  <div className="aspect-square relative">
                    <Image
                      src={
                        member.imagePath ||
                        '/placeholder.svg?height=300&width=300'
                      }
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-primary">{member.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {member.position}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No team members found. Check back soon!
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
