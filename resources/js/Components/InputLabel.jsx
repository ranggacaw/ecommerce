export default function InputLabel({
    value,
    className = '',
    children,
    ...props
}) {
    return (
        <label
            {...props}
            className={
                `block text-sm font-medium text-[var(--cbx-on-surface)] ` +
                className
            }
        >
            {value ? value : children}
        </label>
    );
}
