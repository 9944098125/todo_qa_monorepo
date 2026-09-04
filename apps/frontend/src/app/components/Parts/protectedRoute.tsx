import { selectUser } from '@/app/slice/selectors';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { Layout } from '../Layout';
import { useQaSlice } from '@/app/pages/Qa/slice';
import { useEffect } from 'react';

export function ProtectedRoute() {
  const isAuthenticated = useSelector(selectUser);

  const { useLazyGetToolsQuery } = useQaSlice();
  const userState = useSelector(selectUser);

  const [getTools, { isLoading, data }] = useLazyGetToolsQuery();

  useEffect(() => {
    if (userState?._id) {
      getTools(userState?._id);
    }
  }, [userState?._id, getTools]);

  const tools = data?.data?.data?.tools;

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <Layout tools={tools} isToolsLoading={isLoading}>
      <Outlet context={{ tools, isToolsLoading: isLoading }} />
    </Layout>
  );
}
