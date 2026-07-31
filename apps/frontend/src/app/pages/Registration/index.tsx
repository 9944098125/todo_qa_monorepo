import { RegistrationProps } from './Registration.types';

export function Registration({ className, children }: RegistrationProps) {
  return <div className={className}>{children}</div>;
}
