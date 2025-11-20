import { Package, Users, MapPin, TrendingUp } from 'lucide-react';

export default function StatsSection() {
  const stats = [
    {
      icon: Package,
      value: '50K+',
      label: 'Parcels Delivered',
    },
    {
      icon: Users,
      value: '10K+',
      label: 'Happy Customers',
    },
    {
      icon: MapPin,
      value: '100+',
      label: 'Delivery Stations',
    },
    {
      icon: TrendingUp,
      value: '98%',
      label: 'Success Rate',
    },
  ];

  return (
    <section className="w-full bg-card border-y border-border py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-700"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="p-3 bg-primary/10 rounded-full">
                <stat.icon className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
              <div>
                <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
                  {stat.value}
                </p>
                <p className="text-sm sm:text-base text-muted-foreground mt-1">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
