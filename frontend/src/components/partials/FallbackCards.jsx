export default function FallbackCards({
  icon: Icon,
  title,
  description,
  action,
}) {
  return (
    <div className="text-center flex flex-col items-center py-12">
      <Icon size={64} className="text-muted-foreground/30 mb-2" />
      <h2 className="text-xl font-semibold mb-1">{title}</h2>
      <p className="max-w-[300px] text-sm text-muted-foreground mb-6">
        {description}
      </p>
      {action}
    </div>
  );
}
