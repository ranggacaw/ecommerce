import { cn } from '@/lib/utils';

export function Input({ className, ...props }) {
    return (
        <input
            className={cn(
                'cbx-field text-sm',
                className,
            )}
            {...props}
        />
    );
}
