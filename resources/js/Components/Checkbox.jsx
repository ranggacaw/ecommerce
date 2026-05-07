export default function Checkbox({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'rounded border-[var(--cbx-outline)] bg-white text-[var(--cbx-secondary)] focus:ring-[var(--cbx-secondary)] ' +
                className
            }
        />
    );
}
