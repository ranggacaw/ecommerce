import StorefrontLayout from '@/Layouts/StorefrontLayout';
import { useState } from 'react';
import { MapPin, Phone, Clock, Plus, Minus, Navigation, Search, Building2 } from 'lucide-react';

export default function Location({ stores = [] }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeStoreId, setActiveStoreId] = useState(stores[0]?.id ?? null);
    const [filterType, setFilterType] = useState('nearby');

    const filteredStores = stores
        .filter((store) => {
            const matchesSearch = store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                store.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
                store.city.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesSearch;
        })
        .sort((a, b) => {
            if (filterType === 'nearby') return a.distance - b.distance;
            return 0;
        });

    const activeStore = stores.find((s) => s.id === activeStoreId);

    const handleStoreClick = (storeId) => {
        setActiveStoreId(storeId);
    };

    const handleViewOnMap = (store) => {
        const url = `https://www.google.com/maps/search/?api=1&query=${store.latitude},${store.longitude}`;
        window.open(url, '_blank');
    };

    const handleNearMe = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setFilterType('nearby');
                    console.log('Location:', position.coords.latitude, position.coords.longitude);
                },
                (error) => {
                    console.error('Geolocation error:', error);
                    alert('Unable to get your location. Please enable location services.');
                }
            );
        } else {
            alert('Geolocation is not supported by your browser.');
        }
    };

    const handleFilterAll = () => {
        setFilterType('all');
    };

    return (
        <StorefrontLayout title="Store Location">
            {/* Section: Store Finder */}
            <div className="flex flex-col lg:flex-row -mx-4 lg:-mx-10 -mb-8 lg:-mb-10 min-h-[calc(100vh-180px)] lg:min-h-[calc(100vh-240px)]">
                {/* Section: Store List */}
                <section className="w-full lg:w-5/12 flex flex-col bg-[var(--cbx-surface-container-lowest)] border-r border-[var(--cbx-border-subtle)]">
                    {/* Section: Search Header */}
                    <div className="p-6 border-b border-[var(--cbx-border-subtle)] space-y-4">
                        <h1 className="font-heading text-3xl font-bold tracking-tight text-[var(--cbx-primary)]">
                            Find a Store
                        </h1>
                        {/* Section: Search Input */}
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--cbx-on-surface-variant)] group-focus-within:text-[var(--cbx-primary)]" />
                            <input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-[var(--cbx-surface-container-low)] border border-[var(--cbx-border-subtle)] focus:border-[var(--cbx-primary)] focus:ring-0 rounded-lg text-sm transition-all placeholder:text-[var(--cbx-on-surface-variant)]"
                                placeholder="Search by city or region..."
                                type="text"
                            />
                        </div>
                        {/* Section: Filter Buttons */}
                        <div className="flex gap-2">
                            <button
                                onClick={handleNearMe}
                                className={`px-4 py-2 text-[12px] font-bold tracking-wide rounded-full transition-all ${
                                    filterType === 'nearby'
                                        ? 'bg-[var(--cbx-primary)] text-[var(--cbx-on-primary)]'
                                        : 'border border-[var(--cbx-border-subtle)] text-[var(--cbx-on-surface-variant)] hover:bg-[var(--cbx-surface-container-low)]'
                                }`}
                            >
                                NEAR ME
                            </button>
                            <button
                                onClick={handleFilterAll}
                                className={`px-4 py-2 text-[12px] font-bold tracking-wide rounded-full transition-all ${
                                    filterType === 'all'
                                        ? 'bg-[var(--cbx-primary)] text-[var(--cbx-on-primary)]'
                                        : 'border border-[var(--cbx-border-subtle)] text-[var(--cbx-on-surface-variant)] hover:bg-[var(--cbx-surface-container-low)]'
                                }`}
                            >
                                ALL REGIONS
                            </button>
                        </div>
                    </div>

                    {/* Section: Locations List */}
                    <div className="flex-1 overflow-y-auto">
                        {filteredStores.length === 0 ? (
                            <div className="p-6 text-center text-[var(--cbx-on-surface-variant)]">
                                <Building2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                <p>No stores found matching your search.</p>
                            </div>
                        ) : (
                            filteredStores.map((store) => (
                                <div
                                    key={store.id}
                                    onClick={() => handleStoreClick(store.id)}
                                    className={`p-6 border-b border-[var(--cbx-border-subtle)] cursor-pointer transition-colors ${
                                        store.id === activeStoreId
                                            ? 'bg-[var(--cbx-surface-container-lowest)] border-l-4 border-l-[var(--cbx-secondary)]'
                                            : 'hover:bg-[var(--cbx-surface-container-low)]'
                                    }`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h3
                                            className={`font-heading text-xl font-bold ${
                                                store.id === activeStoreId
                                                    ? 'text-[var(--cbx-primary)]'
                                                    : 'text-[var(--cbx-primary)]'
                                            }`}
                                        >
                                            {store.name}
                                        </h3>
                                        <span
                                            className={`text-[10px] font-bold px-2 py-1 rounded ${
                                                store.id === activeStoreId
                                                    ? 'bg-[var(--cbx-secondary)] text-[var(--cbx-on-secondary)]'
                                                    : 'bg-[var(--cbx-surface-container-high)] text-[var(--cbx-on-surface-variant)]'
                                            }`}
                                        >
                                            {store.distance} KM
                                        </span>
                                    </div>
                                    <p className="text-sm text-[var(--cbx-on-surface-variant)] mb-4">
                                        {store.address}
                                    </p>
                                    <div className="space-y-2 text-sm text-[var(--cbx-on-surface-variant)]">
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4 flex-shrink-0" />
                                            <span>{store.hours}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Phone className="h-4 w-4 flex-shrink-0" />
                                            <span>{store.phone}</span>
                                        </div>
                                    </div>
                                    {store.id === activeStoreId && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleViewOnMap(store);
                                            }}
                                            className="mt-4 w-full py-3 border border-[var(--cbx-primary)] text-[12px] font-bold tracking-wide hover:bg-[var(--cbx-primary)] hover:text-[var(--cbx-on-primary)] transition-all"
                                        >
                                            VIEW ON MAP
                                        </button>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </section>

                {/* Section: Map Area */}
                <section className="hidden lg:flex lg:flex-1 relative bg-[var(--cbx-surface-container-high)]">
                    {/* Map Placeholder Pattern */}
                    <div
                        className="absolute inset-0 opacity-30"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        }}
                    />

                    {/* Map Controls */}
                    <div className="absolute top-6 right-6 flex flex-col gap-2">
                        <button className="w-12 h-12 bg-[var(--cbx-surface-container-lowest)] text-[var(--cbx-primary)] shadow-md flex items-center justify-center rounded-lg hover:bg-[var(--cbx-surface-container-high)] transition-colors">
                            <Plus className="h-5 w-5" />
                        </button>
                        <button className="w-12 h-12 bg-[var(--cbx-surface-container-lowest)] text-[var(--cbx-primary)] shadow-md flex items-center justify-center rounded-lg hover:bg-[var(--cbx-surface-container-high)] transition-colors">
                            <Minus className="h-5 w-5" />
                        </button>
                        <button className="w-12 h-12 bg-[var(--cbx-surface-container-lowest)] text-[var(--cbx-primary)] shadow-md flex items-center justify-center rounded-lg hover:bg-[var(--cbx-surface-container-high)] transition-colors mt-4">
                            <Navigation className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Custom Map Pin - Shows Active Store */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <div className="relative flex flex-col items-center">
                            <div className="bg-[var(--cbx-primary)] text-[var(--cbx-on-primary)] px-4 py-2 rounded-xl shadow-lg text-[12px] font-bold tracking-wide whitespace-nowrap mb-2 -translate-y-1 transition-transform hover:-translate-y-2">
                                {activeStore?.name || 'COLORBOX'}
                            </div>
                            <div className="w-10 h-10 bg-[var(--cbx-secondary)] rounded-full flex items-center justify-center border-4 border-[var(--cbx-surface-container-lowest)] shadow-xl">
                                <MapPin className="h-5 w-5 text-[var(--cbx-on-secondary)]" />
                            </div>
                            <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[15px] border-t-[var(--cbx-secondary)] -mt-1" />
                        </div>
                    </div>

                    {/* Open Full Map Button */}
                    {activeStore && (
                        <button
                            onClick={() => handleViewOnMap(activeStore)}
                            className="absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 bg-[var(--cbx-primary)] text-[var(--cbx-on-primary)] text-sm font-bold tracking-wide rounded-lg shadow-lg hover:bg-[var(--cbx-secondary)] transition-colors"
                        >
                            OPEN IN GOOGLE MAPS
                        </button>
                    )}
                </section>
            </div>
        </StorefrontLayout>
    );
}
