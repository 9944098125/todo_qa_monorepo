import { selectSidebarToggler, selectTheme } from '@/app/slice/selectors';
import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/qa?toolId=${props.item?._id}`);
  };

  return (
    <React.Fragment>
      <div
        onClick={handleNavigate}
        style={{
          backgroundColor: props.item.color,
          color: 'white',
          padding: sidebarState === 'closed' ? '5px' : '5px 5px',
        }}
        className={`w-full flex items-center ${sidebarState === 'closed' && 'justify-center'} gap-4 cursor-pointer text-[1.6rem] mb-4 font-[600] rounded-[.8rem]`}
      >
        <div className="p-1 bg-white rounded-full">
          <img src={props.item.image} className="h-8 w-8 rounded-full" alt="" />
        </div>
        <p className={`${sidebarState === 'closed' ? 'hidden' : 'block'}`}>
          {props.item.name}
        </p>
      </div>
    </React.Fragment>
  );
};
