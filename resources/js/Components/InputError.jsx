export default function InputError({ message, className = '', ...props }) {
    return message ? (
        <p
            {...props}
            className={'text-sm text-[var(--cbx-error)] ' + className}
        >
            {message}
        </p>
    ) : null;
}
