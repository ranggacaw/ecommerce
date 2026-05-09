import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
    'cbx-button text-sm disabled:pointer-events-none disabled:opacity-50',
    {
        variants: {
            variant: {
                primary: 'cbx-button-primary px-5 py-3',
                secondary: 'cbx-button-secondary px-5 py-3',
                ghost: 'cbx-button-ghost px-4 py-2',
                danger: 'cbx-button-danger px-5 py-3',
                outline: 'border border-[var(--cbx-on-surface)] bg-transparent px-5 py-3',
            },
            size: {
                sm: 'px-3 py-2 text-xs',
                md: '',
                lg: 'px-6 py-3.5 text-base',
            },
        },
        defaultVariants: {
            variant: 'primary',
            size: 'md',
        },
    },
);

export function Button({ className, variant, size, ...props }) {
    return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
