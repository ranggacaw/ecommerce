<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\StoreLocation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StoreLocationController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Locations', [
            'locations' => StoreLocation::query()
                ->orderBy('sort_order')
                ->orderBy('name')
                ->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        StoreLocation::create($this->validateLocation($request));

        return back()->with('success', 'Store location saved.');
    }

    public function update(Request $request, StoreLocation $storeLocation): RedirectResponse
    {
        $storeLocation->update($this->validateLocation($request));

        return back()->with('success', 'Store location updated.');
    }

    private function validateLocation(Request $request): array
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'address' => ['required', 'string', 'max:255'],
            'city' => ['required', 'string', 'max:120'],
            'latitude' => ['required', 'numeric'],
            'longitude' => ['required', 'numeric'],
            'distance' => ['required', 'numeric', 'min:0'],
            'hours' => ['required', 'string', 'max:120'],
            'phone' => ['required', 'string', 'max:30'],
            'services' => ['nullable', 'string'],
            'is_active' => ['nullable', 'boolean'],
            'sort_order' => ['required', 'integer', 'min:0'],
        ]);

        $validated['services'] = collect(explode(',', $validated['services'] ?? ''))
            ->map(fn (string $service) => trim($service))
            ->filter()
            ->values()
            ->all();
        $validated['is_active'] = $request->boolean('is_active', true);

        return $validated;
    }
}
