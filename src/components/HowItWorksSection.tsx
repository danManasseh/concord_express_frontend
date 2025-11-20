import StepCard from './StepCard';

export default function HowItWorksSection() {
  const steps = [
    {
      icon: 'https://c.animaapp.com/mhjcj73usNmYzq/img/ai_1.png',
      altTag: 'map pin icon',
      title: 'Create',
      description: "Create a delivery order with your recipient's details.",
    },
    {
      icon: 'https://c.animaapp.com/mhjcj73usNmYzq/img/ai_2.png',
      altTag: 'box icon',
      title: 'Track',
      description: 'Track your parcel in real-time.',
    },
    {
      icon: 'https://c.animaapp.com/mhjcj73usNmYzq/img/ai_3.png',
      altTag: 'checkmark icon',
      title: 'Delivered',
      description: 'Receive your parcel at the destination.',
    },
  ];

  return (
    <section className="w-full bg-neutral py-12 sm:py-24 md:py-32">
      <div className="container mx-auto px-4 sm:px-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-foreground mb-8 sm:mb-16">
          How it works
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <StepCard
              key={index}
              icon={step.icon}
              altTag={step.altTag}
              title={step.title}
              description={step.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
