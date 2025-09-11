import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  Search, 
  GitBranch, 
  Share2, 
  FileText, 
  Info,
  Menu,
  X,
  Stethoscope
} from 'lucide-react';
import { useState } from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Home', href: '/', icon: Activity },
    { name: 'Lookup', href: '/lookup', icon: Search },
    { name: 'Mapping', href: '/mapping', icon: GitBranch },
    { name: 'Integration', href: '/integration', icon: Share2 },
    { name: 'Docs', href: '/docs', icon: FileText },
    { name: 'About', href: '/about', icon: Info },
  ];

  const isActiveRoute = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="relative">
              <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Stethoscope className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-secondary animate-pulse-glow"></div>
            </div>
            <div className="hidden font-heading font-semibold sm:inline-block">
              <span className="text-gradient">AYUSH</span>
              <span className="ml-1 text-muted-foreground">Terminology</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="ml-10 hidden lg:flex items-center space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.name}
                  variant={isActiveRoute(item.href) ? "default" : "ghost"}
                  size="sm"
                  asChild
                  className="transition-smooth"
                >
                  <Link to={item.href} className="flex items-center space-x-2">
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                </Button>
              );
            })}
          </nav>

          {/* Right side buttons */}
          <div className="ml-auto flex items-center space-x-4">
            <Button variant="outline" size="sm" className="hidden sm:inline-flex">
              API Key
            </Button>
            <Button 
              variant="default" 
              size="sm"
              className="bg-gradient-primary border-0 shadow-glow"
            >
              Get Started
            </Button>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden">
            <div className="space-y-1 bg-background border-t px-4 pb-3 pt-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.name}
                    variant={isActiveRoute(item.href) ? "default" : "ghost"}
                    size="sm"
                    asChild
                    className="w-full justify-start transition-smooth"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Link to={item.href} className="flex items-center space-x-3">
                      <Icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  </Button>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="container py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                  <Stethoscope className="h-5 w-5 text-primary-foreground" />
                </div>
                <div className="font-heading font-semibold">
                  <span className="text-gradient">AYUSH</span>
                  <span className="ml-1 text-muted-foreground">Terminology</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Advanced FHIR R4 terminology service harmonizing traditional and modern medicine.
              </p>
            </div>

            {/* Product */}
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/lookup" className="hover:text-foreground transition-colors">Terminology Lookup</Link></li>
                <li><Link to="/mapping" className="hover:text-foreground transition-colors">Concept Mapping</Link></li>
                <li><Link to="/integration" className="hover:text-foreground transition-colors">FHIR Integration</Link></li>
                <li><Link to="/docs" className="hover:text-foreground transition-colors">API Documentation</Link></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/docs" className="hover:text-foreground transition-colors">Documentation</Link></li>
                <li><Link to="/about" className="hover:text-foreground transition-colors">About</Link></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Support</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Status</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Compliance</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Security</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-sm text-muted-foreground">
              © 2024 Ministry of AYUSH, Government of India. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>Made with ❤️ for Healthcare</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;