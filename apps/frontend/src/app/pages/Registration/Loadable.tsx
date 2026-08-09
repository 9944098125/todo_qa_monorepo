import { lazyLoad } from 'utils/loadable';

export const Registration = lazyLoad(
  () => import('./index'),
  module => module.Registration,
);
