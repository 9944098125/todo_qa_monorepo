import React, { useState } from 'react';
import { Add } from './components/add';
export interface QaProps {}

export function Qa({}: QaProps) {
  const [openToolDialog, setOpenToolDialog] = useState<boolean>(false);
  return (
    <React.Fragment>
      <div className="h-full w-full p-5">
        <Add toolDialog={openToolDialog} setToolDialog={setOpenToolDialog} />
      </div>
    </React.Fragment>
  );
}
