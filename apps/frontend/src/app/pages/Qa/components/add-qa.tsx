import { Button } from '@/app/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/app/components/ui/dialog';
import { selectTheme } from '@/app/slice/selectors';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { ToolItem } from '../slice/types';

type Props = {
  tools: ToolItem[];
};
export function AddQa(props: Props) {
  const { tools } = props;
  const themeState = useSelector(selectTheme);
  const [open, setOpen] = useState<boolean>(false);
  return (
    <React.Fragment>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="special" className="px-4 py-2 rounded-[.8rem]">
            Add Qa
          </Button>
        </DialogTrigger>
        <DialogContent
          onInteractOutside={e => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className="bg-white"
        >
          {/* {tools?.map(i => {
            return <div className="px-5 py-2 rounded-[.8rem]">{i?.name}</div>;
          })} */}
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
