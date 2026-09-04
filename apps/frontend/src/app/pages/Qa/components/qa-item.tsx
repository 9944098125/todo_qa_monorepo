import React, { useEffect, useState } from 'react';
import { Pencil, Trash2, Clock3 } from 'lucide-react';
import 'react-quill-new/dist/quill.snow.css';

import { Qa, ToolItem } from '../slice/types';
import { formatDate } from '@/utils/formatDate';
import { Button } from '@/app/components/ui/button';
import { selectTheme } from '@/app/slice/selectors';
import { useQaSlice } from '../slice';
import { useDispatch } from 'react-redux';
import { ConfirmationDialog } from '@/app/components/Parts/confirmation-dialog';
import { toast } from '@/app/components/ui/use-toast';
import { Icons } from '@/app/components/ui/icons';
import { useSelector } from 'react-redux';

type Props = {
  item: Qa & { color?: string };
  tool: ToolItem;
  openQa: boolean;
  setOpenQa: (value: boolean) => void;
};

export function QaItem({ item, tool, openQa, setOpenQa }: Props) {
  const { useDeleteQaMutation, actions } = useQaSlice();
  const dispatch = useDispatch();

  const [deleteQa, { isLoading, isSuccess, data, isError, error }] =
    useDeleteQaMutation();

  const [openConfirmation, setOpenConfirmation] = useState<boolean>(false);
  const themeState = useSelector(selectTheme);

  useEffect(() => {
    if (isSuccess && data) {
      toast({
        description: data?.data?.message,
        variant: 'success',
      });
    } else if (isError || error) {
      toast({
        description: String(error) || 'Update Qa Failure',
        variant: 'destructive',
      });
    }
  }, [isSuccess, isError, error, data]);

  return (
    <article
      className="group mb-4 relative w-full overflow-hidden rounded-[0.8rem] bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      style={{
        borderLeftWidth: '6px',
        borderLeftStyle: 'solid',
        borderLeftColor: tool?.color || '#3b82f6',
        borderTopWidth: '1px',
        borderRightWidth: '1px',
        borderBottomWidth: '1px',
        borderStyle: 'solid',
        borderColor: tool?.color || 'black',
      }}
    >
      <div className="p-6">
        {/* Question Section */}
        <div className="mb-6 w-full flex items-center justify-between">
          <div className="w-[70%] lg:w-[90%]">
            <h4 className="text-[1.6rem] md:text-[2.4rem] font-medium">
              {item.question}
            </h4>
          </div>
          {/* Action Buttons  */}
          <div className="md:opacity-0 transition-opacity duration-300 group-hover:opacity-100 w-[30%] lg:w-[10%] flex items-center gap-4">
            <Button
              type="button"
              onClick={() => {
                setOpenQa(true);
                dispatch(actions.editQa(item));
              }}
              variant="outline"
              size="icon"
              className="p-2 h-[3rem] w-[3rem] lg:h-[5rem] lg:w-[5rem] rounded-[.8rem] transition-colors bg-blue-400 hover:bg-blue-800 text-white hover:text-white"
              aria-label="Edit question"
              title="Edit"
            >
              <Pencil className="h-full w-full" />
            </Button>
            <Button
              type="button"
              onClick={() => setOpenConfirmation(true)}
              variant="outline"
              size="icon"
              className="p-2 h-[3rem] w-[3rem] lg:h-[5rem] lg:w-[5rem] rounded-[.8rem] transition-colors bg-red-600 hover:bg-red-800 text-white hover:text-white"
              aria-label="Delete question"
              title="Delete"
            >
              {isLoading ? (
                <Icons.Spinner className="h-full w-full animate-spin" />
              ) : (
                <Trash2 className="h-full w-full" />
              )}
            </Button>
            {openConfirmation && (
              <ConfirmationDialog
                module="Qa"
                operation="delete"
                buttons={{ cancel: 'No', confirm: 'Yes' }}
                confirm={() =>
                  deleteQa({ userId: item?.userId, qaId: item?._id }) as any
                }
                open={openConfirmation}
                setOpen={setOpenConfirmation}
              />
            )}
          </div>
        </div>

        {/* Answer Section */}
        <div
          className="rounded-lg border bg-muted/20 px-5 shadow-inner"
          style={{
            borderLeftWidth: '3px',
            borderLeftColor: tool?.color || 'hsl(var(--primary))',
          }}
        >
          <h5 className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Answer
          </h5>
          <div
            className={`
              prose 
              max-w-none 
              ${themeState === 'dark' ? 'text-white' : 'text-black'}
              text-[1.2rem] md:text-[1.6rem]
              leading-relaxed
              [&_ul]:list-disc 
              [&_ol]:list-decimal
              [&_ul]:px-5
              [&_ol]:px-5
              [&_p]:mb-4
              [&_p:last-child]:mb-0
            `}
            dangerouslySetInnerHTML={{ __html: item.answer }}
          />
        </div>

        {/* Footer Metadata */}
        <div className="mt-6 flex items-center justify-between border-t border-border/50 pt-4">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Clock3 className="h-6 w-6 md:h-10 md:w-10" />
            <span className="text-[.8rem] md:text-[1rem]">
              Documented on {formatDate(item.createdAt)}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
