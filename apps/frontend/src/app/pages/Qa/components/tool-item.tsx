import { Button } from '@/app/components/ui/button';
import { selectTheme } from '@/app/slice/selectors';
import { EditIcon, TrashIcon } from 'lucide-react';
import React from 'react';
import { useSelector } from 'react-redux';
import { useQaSlice } from '../slice';
import { useDispatch } from 'react-redux';
import { AddTool } from './add-tool';

type Props = {
  item: {
    image: string;
    name: string;
    description: string;
    color: string;
    _id: string;
    slug: string;
  };
  open: boolean;
  setOpen: (value: boolean) => void;
};

export const ToolItem = (props: Props) => {
  const { item, open, setOpen } = props;
  const { actions } = useQaSlice();
  const dispatch = useDispatch();
  const themeState = useSelector(selectTheme);
  return (
    <React.Fragment>
      <div
        style={{ backgroundColor: item?.color }}
        className={`col-span-3 relative text-white p-4 rounded-[.8rem] shadow-lg`}
      >
        <div className="absolute bg-white rounded-[.8rem] p-4 top-4 right-4 flex items-center gap-4">
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

          <Button variant="destructive" className="p-4 rounded-[.8rem]">
            <TrashIcon className="text-white h-10 w-10" />
          </Button>
        </div>
        <div className="flex items-center gap-4 p-4">
          <div className="bg-white p-2 rounded-full">
            <img
              src={item?.image}
              alt=""
              className="h-[5rem] w-[5rem] rounded-full"
            />
          </div>
          <h4 className="text-[2rem] font-[600]">{item?.name}</h4>
        </div>
        <p className="text-[1.6rem] font-[300]">{item?.description}</p>
      </div>
    </React.Fragment>
  );
};
