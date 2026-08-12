import React from 'react';
import { TodoItem } from '../slice/types';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/app/components/ui/accordion';
import { Edit2Icon, Trash2Icon } from 'lucide-react';

type Props = {
  eachItem: TodoItem;
};
export function TodoAccordionItem(props: Props) {
  const { _id, title, description, urgency, deadline } = props.eachItem;
  return (
    <React.Fragment>
      <AccordionItem value={_id}>
        <AccordionTrigger>
          <div className="flex items-center justify-between px-4 py-2">
            <h4 className="text-xl font-[600]">{title}</h4>
            <div className="flex items-center gap-4">
              <Edit2Icon className="h-10 w-10 bg-blue-100 hover:bg-blue-200 p-2 rounded-[.8rem]" />
              <Trash2Icon className="h-10 w-10 bg-red-100 hover:bg-red-200 p-2 rounded-[.8rem]" />
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="bg-teal-50 p-4">
          <p className="text-lg font-medium">{description}</p>
        </AccordionContent>
      </AccordionItem>
    </React.Fragment>
  );
}
