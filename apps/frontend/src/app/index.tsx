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
import { Layout } from './components/Layout/index';
import { Login } from './pages/Login/Loadable';
import { ProtectedRoute } from './components/Parts/protectedRoute';
import { Registration } from './pages/Registration/Loadable';
import { Todo } from './pages/Todo/Loadable';

export function App() {
  const { i18n } = useTranslation();
  useGlobalSlice();
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
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}
