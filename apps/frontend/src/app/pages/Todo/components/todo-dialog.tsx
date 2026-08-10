import Label from '@/app/components/ui/label';
import React from 'react';

export const TodoDialog = () => {
  return (
    <React.Fragment>
      <div className="p-5 w-1/3">
        <form>
          <Label htmlFor="todoTitle">Todo Title</Label>
        </form>
      </div>
    </React.Fragment>
  );
};
