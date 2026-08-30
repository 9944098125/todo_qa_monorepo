import React from 'react';
import { Pencil, Trash2, Clock3, Tag } from 'lucide-react';
import 'react-quill-new/dist/quill.snow.css';

import { Qa, ToolItem } from '../slice/types';
import { formatDate } from '@/utils/formatDate';
import { Button } from '@/app/components/ui/button';

type Props = {
  item: Qa & { color?: string };
  tool: ToolItem;
};

export function QaItem({ item, tool }: Props) {
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
        {/* Top Header Row with Badges and Actions */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-md border bg-muted/50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {item.importance || 'Normal'}
            </span>
          </div>

          {/* Action Buttons - Top Right */}
          <div className="flex items-center gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="p-2 h-[5rem] w-[5rem] rounded-[.8rem] transition-colors bg-blue-400 hover:bg-blue-800 text-white hover:text-white"
              aria-label="Edit question"
              title="Edit"
            >
              <Pencil className="h-full w-full" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="p-2 h-[5rem] w-[5rem] rounded-[.8rem] transition-colors bg-red-600 hover:bg-red-800 text-white hover:text-white"
              aria-label="Delete question"
              title="Delete"
            >
              <Trash2 className="h-full w-full" />
            </Button>
          </div>
        </div>

        {/* Question Section */}
        <div className="mb-6">
          <h4 className="text-[2.4rem] font-medium">{item.question}</h4>
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
            className="
              prose 
              dark:prose-invert 
              max-w-none 
              text-foreground/90
              text-[1.6rem]
              leading-relaxed
              [&_ul]:list-disc 
              [&_ol]:list-decimal
              [&_ul]:px-5
              [&_ol]:px-5
              [&_p]:mb-4
              [&_p:last-child]:mb-0
            "
            dangerouslySetInnerHTML={{ __html: item.answer }}
          />
        </div>

        {/* Footer Metadata */}
        <div className="mt-6 flex items-center justify-between border-t border-border/50 pt-4">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Clock3 className="h-4 w-4" />
            <span>Documented on {formatDate(item.createdAt)}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
