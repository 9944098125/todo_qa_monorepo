import { selectSidebarToggler, selectTheme } from '@/app/slice/selectors';
import React from 'react';
import { useSelector } from 'react-redux';

type Props = {
  item: {
    _id: string;
    userId: string;
    name: string;
    slug: string;
    image: string;
    color: string;
    description: string;
  };
};

export const SubheadItem = (props: Props) => {
  const sidebarState = useSelector(selectSidebarToggler);
  return (
    <React.Fragment>
      <div
        style={{ backgroundColor: props.item.color, color: 'white' }}
        className={`w-full flex items-center gap-4 cursor-pointer text-[1.6rem] mb-4 font-[600] rounded-[.8rem] py-4 px-6`}
      >
        <img src={props.item.image} className="h-10 w-10" alt="" />
        <p className={`${sidebarState === 'closed' ? 'hidden' : 'block'}`}>
          {props.item.name}
        </p>
      </div>
    </React.Fragment>
  );
};
