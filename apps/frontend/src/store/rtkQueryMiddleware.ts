import { api as GlobalApi } from 'app/slice/index';
import { api as RegistrationApi } from 'app/pages/Registration/slice';

export const rtkQueryMiddleware = [
  GlobalApi.middleware,
  RegistrationApi.middleware,
];
