import { DatePicker } from '@/app/components/Parts/date-picker';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import Label from '@/app/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/app/components/ui/radio-group';
import { Textarea } from '@/app/components/ui/textarea';
import React, { useState } from 'react';

export const TodoDialog = () => {
  const [deadline, setDeadline] = useState<Date>(new Date());

  return (
    <React.Fragment>
      <div className="p-5 w-full">
        <form>
          <div className="px-4 py-2 mb-4">
            <Label htmlFor="todoTitle">Todo Title</Label>
            <Input
              id="todoTitle"
              placeholder="Todo Title"
              className="w-full h-[4.5rem] text-[1.4rem] rounded-[.8rem]"
            />
          </div>

          <div className="px-4 py-2 mb-4">
            <Label htmlFor="todoDesc">Todo Description</Label>
            <Textarea
              rows={4}
              id="todoDesc"
              placeholder="Todo Description"
              className="w-full text-[1.4rem] rounded-[.8rem]"
            />
          </div>

          <div className="px-4 py-2 mb-4">
            <Label htmlFor="urgency">Urgency</Label>
            <RadioGroup defaultValue="Yes">
              <div className="flex items-center gap-10">
                <div className="flex items-center gap-4">
                  <RadioGroupItem value="Yes" id="yes" />
                  <Label htmlFor="yes">Yes</Label>
                </div>
                <div className="flex items-center gap-4">
                  <RadioGroupItem value="No" id="no" />
                  <Label htmlFor="no">No</Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          <div className="px-4 py-2 mb-4">
            <Label htmlFor="deadline">Deadline</Label>
            <DatePicker date={deadline} setDate={setDeadline as any} />
          </div>

          <div className="px-4 py-2 mb-4">
            <Button variant="primary" className="w-full py-4 rounded-[.8rem]">
              Create Todo
            </Button>
          </div>
        </form>
      </div>
    </React.Fragment>
  );
};
