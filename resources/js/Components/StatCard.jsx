import { Card, CardContent } from '@/Components/ui/Card';

export default function StatCard({ label, value, help }) {
    return (
        <Card>
            <CardContent>
                <p className="cbx-kicker">{label}</p>
                <p className="mt-4 font-heading text-3xl font-semibold text-[var(--cbx-on-surface)]">{value}</p>
                {help ? <p className="mt-2 text-sm text-[var(--cbx-on-surface-variant)]">{help}</p> : null}
            </CardContent>
        </Card>
    );
}
