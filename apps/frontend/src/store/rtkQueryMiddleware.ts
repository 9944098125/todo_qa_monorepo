import { api as GlobalApi } from 'app/slice/index';
import { api as RegistrationApi } from 'app/pages/Registration/slice';
import { api as TodoApi } from 'app/pages/Todo/slice';
import { api as QaApi } from 'app/pages/Qa/slice';
import { api as AdminApi } from 'app/pages/Users/slice';
import { api as ProfileApi } from 'app/pages/Profile/slice';

export const rtkQueryMiddleware = [
  GlobalApi.middleware,
  RegistrationApi.middleware,
  TodoApi.middleware,
  QaApi.middleware,
  AdminApi.middleware,
  ProfileApi.middleware,
];
