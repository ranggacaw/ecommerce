<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\InventoryAdjustment;
use App\Models\ProductVariant;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class InventoryController extends Controller
{
    private const ADJUSTMENT_TYPES = ['receipt', 'adjustment', 'return', 'sync'];

    private const ADJUSTMENT_SOURCES = ['manual', 'warehouse', 'return', 'integration', 'correction'];

    private const ADJUSTMENT_STATUSES = ['active', 'replaced', 'voided'];

    public function index(Request $request): Response
    {
        $filters = [
            'q' => trim((string) $request->query('q', '')),
            'type' => (string) $request->query('type', 'all'),
            'status' => (string) $request->query('status', 'all'),
        ];

        $variantQuery = ProductVariant::query()
            ->with('product')
            ->when($filters['q'] !== '', function ($query) use ($filters) {
                $query->where(function ($innerQuery) use ($filters) {
                    $innerQuery
                        ->where('sku', 'like', '%'.$filters['q'].'%')
                        ->orWhere('color', 'like', '%'.$filters['q'].'%')
                        ->orWhere('size', 'like', '%'.$filters['q'].'%')
                        ->orWhereHas('product', fn ($productQuery) => $productQuery->where('name', 'like', '%'.$filters['q'].'%'));
                });
            });

        return Inertia::render('Admin/Inventory', [
            'variants' => (clone $variantQuery)->orderBy('sku')->get(),
            'lowStockVariants' => (clone $variantQuery)
                ->whereRaw('stock_on_hand - stock_reserved <= 3')
                ->orderByRaw('stock_on_hand - stock_reserved asc')
                ->get(),
            'inventoryAdjustments' => InventoryAdjustment::query()
                ->with(['variant.product', 'user', 'replacementAdjustment', 'voidedBy'])
                ->when($filters['q'] !== '', function ($query) use ($filters) {
                    $query->where(function ($innerQuery) use ($filters) {
                        $innerQuery
                            ->where('notes', 'like', '%'.$filters['q'].'%')
                            ->orWhere('source', 'like', '%'.$filters['q'].'%')
                            ->orWhere('type', 'like', '%'.$filters['q'].'%')
                            ->orWhereHas('variant', function ($variantQuery) use ($filters) {
                                $variantQuery
                                    ->where('sku', 'like', '%'.$filters['q'].'%')
                                    ->orWhereHas('product', fn ($productQuery) => $productQuery->where('name', 'like', '%'.$filters['q'].'%'));
                            });
                    });
                })
                ->when($filters['type'] !== 'all', fn ($query) => $query->where('type', $filters['type']))
                ->when($filters['status'] !== 'all', fn ($query) => $query->where('status', $filters['status']))
                ->latest()
                ->take(50)
                ->get(),
            'filters' => $filters,
            'types' => self::ADJUSTMENT_TYPES,
            'sources' => self::ADJUSTMENT_SOURCES,
            'statuses' => self::ADJUSTMENT_STATUSES,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validateAdjustment($request);

        DB::transaction(function () use ($request, $validated): void {
            $variant = ProductVariant::query()->lockForUpdate()->findOrFail($validated['product_variant_id']);
            $this->applyStockChange($variant, $validated['quantity']);

            InventoryAdjustment::create([
                ...$validated,
                'user_id' => $request->user()->id,
                'status' => 'active',
            ]);
        });

        return back()->with('success', 'Inventory updated.');
    }

    public function update(Request $request, InventoryAdjustment $inventoryAdjustment): RedirectResponse
    {
        $validated = $this->validateAdjustment($request);

        DB::transaction(function () use ($request, $validated, $inventoryAdjustment): void {
            $currentAdjustment = InventoryAdjustment::query()->lockForUpdate()->findOrFail($inventoryAdjustment->id);

            $this->ensureActiveAdjustment($currentAdjustment);

            $currentVariant = ProductVariant::query()->lockForUpdate()->findOrFail($currentAdjustment->product_variant_id);
            $replacementVariant = (int) $validated['product_variant_id'] === $currentVariant->id
                ? $currentVariant
                : ProductVariant::query()->lockForUpdate()->findOrFail($validated['product_variant_id']);

            $this->applyStockChange($currentVariant, -1 * $currentAdjustment->quantity);
            $this->applyStockChange($replacementVariant, $validated['quantity']);

            $currentAdjustment->update([
                'status' => 'replaced',
            ]);

            InventoryAdjustment::create([
                ...$validated,
                'user_id' => $request->user()->id,
                'status' => 'active',
                'replaces_adjustment_id' => $currentAdjustment->id,
            ]);
        });

        return back()->with('success', 'Inventory adjustment updated.');
    }

    public function void(Request $request, InventoryAdjustment $inventoryAdjustment): RedirectResponse
    {
        $validated = $request->validate([
            'void_reason' => ['required', 'string'],
        ]);

        DB::transaction(function () use ($request, $validated, $inventoryAdjustment): void {
            $currentAdjustment = InventoryAdjustment::query()->lockForUpdate()->findOrFail($inventoryAdjustment->id);

            $this->ensureActiveAdjustment($currentAdjustment);

            $variant = ProductVariant::query()->lockForUpdate()->findOrFail($currentAdjustment->product_variant_id);
            $this->applyStockChange($variant, -1 * $currentAdjustment->quantity);

            $currentAdjustment->update([
                'status' => 'voided',
                'voided_at' => now(),
                'voided_by' => $request->user()->id,
                'void_reason' => $validated['void_reason'],
            ]);
        });

        return back()->with('success', 'Inventory adjustment voided.');
    }

    private function validateAdjustment(Request $request): array
    {
        return $request->validate([
            'product_variant_id' => ['required', 'exists:product_variants,id'],
            'type' => ['required', Rule::in(self::ADJUSTMENT_TYPES)],
            'source' => ['required', Rule::in(self::ADJUSTMENT_SOURCES)],
            'quantity' => ['required', 'integer', 'not_in:0'],
            'notes' => ['nullable', 'string'],
        ]);
    }

    private function applyStockChange(ProductVariant $variant, int $quantity): void
    {
        $nextStock = $variant->stock_on_hand + $quantity;

        if ($nextStock < 0) {
            throw ValidationException::withMessages([
                'quantity' => 'This adjustment would reduce stock below zero.',
            ]);
        }

        $variant->update([
            'stock_on_hand' => $nextStock,
        ]);
    }

    private function ensureActiveAdjustment(InventoryAdjustment $inventoryAdjustment): void
    {
        if ($inventoryAdjustment->status !== 'active') {
            throw ValidationException::withMessages([
                'adjustment' => 'Only active inventory adjustments can be changed.',
            ]);
        }
    }
}
