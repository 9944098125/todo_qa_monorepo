import { GlobalState } from 'app//slice/types';
import { initialState } from 'app/slice';
// [IMPORT NEW CONTAINERSTATE ABOVE] < Needed for generating containers seamlessly

/* 
  Because the redux-injectors injects your reducers asynchronously somewhere in your code
  You have to declare them here manually
*/
export interface RootState {
  globalApi: any;
  global?: GlobalState;
  // [INSERT NEW REDUCER KEY ABOVE] < Needed for generating containers seamlessly
}
