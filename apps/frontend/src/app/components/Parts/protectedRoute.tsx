import { selectTheme, selectUser } from '@/app/slice/selectors';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Layout } from '../Layout';
import { useQaSlice } from '@/app/pages/Qa/slice';
import { useEffect, useState } from 'react';

export function ProtectedRoute() {
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectUser);

  const { useLazyGetToolsQuery } = useQaSlice();
  const userState = useSelector(selectUser);

  const [getTools, { isLoading, data, isError, error }] =
    useLazyGetToolsQuery();

  useEffect(() => {
    if (userState?._id) {
      getTools(userState?._id);
    }
  }, [userState?._id]);

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
