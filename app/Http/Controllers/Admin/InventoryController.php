<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\InventoryAdjustment;
use App\Models\ProductVariant;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class InventoryController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'product_variant_id' => ['required', 'exists:product_variants,id'],
            'type' => ['required', 'string', 'max:30'],
            'source' => ['required', 'string', 'max:50'],
            'quantity' => ['required', 'integer'],
            'notes' => ['nullable', 'string'],
        ]);

        $variant = ProductVariant::query()->findOrFail($validated['product_variant_id']);
        $variant->update([
            'stock_on_hand' => max(0, $variant->stock_on_hand + $validated['quantity']),
        ]);

        InventoryAdjustment::create([
            ...$validated,
            'user_id' => $request->user()->id,
        ]);

        return back()->with('success', 'Inventory updated.');
    }
}
