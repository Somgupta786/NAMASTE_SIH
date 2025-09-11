import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  Search, 
  GitBranch, 
  Share2, 
  Shield, 
  Zap,
  Globe,
  Users,
  BarChart,
  CheckCircle,
  Stethoscope,
  Brain,
  Database,
  Lock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { featuresData, statsData } from '@/data/dummyData';

const Index = () => {
  const iconMap = {
    Search,
    GitBranch,
    Share2,
    Shield
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-mesh min-h-[90vh] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/40 to-background/80"></div>
        
        {/* 3D Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-primary rounded-full blur-xl opacity-60 animate-floating"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-gradient-secondary rounded-full blur-2xl opacity-40 animate-floating" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-medical-teal/60 rounded-full blur-lg opacity-70 animate-floating" style={{ animationDelay: '4s' }}></div>

        <div className="container relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in-up">
              <div className="space-y-4">
                <Badge variant="secondary" className="px-4 py-2 text-sm font-medium">
                  <Zap className="w-4 h-4 mr-2" />
                  FHIR R4 Compliant
                </Badge>
                
                <h1 className="text-4xl md:text-6xl font-heading font-bold leading-tight">
                  <span className="text-gradient">AYUSH</span>
                  <br />
                  <span className="text-foreground">Terminology</span>
                  <br />
                  <span className="text-muted-foreground">Harmony</span>
                </h1>
                
                <p className="text-xl text-muted-foreground max-w-2xl">
                  Advanced FHIR R4 microservice harmonizing NAMASTE and ICD-11 vocabularies for seamless traditional and modern medicine integration in Indian healthcare systems.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-gradient-primary border-0 shadow-glow hover:shadow-medical transition-all duration-300 transform hover:scale-105"
                  asChild
                >
                  <Link to="/lookup">
                    Start Exploring
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-2 hover:bg-accent transition-smooth"
                  asChild
                >
                  <Link to="/docs">
                    View Documentation
                  </Link>
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center space-x-6 pt-8">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-secondary" />
                  <span>ISO 22600 Compliant</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-secondary" />
                  <span>ABHA Integrated</span>
                </div>
              </div>
            </div>

            {/* 3D Hero Visual */}
            <div className="relative perspective-1000 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="relative transform-3d rotate-y-12 hover:rotate-y-6 transition-transform duration-1000">
                <Card className="shadow-medical hover:shadow-glow transition-all duration-500 transform hover:scale-105 bg-card/80 backdrop-blur">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <Stethoscope className="h-8 w-8 text-primary animate-heartbeat" />
                      <Badge variant="secondary">Live Demo</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 rounded-full bg-secondary animate-pulse"></div>
                        <span className="text-sm">NAMASTE → ICD-11 Mapping</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                        <span className="text-sm">Real-time Translation</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 rounded-full bg-accent animate-pulse" style={{ animationDelay: '1s' }}></div>
                        <span className="text-sm">FHIR Bundle Processing</span>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-primary">4.5K+</div>
                          <div className="text-xs text-muted-foreground">Terms</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-secondary">99.2%</div>
                          <div className="text-xs text-muted-foreground">Accuracy</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {statsData.map((stat, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-card transition-all duration-300 group animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="pt-0">
                  <div className="text-3xl font-bold text-gradient mb-2 group-hover:scale-110 transition-transform duration-300">
                    {stat.value}
                  </div>
                  <div className="font-semibold text-foreground mb-1">{stat.label}</div>
                  <div className="text-sm text-muted-foreground">{stat.description}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold">
              Powerful Features for <span className="text-gradient">Modern Healthcare</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Built with cutting-edge technology to bridge traditional and modern medicine through standardized terminologies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuresData.map((feature, index) => {
              const Icon = iconMap[feature.icon as keyof typeof iconMap];
              return (
                <Card 
                  key={index} 
                  className="group hover:shadow-medical transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="p-3 rounded-lg bg-gradient-primary group-hover:shadow-glow transition-all duration-300">
                        <Icon className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div>
                        <CardTitle className="group-hover:text-gradient transition-colors duration-300">
                          {feature.title}
                        </CardTitle>
                        <CardDescription className="mt-2">{feature.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="grid grid-cols-2 gap-2">
                      {feature.features.map((item, idx) => (
                        <li key={idx} className="flex items-center space-x-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-secondary flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="py-20 bg-gradient-mesh relative overflow-hidden">
        <div className="absolute inset-0 bg-background/80"></div>
        <div className="container relative z-10">
          <div className="text-center space-y-8 mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold">
              <span className="text-gradient">Seamless Integration</span> with Your EMR
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              RESTful APIs, FHIR R4 compliance, and comprehensive documentation make integration effortless.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-8 hover:shadow-glow transition-all duration-300 group animate-fade-in-up">
              <div className="mb-6">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Database className="h-8 w-8 text-primary-foreground" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-4 group-hover:text-gradient transition-colors duration-300">
                RESTful APIs
              </h3>
              <p className="text-muted-foreground">
                Modern REST architecture with comprehensive OpenAPI documentation for rapid integration.
              </p>
            </Card>

            <Card className="text-center p-8 hover:shadow-glow transition-all duration-300 group animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="mb-6">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-secondary flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Brain className="h-8 w-8 text-secondary-foreground" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-4 group-hover:text-gradient transition-colors duration-300">
                AI-Powered Mapping
              </h3>
              <p className="text-muted-foreground">
                Intelligent concept mapping with machine learning-based confidence scoring and validation.
              </p>
            </Card>

            <Card className="text-center p-8 hover:shadow-glow transition-all duration-300 group animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="mb-6">
                <div className="w-16 h-16 mx-auto rounded-full bg-medical-teal flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Lock className="h-8 w-8 text-accent-foreground" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-4 group-hover:text-gradient transition-colors duration-300">
                Enterprise Security
              </h3>
              <p className="text-muted-foreground">
                ABHA OAuth2, ISO 22600 consent management, and end-to-end encryption for healthcare compliance.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <Card className="p-12 text-center bg-gradient-hero relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-secondary/20"></div>
            <div className="relative z-10 space-y-6">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary-foreground">
                Ready to Transform Healthcare Integration?
              </h2>
              <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
                Join leading healthcare institutions using our terminology service to bridge traditional and modern medicine.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  size="lg" 
                  variant="secondary"
                  className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-lg"
                  asChild
                >
                  <Link to="/lookup">
                    Try Live Demo
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
                  asChild
                >
                  <Link to="/docs">
                    Get API Access
                  </Link>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Index;
