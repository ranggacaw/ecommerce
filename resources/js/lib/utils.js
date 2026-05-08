import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export function formatCurrency(value) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(Number(value || 0));
}

export function productPrimaryImage(product) {
    return product?.images?.find((image) => image.is_primary)?.url || product?.images?.[0]?.url || 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80';
}

export function productPrice(product, variant) {
    if (variant?.price) {
        return Number(variant.price);
    }
    if (product?.price) {
        return Number(product.price);
    }
    return Number(product?.base_price || product?.variants?.[0]?.price || 0);
}
