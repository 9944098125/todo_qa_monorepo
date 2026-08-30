import { Button } from '@/app/components/ui/button';
import { selectTheme } from '@/app/slice/selectors';
import { EditIcon, TrashIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useQaSlice } from '../slice';
import { useDispatch } from 'react-redux';
import { AddTool } from './add-tool';
import { toast } from '@/app/components/ui/use-toast';
import { ConfirmationDialog } from '@/app/components/Parts/confirmation-dialog';

type Props = {
  item: {
    image: string;
    name: string;
    description: string;
    color: string;
    _id: string;
    slug: string;
    userId: string;
  };
  open: boolean;
  setOpen: (value: boolean) => void;
};

export const ToolItem = (props: Props) => {
  const { item, open, setOpen } = props;
  const { actions } = useQaSlice();
  const dispatch = useDispatch();
  const themeState = useSelector(selectTheme);

  const { useDeleteToolMutation } = useQaSlice();
  const [openConfirmation, setOpenConfirmation] = useState<boolean>(false);
  const [deleteTool, { isLoading, isSuccess, data, isError, error }] =
    useDeleteToolMutation();

  useEffect(() => {
    if (isSuccess && data) {
      toast({
        description: data?.data?.message,
        variant: 'success',
      });
    } else if (isError || error) {
      toast({
        description: String(error),
        variant: 'destructive',
      });
    }
  }, [isSuccess, isError, error]);

  return (
    <React.Fragment>
      <div
        style={{ backgroundColor: item?.color }}
        className={`col-span-12 lg:col-span-6 xl:col-span-4 relative text-white p-2 flex flex-row lg:flex-col items-center lg:items-stretch justify-between lg:justify-start rounded-[.8rem] shadow-lg`}
      >
        <div className="absolute bg-white rounded-[.8rem] p-4 top-1 right-1 md:top-2 md:right-2 flex items-center gap-4">
          <Button
            onClick={() => {
              setOpen(true);
              dispatch(actions.editTool(item));
            }}
            variant="blueBtn"
            className="p-4 rounded-[.8rem]"
          >
            <EditIcon className="text-white h-10 w-10" />
          </Button>

          <Button
            onClick={() => {
              setOpenConfirmation(true);
            }}
            variant="destructive"
            className="p-4 rounded-[.8rem]"
          >
            <TrashIcon className="text-white h-10 w-10" />
          </Button>
          {openConfirmation && (
            <ConfirmationDialog
              module="Qa"
              operation="delete"
              buttons={{ cancel: 'No', confirm: 'Yes' }}
              confirm={() =>
                deleteTool({ userId: item?.userId, toolId: item?._id }) as any
              }
              open={openConfirmation}
              setOpen={setOpenConfirmation}
            />
          )}
        </div>
        <div className="flex items-center gap-4 p-4">
          <div className="bg-white p-2 rounded-full">
            <img
              src={item?.image}
              alt=""
              className="h-[3rem] w-[3rem] md:h-[5rem] md:w-[5rem] rounded-full"
            />
          </div>
          <h4 className="text-[2rem] hidden md:block font-[600]">
            {item?.name}
          </h4>
        </div>
        <p className="text-[1.6rem] hidden lg:block font-[300]">
          {item?.description}
        </p>
      </div>
    </React.Fragment>
  );
};
