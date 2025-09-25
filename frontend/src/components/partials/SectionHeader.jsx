export function SectionHeader({ children }) {
  return (
    <div className="flex items-center justify-between gap-2 my-6">
      {children}
    </div>
  );
}

export function SectionHeaderContainer({ children }) {
  return <div className="flex flex-col gap-1">{children}</div>;
}

export function SectionHeaderTitle({ children }) {
  return <h1 className="text-2xl text-pretty font-semibold">{children}</h1>;
}

export function SectionHeaderDescription({ children }) {
  return (
    <p className="text-muted-foreground text-sm text-pretty">{children}</p>
  );
}
