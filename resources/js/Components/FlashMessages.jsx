import { usePage } from '@inertiajs/react';

export default function FlashMessages() {
    const { flash } = usePage().props;

    if (!flash?.success && !flash?.error) {
        return null;
    }

    return (
        <div className="space-y-3">
            {flash.success ? (
                <div className="rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    {flash.success}
                </div>
            ) : null}
            {flash.error ? (
                <div className="rounded-xl border border-[var(--cbx-error-container)] bg-[var(--cbx-error-container)] px-4 py-3 text-sm text-[var(--cbx-error)]">
                    {flash.error}
                </div>
            ) : null}
        </div>
    );
}
