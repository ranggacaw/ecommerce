import { cn } from '@/lib/utils';

export function Badge({ className, children }) {
    return <span className={cn('cbx-badge', className)}>{children}</span>;
}
