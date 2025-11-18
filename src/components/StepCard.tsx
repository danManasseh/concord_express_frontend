interface StepCardProps {
  icon: string;
  altTag: string;
  title: string;
  description: string;
}

export default function StepCard({ icon, altTag, title, description }: StepCardProps) {
  return (
    <div className="flex flex-col items-center text-center p-8 bg-tertiary rounded-lg border border-border">
      <div className="mb-6">
        <img
          src={icon}
          alt={altTag}
          width={64}
          height={64}
          loading="lazy"
          className="w-16 h-16"
        />
      </div>
      <h3 className="text-xl font-bold text-tertiary-foreground mb-4 font-sans">
        {title}
      </h3>
      <p className="text-base text-muted-foreground font-body leading-relaxed">
        {description}
      </p>
    </div>
  );
}
