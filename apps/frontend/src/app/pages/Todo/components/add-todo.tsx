import { Button } from '@/app/components/ui/button';
import React from 'react';

export const AddTodo = ({ openDialog }: { openDialog: () => void }) => {
  return (
    <React.Fragment>
      <div className="px-5 py-2">
        <Button
          onClick={openDialog}
          variant="special"
          className="px-5 py-4 text-md rounded-[.8rem]"
        >
          Add Todo
        </Button>
      </div>
    </React.Fragment>
  );
};
