import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Package } from 'lucide-react';

export default function CTASection() {
  const navigate = useNavigate();

  return (
    <section className="w-full bg-gradient-to-br from-primary via-primary/90 to-primary/80 py-16 sm:py-24 md:py-32">
      <div className="container mx-auto px-4 sm:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-full mb-6">
            <Package className="h-8 w-8 sm:h-12 sm:w-12 text-white" />
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Ready to Send Your Parcel?
          </h2>
          
          <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust Concord Express for their delivery needs
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={() => navigate('/signup')}
              className="h-12 sm:h-14 px-8 bg-white text-primary hover:bg-white/90 shadow-lg hover:shadow-xl transition-all duration-200 text-base sm:text-lg font-semibold"
            >
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/create-delivery')}
              className="h-12 sm:h-14 px-8 bg-transparent border-2 border-white text-white hover:bg-white/10 text-base sm:text-lg font-semibold"
            >
              Create Delivery
            </Button>
          </div>

          <p className="text-sm sm:text-base text-white/70 mt-8">
            No credit card required • Free tracking • 24/7 support
          </p>
        </div>
      </div>
    </section>
  );
}
