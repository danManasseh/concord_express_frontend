import { Shield, Clock, Bell, Users } from 'lucide-react';

export default function FeaturesSection() {
  const features = [
    {
      icon: Shield,
      title: 'Secure & Safe',
      description: 'Your parcels are insured and handled with care throughout the delivery process.',
    },
    {
      icon: Clock,
      title: 'Real-Time Tracking',
      description: 'Track your parcel every step of the way with live updates and notifications.',
    },
    {
      icon: Bell,
      title: 'Instant Notifications',
      description: 'Get notified immediately when your parcel status changes or arrives.',
    },
    {
      icon: Users,
      title: 'Professional Drivers',
      description: 'Our verified drivers ensure your parcels reach their destination safely.',
    },
  ];

  return (
    <section className="w-full bg-background py-16 sm:py-24 md:py-32">
      <div className="container mx-auto px-4 sm:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Why Choose Concord Express?
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            We provide the best parcel delivery experience with cutting-edge technology
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-6 sm:p-8 bg-card border border-border rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-4"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="mb-4 p-3 bg-primary/10 rounded-lg w-fit group-hover:bg-primary/20 transition-colors">
                <feature.icon className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
