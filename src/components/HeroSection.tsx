import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Package, Truck, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HeroSection() {
  const [trackingId, setTrackingId] = useState('');
  const navigate = useNavigate();

  const handleTrack = () => {
    if (trackingId.trim()) {
      navigate(`/track?id=${trackingId.toUpperCase()}`);
    }
  };

  return (
    <section className="relative w-full bg-gradient-to-br from-primary/5 via-background to-primary/10 py-16 sm:py-24 md:py-32 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 right-10 opacity-10">
        <Package className="h-32 w-32 text-primary animate-pulse" />
      </div>
      <div className="absolute bottom-20 left-10 opacity-10">
        <Truck className="h-24 w-24 text-primary animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      
      <div className="container mx-auto px-4 sm:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6 animate-in fade-in slide-in-from-top-4 duration-700">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Fast, Reliable & Affordable</span>
          </div>

          {/* Main heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 animate-in fade-in slide-in-from-top-6 duration-700 delay-100">
            Parcel Delivery
            <br />
            <span className="text-primary">Made Simple</span>
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-in fade-in slide-in-from-top-8 duration-700 delay-200">
            Track, manage, and deliver parcels with ease. Real-time updates from pickup to doorstep.
          </p>

          {/* Tracking input */}
          <div className="max-w-2xl mx-auto mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            <div className="flex flex-col sm:flex-row gap-3 p-2 bg-card rounded-xl shadow-lg border border-border">
              <Input
                type="text"
                placeholder="Enter tracking ID (e.g., TRK001234)"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleTrack()}
                className="flex-1 h-12 sm:h-14 text-base border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                aria-label="Enter tracking ID"
              />
              <Button
                onClick={handleTrack}
                size="lg"
                className="h-12 sm:h-14 px-8 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Track Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
						<div className="flex flex-col sm:flex-row items-center justify-center gap-6">
							<Link to="/superadmin/login" className="hover:text-primary transition-colors font-bold">Super Admin Login</Link>
							<Link to="/admin/login" className="hover:text-primary transition-colors font-bold">Station Admin</Link>
						</div>
          </div>
				</div>
			</div>
		</section>
		);}
