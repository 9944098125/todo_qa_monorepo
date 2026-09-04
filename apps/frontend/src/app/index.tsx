/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// import { GlobalStyle } from 'styles/global-styles';

import { NotFound } from './pages/NotFound/Loadable';
import { useTranslation } from 'react-i18next';
import { useGlobalSlice } from './slice';

import { Toaster } from './components/ui/toaster';
import { Login } from './pages/Login/Loadable';
import { ProtectedRoute } from './components/Parts/protectedRoute';
import { Registration } from './pages/Registration/Loadable';
import { Todo } from './pages/Todo/Loadable';
import { Qa } from './pages/Qa/Loadable';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { selectExpiryTime, selectUser } from './slice/selectors';

export function App() {
  const { i18n } = useTranslation();
  const { actions } = useGlobalSlice();

  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const expiryTime = useSelector(selectExpiryTime);

  React.useEffect(() => {
    if (user) {
      if (expiryTime) {
        const timeLeft = expiryTime - Date.now();
        if (timeLeft <= 0) {
          dispatch(actions.logout());
        } else {
          const timer = setTimeout(() => {
            dispatch(actions.logout());
          }, timeLeft);
          return () => clearTimeout(timer);
        }
      }
    }
  }, [user, expiryTime, actions, dispatch]);

  return (
    <>
      <Toaster />
      <BrowserRouter>
        <Helmet
          titleTemplate="%s - Todo Qa"
          defaultTitle="Todo Qa"
          htmlAttributes={{ lang: i18n.language }}
        >
          <meta name="description" content="Todo Qa" />
        </Helmet>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/todo" element={<Todo />} />
            <Route path="/qa" element={<Qa />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}
