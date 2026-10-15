import React, { useEffect, useState } from 'react';
import { Add } from '../Qa/components/add';
import { useQaSlice } from '../Qa/slice';
import { useDispatch, useSelector } from 'react-redux';
import { selectTheme, selectUser } from '@/app/slice/selectors';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import {
  UserItem,
  UserItem as UserItemComponent,
} from '../admin/components/user-item';
import { toast } from '@/app/components/ui/use-toast';
import { AddUser } from './components/add-user';
import { EmptyView } from '@/app/components/Parts/EmptyView';
import { Heading } from '@/app/components/Parts/heading';
import { useAdminSlice } from './slice';
import { User } from '@/app/slice/types';
import { UserSkeleton } from './components/user-skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from '@/app/components/ui/dialog';
import { UserDialog } from './components/user-dialog';
import { selectEditableUser } from './slice/selectors';

export interface AdminProps {}

export function Admin(props: AdminProps) {
  const [searchParams] = useSearchParams();
  const { useLazyGetUsersQuery, actions } = useAdminSlice();
  const thisUser = useSelector(selectUser);
  const [getUsers, { isFetching: isUserLoading, data, isError, error }] =
    useLazyGetUsersQuery();

  const dispatch = useDispatch();
  const themeState = useSelector(selectTheme);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState<boolean>(false);
  const [isEditableDialogOpen, setIsEditableDialogOpen] =
    useState<boolean>(false);
  const editableUser = useSelector(selectEditableUser);

  const users: User[] = data?.data?.documents || [];

  const [openDialog, setOpenUserDialog] = useState<boolean>(false);

  const userId = searchParams.get('userId');

  const openUserDialog = () => {
    dispatch(actions.resetEditableUser());
    setIsUserDialogOpen(true);
    console.log(editableUser);
  };

  const closeUserDialog = () => {
    setIsUserDialogOpen(false);
  };

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  useEffect(() => {
    if (isError || error) {
      toast({
        description: String(error),
        variant: 'destructive',
      });
    }
  }, [isError, error]);

  return (
    <React.Fragment>
      <div className="h-full w-full">
        {/* Heading & Add Todo Button with dialog  */}
        <div className="flex items-center justify-between p-5">
          <Heading size="3rem" weight="700" text="Users Collection" />
          <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
            <DialogTrigger asChild>
              <AddUser openDialog={openUserDialog} />
            </DialogTrigger>
            <DialogContent
              onInteractOutside={e => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className={`w-[90%] md:w-1/2 max-w-none border border-green-600/70 ${themeState === 'dark' ? 'bg-black text-white' : 'bg-white text-black'}`}
            >
              <DialogHeader>
                <Heading text="Create User" size="2.6rem" weight="600" />
              </DialogHeader>
              <UserDialog closeDialog={closeUserDialog} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Grid container  */}
        <div className="p-6 grid grid-cols-12 gap-5">
          {isUserLoading ? (
            Array.from({ length: 6 }).map((_, i) => <UserSkeleton key={i} />)
          ) : users?.length ? (
            users?.map((user: User) => {
              return (
                <UserItemComponent
                  key={user._id}
                  users={users}
                  user={user}
                  open={isEditableDialogOpen}
                  setOpen={setIsEditableDialogOpen}
                />
              );
            })
          ) : (
            <EmptyView
              title="No Users Found"
              description="Get started by creating your first user!"
            />
          )}
        </div>
      </div>
    </React.Fragment>
  );
}
