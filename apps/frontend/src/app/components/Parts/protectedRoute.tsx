import { selectUser } from '@/app/slice/selectors';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Layout } from '../Layout';

export function ProtectedRoute() {
  const location = useLocation();
  const isAuthenticated = useSelector(selectUser);

  if (!isAuthenticated) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}
