import { lazyLoad } from 'utils/loadable';

export const ToDo = lazyLoad(
  () => import('./index'),
  module => module.ToDo,
);
