import { api as GlobalApi } from 'app/slice/index';
import { api as RegistrationApi } from 'app/pages/Registration/slice';
import { api as TodoApi } from 'app/pages/Todo/slice';

export const rtkQueryMiddleware = [
  GlobalApi.middleware,
  RegistrationApi.middleware,
  TodoApi.middleware,
];
