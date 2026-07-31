import { LoginProps } from './Login.types';

export function Login({ className, children }: LoginProps) {
  return <div className={className}>{children}</div>;
}
