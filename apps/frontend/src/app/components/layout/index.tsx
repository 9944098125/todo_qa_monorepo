export interface LayoutProps {
  className?: string;
  children?: React.ReactNode;
}

export function Layout({ className, children }: LayoutProps) {
  return <div className={className}>{children}</div>;
}
