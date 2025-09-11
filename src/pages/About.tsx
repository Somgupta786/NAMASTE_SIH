import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Heart,
  Users,
  Globe,
  Award,
  Stethoscope,
  Brain,
  Shield,
  Zap,
  Building,
  Target,
  CheckCircle,
  ExternalLink
} from 'lucide-react';

const About = () => {
  const teamMembers = [
    {
      name: "Dr. Rajesh Kumar",
      role: "Chief Medical Officer",
      expertise: "Ayurveda & Digital Health",
      image: "👨‍⚕️"
    },
    {
      name: "Priya Sharma",
      role: "Lead Software Architect",
      expertise: "FHIR & Healthcare APIs",
      image: "👩‍💻"
    },
    {
      name: "Dr. Anita Verma",
      role: "Terminology Specialist",
      expertise: "Medical Vocabularies",
      image: "👩‍⚕️"
    },
    {
      name: "Vikram Singh",
      role: "Security Lead",
      expertise: "Healthcare Security",
      image: "👨‍💻"
    }
  ];

  const milestones = [
    {
      year: "2022",
      title: "Project Initiation",
      description: "Ministry of AYUSH launches digital transformation initiative"
    },
    {
      year: "2023",
      title: "NAMASTE Development",
      description: "4,500+ Ayurvedic terms standardized and digitized"
    },
    {
      year: "2023",
      title: "ICD-11 Integration",
      description: "Successful mapping to WHO ICD-11 Traditional Medicine Module"
    },
    {
      year: "2024",
      title: "FHIR R4 Compliance",
      description: "Full FHIR specification implementation and testing"
    },
    {
      year: "2024",
      title: "Production Launch",
      description: "Live deployment with 25+ EMR integrations"
    }
  ];

  const achievements = [
    {
      icon: Users,
      metric: "50,000+",
      label: "Healthcare Practitioners",
      description: "Using our terminology service"
    },
    {
      icon: Building,
      metric: "150+",
      label: "Healthcare Institutions",
      description: "Integrated with our platform"
    },
    {
      icon: Globe,
      metric: "28",
      label: "States & UTs",
      description: "Covered across India"
    },
    {
      icon: Award,
      metric: "99.9%",
      label: "System Uptime",
      description: "Reliable healthcare infrastructure"
    }
  ];

  const values = [
    {
      icon: Heart,
      title: "Patient-Centric",
      description: "Every decision prioritizes better patient care and outcomes"
    },
    {
      icon: Brain,
      title: "Innovation",
      description: "Leveraging AI and modern technology for healthcare advancement"
    },
    {
      icon: Shield,
      title: "Security First",
      description: "Maintaining highest standards of data privacy and protection"
    },
    {
      icon: Target,
      title: "Precision",
      description: "Accurate terminology mapping with clinical validation"
    }
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-mesh min-h-[60vh] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-background/60 to-background/90"></div>
        
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-4 animate-fade-in-up">
              <Badge variant="secondary" className="px-4 py-2 text-sm font-medium">
                <Stethoscope className="w-4 h-4 mr-2" />
                About Our Mission
              </Badge>
              
              <h1 className="text-4xl md:text-6xl font-heading font-bold leading-tight">
                Bridging <span className="text-gradient">Traditional</span> and
                <br />
                <span className="text-gradient">Modern Medicine</span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                The AYUSH Terminology Service represents India's commitment to preserving traditional medical knowledge while embracing modern healthcare standards through cutting-edge technology.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center" style={{ animationDelay: '0.3s' }}>
              <Button 
                size="lg" 
                className="bg-gradient-primary border-0 shadow-glow"
              >
                Our Impact
                <Heart className="ml-2 h-5 w-5" />
              </Button>
              
              <Button 
                size="lg" 
                variant="outline"
                className="border-2 hover:bg-accent"
              >
                Join Our Mission
                <ExternalLink className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container space-y-16">
        {/* Mission & Vision */}
        <section className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fade-in-up">
            <h2 className="text-3xl font-heading font-bold">
              Our <span className="text-gradient">Mission</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              To create a unified digital healthcare ecosystem that seamlessly integrates traditional AYUSH practices with modern medical standards, enabling healthcare providers to deliver comprehensive, culturally-sensitive care while maintaining international interoperability standards.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-secondary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold">Preserve Traditional Knowledge</h3>
                  <p className="text-sm text-muted-foreground">Digitizing and standardizing 5,000+ years of Ayurvedic medical wisdom</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-secondary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold">Enable Modern Integration</h3>
                  <p className="text-sm text-muted-foreground">FHIR R4 compliance ensuring seamless EMR integration</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-secondary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold">Improve Patient Care</h3>
                  <p className="text-sm text-muted-foreground">Supporting holistic treatment approaches with accurate terminology</p>
                </div>
              </div>
            </div>
          </div>

          <Card className="shadow-medical p-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="text-center space-y-6">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-primary flex items-center justify-center">
                <Globe className="h-10 w-10 text-primary-foreground" />
              </div>
              
              <div>
                <h3 className="text-2xl font-semibold mb-2">Global Impact</h3>
                <p className="text-muted-foreground">
                  Contributing to WHO's Traditional Medicine Module 2 (TM2) and advancing global healthcare interoperability standards.
                </p>
              </div>
              
              <div className="pt-4 border-t">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-gradient">4.5K+</div>
                    <div className="text-sm text-muted-foreground">Terms Standardized</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gradient">25+</div>
                    <div className="text-sm text-muted-foreground">Countries Interested</div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Core Values */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-heading font-bold">
              Our <span className="text-gradient">Values</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              The principles that guide our work in transforming healthcare through technology
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card 
                  key={index} 
                  className="text-center p-6 hover:shadow-glow transition-all duration-300 group animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="pt-0 space-y-4">
                    <div className="w-16 h-16 mx-auto rounded-full bg-gradient-primary/10 flex items-center justify-center group-hover:bg-gradient-primary group-hover:scale-110 transition-all duration-300">
                      <Icon className="h-8 w-8 text-primary group-hover:text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2 group-hover:text-gradient transition-colors duration-300">
                        {value.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {value.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Achievements */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-heading font-bold">
              Our <span className="text-gradient">Impact</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Measurable outcomes from our commitment to healthcare innovation
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon;
              return (
                <Card 
                  key={index} 
                  className="text-center p-6 hover:shadow-card transition-all duration-300 group animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="pt-0 space-y-4">
                    <div className="w-12 h-12 mx-auto rounded-full bg-gradient-secondary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Icon className="h-6 w-6 text-secondary" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-gradient mb-1">
                        {achievement.metric}
                      </div>
                      <div className="font-semibold text-foreground mb-1">
                        {achievement.label}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {achievement.description}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Timeline */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-heading font-bold">
              Our <span className="text-gradient">Journey</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Key milestones in developing India's first comprehensive AYUSH terminology service
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div 
                  key={index} 
                  className="flex items-start space-x-6 animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex-shrink-0 w-20 text-center">
                    <div className="inline-block px-3 py-1 rounded-full bg-gradient-primary text-primary-foreground text-sm font-semibold">
                      {milestone.year}
                    </div>
                  </div>
                  <Card className="flex-1 shadow-card hover:shadow-glow transition-all duration-300">
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-lg mb-2">{milestone.title}</h3>
                      <p className="text-muted-foreground">{milestone.description}</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-heading font-bold">
              Meet Our <span className="text-gradient">Team</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Experts in healthcare, technology, and traditional medicine working together
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <Card 
                key={index} 
                className="text-center p-6 hover:shadow-glow transition-all duration-300 group animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="pt-0 space-y-4">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {member.image}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1 group-hover:text-gradient transition-colors duration-300">
                      {member.name}
                    </h3>
                    <p className="text-primary font-medium mb-2">{member.role}</p>
                    <p className="text-sm text-muted-foreground">{member.expertise}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center space-y-8 py-16">
          <div className="space-y-4">
            <h2 className="text-3xl font-heading font-bold">
              Join the <span className="text-gradient">Healthcare Revolution</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Be part of India's digital health transformation. Together, we're building the future of integrated healthcare.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-primary border-0 shadow-glow"
            >
              Get Started Today
              <Zap className="ml-2 h-5 w-5" />
            </Button>
            
            <Button 
              size="lg" 
              variant="outline"
              className="border-2 hover:bg-accent"
            >
              Contact Us
              <ExternalLink className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;