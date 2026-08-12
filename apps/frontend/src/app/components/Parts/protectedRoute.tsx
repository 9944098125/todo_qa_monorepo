import { selectUser } from '@/app/slice/selectors';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Layout } from '../Layout';

export function ProtectedRoute() {
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectUser);

  if (!isAuthenticated) {
    navigate('/');
    return;
  }

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}
