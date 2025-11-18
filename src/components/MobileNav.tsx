import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileNavProps {
  links: Array<{
    to: string;
    label: string;
    active?: boolean;
  }>;
}

export default function MobileNav({ links }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative z-50"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed top-16 left-0 right-0 bg-card border-b border-border shadow-lg z-40 animate-in slide-in-from-top-2">
            <nav className="container mx-auto px-6 py-4">
              <div className="flex flex-col gap-4">
                {links.map((link, index) => (
                  <Link
                    key={index}
                    to={link.to}
                    onClick={() => setIsOpen(false)}
                    className={`text-base py-2 transition-colors ${
                      link.active
                        ? 'text-primary font-medium'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </nav>
          </div>
        </>
      )}
    </div>
  );
}
