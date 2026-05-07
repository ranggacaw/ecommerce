<?php

namespace App\Http\Controllers\Webhook;

use App\Contracts\ShippingGateway;
use App\Http\Controllers\Controller;
use App\Models\Shipment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ShipmentStatusController extends Controller
{
    public function store(Request $request, ShippingGateway $shippingGateway): JsonResponse
    {
        abort_unless(hash_equals((string) env('SHIPMENT_WEBHOOK_TOKEN', 'sandbox-webhook-token'), (string) $request->header('X-Webhook-Token')), 401);

        $validated = $request->validate([
            'tracking_number' => ['required', 'string'],
            'status' => ['required', 'string'],
        ]);

        $shipment = Shipment::query()->where('tracking_number', $validated['tracking_number'])->firstOrFail();
        $sync = $shippingGateway->syncStatus($shipment, $validated['status']);

        $shipment->update($sync);
        $shipment->order->update([
            'fulfillment_status' => $sync['status'] === 'delivered' ? 'delivered' : 'shipped',
            'status' => $sync['status'] === 'delivered' ? 'completed' : 'processing',
        ]);

        return response()->json([
            'ok' => true,
            'shipment_id' => $shipment->id,
            'status' => $shipment->fresh()->status,
        ]);
    }
}
