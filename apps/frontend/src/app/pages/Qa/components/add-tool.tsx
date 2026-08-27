import { Heading } from '@/app/components/Parts/heading';
import { Button } from '@/app/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/app/components/ui/dialog';
import { Input } from '@/app/components/ui/input';
import Label from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { selectTheme } from '@/app/slice/selectors';
import React from 'react';
import { useSelector } from 'react-redux';

type Props = {
  open: boolean;
  setOpen: (value: boolean) => void;
};

export const AddTool = (props: Props) => {
  const { open, setOpen } = props;
  const themeState = useSelector(selectTheme);
  return (
    <React.Fragment>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="special" className="px-4 py-2 rounded-[.8rem]">
            Add Tool
          </Button>
        </DialogTrigger>
        <DialogContent
          className={`rounded-[.8rem] max-w-[90%] md:max-w-[40%] ${themeState === 'dark' ? 'bg-black text-white border-green-400' : 'bg-green-50 text-black border-green-600'}`}
        >
          {/* tool form  */}
          <Heading text="Create Tool" size="2rem" weight="600" />
          <div className="w-full p-4">
            <div className="mb-4 p-2">
              <Label htmlFor="name">Name</Label>
              <Input
                type="text"
                placeholder="Enter Tool Name"
                className="h-[4.5rem] rounded-[.8rem]"
              />
            </div>
            <div className="mb-4 p-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                type="text"
                placeholder="Enter Tool Slug"
                className="h-[4.5rem] rounded-[.8rem]"
              />
            </div>
            <div className="flex items-center">
              <div className="mb-4 p-2 w-1/2">
                <Label htmlFor="color">Color</Label>
                <Input
                  type="color"
                  placeholder="Enter Tool Name"
                  className="h-[10rem] w-[10rem] rounded-[.8rem]"
                />
              </div>
              <div className="px-4 py-2 mb-4 grid grid-cols-12 gap-4">
                <div className="px-2 col-space-12 md:col-span-3">
                  <Label htmlFor="imageUpload">
                    Tool Logo
                    <Input
                      id="imageUpload"
                      accept="image/*"
                      type="file"
                      className="hidden"
                    />
                    <div
                      className={`h-[10rem] w-[10rem] rounded-full cursor-pointer border-2 border-cyan-700`}
                    >
                      <img
                        src={'/images/avatar.webp'}
                        alt=""
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                  </Label>
                </div>
              </div>
            </div>
            <div className="mb-4 p-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                rows={4}
                placeholder="Enter Tool Name"
                className="h-[4.5rem] rounded-[.8rem]"
              />
            </div>
            <div className="mb-4 p-2">
              <Button
                variant="primary"
                className="w-full h-[4.5rem] rounded-[.8rem]"
              >
                Create Tool
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
};
