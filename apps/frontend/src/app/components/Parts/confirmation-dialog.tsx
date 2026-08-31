import React from 'react';
import { Dialog, DialogContent } from '../ui/dialog';
import { Button } from '../ui/button';
import { useSelector } from 'react-redux';
import { selectTheme } from '@/app/slice/selectors';

type Props = {
  module: string;
  operation: string;
  buttons: {
    cancel: string;
    confirm: string;
  };
  confirm: () => void | Promise<void>;
  open: boolean;
  setOpen: (value: boolean) => void;
};

export const ConfirmationDialog = (props: Props) => {
  const { module, operation, buttons, open, setOpen, confirm } = props;
  const themeState = useSelector(selectTheme);

  const handleConfirm = () => {
    confirm();
    setOpen(false);
  };
  return (
    <React.Fragment>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          onInteractOutside={e => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className={`min-w-[90%] md:min-w-[40%] ${themeState === 'dark' ? 'bg-black text-white' : 'bg-white'}`}
        >
          <p className="text-[1.6rem] font-medium">
            Are you sure, you wanna {operation} {module} ?
          </p>
          <div className="flex items-center justify-between px-4">
            <Button
              onClick={() => setOpen(false)}
              variant="default"
              className={`px-4 py-2 rounded-[.8rem] text-red-600`}
            >
              {buttons.cancel}
            </Button>
            <Button
              variant={`${operation === 'delete' ? 'destructive' : 'special'}`}
              className="px-4 py-2 rounded-[.8rem]"
              onClick={handleConfirm}
            >
              {buttons.confirm}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
};
