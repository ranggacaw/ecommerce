import { cn } from '@/lib/utils';

export function Textarea({ className, ...props }) {
    return (
        <textarea
            className={cn(
                'cbx-field min-h-28 text-sm',
                className,
            )}
            {...props}
        />
    );
}
