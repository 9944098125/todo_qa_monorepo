import React from 'react';
import { useSelector } from 'react-redux';
import { selectTheme, selectUser } from '@/app/slice/selectors';
import { Heading } from '@/app/components/Parts/heading';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/app/components/ui/tabs';
import { ProfileTab } from './components/profile-tab';
import { ChangePasswordTab } from './components/change-password-tab';
import { useProfileSlice } from './slice';
import { KeyRound, User as UserIcon } from 'lucide-react';

export function Profile() {
  const themeState = useSelector(selectTheme);
  const loggedInUser = useSelector(selectUser);
  const { useGetUserWithIdQuery } = useProfileSlice();

  const isDark = themeState === 'dark';

  const { isLoading: isProfileLoading } = useGetUserWithIdQuery(
    loggedInUser?._id || '',
    {
      skip: !loggedInUser?._id,
    },
  );

  return (
    <div className="w-full min-h-[calc(100vh-80px)] p-4 md:p-8">
      <div className="space-y-6">
        <div>
          <Heading text="Account Settings" size="2.4rem" weight="700" />
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage your profile information and account security.
          </p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <div className="flex justify-center sm:justify-start">
            <TabsList
              className={`p-1.5 rounded-2xl border flex gap-2 mb-6 ${
                isDark
                  ? 'bg-[#181818] border-gray-800'
                  : 'bg-gray-100 border-gray-200'
              }`}
            >
              <TabsTrigger
                value="profile"
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                  isDark
                    ? 'text-gray-300 hover:text-white data-[state=active]:bg-green-600 data-[state=active]:text-white'
                    : 'text-gray-600 hover:text-black data-[state=active]:bg-green-600 data-[state=active]:text-white'
                }`}
              >
                <UserIcon size={16} />
                <span>Profile</span>
              </TabsTrigger>

              <TabsTrigger
                value="change-password"
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                  isDark
                    ? 'text-gray-300 hover:text-white data-[state=active]:bg-green-600 data-[state=active]:text-white'
                    : 'text-gray-600 hover:text-black data-[state=active]:bg-green-600 data-[state=active]:text-white'
                }`}
              >
                <KeyRound size={16} />
                <span>Change Password</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="profile" className="outline-none">
            <ProfileTab isLoading={isProfileLoading} />
          </TabsContent>

          <TabsContent value="change-password" className="outline-none">
            <ChangePasswordTab isLoading={isProfileLoading} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
