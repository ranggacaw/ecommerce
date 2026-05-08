import StorefrontLayout from '@/Layouts/StorefrontLayout';

const visitDetails = [
    {
        title: 'Flagship address',
        content: 'Colorbox Gallery, 18 Mercer Avenue, Central District. The space is arranged for easy browsing, fitting support, and in-store pickup handoff.',
    },
    {
        title: 'Opening hours',
        content: 'Monday to Saturday, 10:00 AM to 9:00 PM. Sunday, 11:00 AM to 7:00 PM. Holiday schedules may vary during special campaigns.',
    },
    {
        title: 'Pickup and access',
        content: 'Order pickup, local courier coordination, and assisted gifting are available at the front desk. Parking and ride-hailing drop-off are both nearby.',
    },
];

export default function Location() {
    return (
        <StorefrontLayout title="Store Location">
            <section className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(18rem,0.9fr)]">
                <div className="rounded-sm border border-[var(--cbx-border-subtle)] bg-[var(--cbx-surface-container-lowest)] p-6 shadow-[var(--cbx-shadow-soft)] lg:p-10">
                    <p className="cbx-kicker">Visit Us</p>
                    <h1 className="mt-3 font-heading text-4xl font-black tracking-[-0.04em] text-[var(--cbx-on-surface)] lg:text-6xl">
                        Store Location
                    </h1>
                    <p className="mt-5 max-w-3xl text-sm leading-7 text-[var(--cbx-on-surface-variant)] lg:text-base">
                        Drop by our retail point for styling help, pickup coordination, and a closer look at the latest Colorbox assortment.
                    </p>
                </div>

                <aside className="rounded-sm border border-[var(--cbx-secondary)] bg-[linear-gradient(135deg,var(--cbx-secondary-container),var(--cbx-surface-container-lowest))] p-6 shadow-[var(--cbx-shadow-soft)]">
                    <p className="cbx-kicker">At A Glance</p>
                    <div className="mt-4 space-y-4 text-sm leading-7 text-[var(--cbx-on-surface)]">
                        <p><strong>Area:</strong> Central District</p>
                        <p><strong>Services:</strong> Styling, pickup, gifting</p>
                        <p><strong>Access:</strong> Parking and ride-hailing nearby</p>
                    </div>
                </aside>
            </section>

            <section className="grid gap-4 lg:grid-cols-3 lg:gap-6">
                {visitDetails.map((detail) => (
                    <article key={detail.title} className="rounded-sm border border-[var(--cbx-border-subtle)] bg-[var(--cbx-surface-container-lowest)] px-6 py-8 shadow-[var(--cbx-shadow-soft)]">
                        <h2 className="font-heading text-2xl font-bold tracking-[-0.03em] text-[var(--cbx-on-surface)]">{detail.title}</h2>
                        <p className="mt-3 text-sm leading-7 text-[var(--cbx-on-surface-variant)]">{detail.content}</p>
                    </article>
                ))}
            </section>
        </StorefrontLayout>
    );
}
