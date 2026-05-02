<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Color;
use App\Models\PhoneColor;
use Illuminate\Support\Facades\DB;

class CheckoutController extends Controller
{
    public function store(Request $request)
    {
        // Validate request
        $validated = $request->validate([
            'items' => 'required|array',
            'shippingDetails' => 'required|array',
            'userId' => 'required', 
            'totalPrice' => 'required|numeric',
        ]);

        try {
            return DB::transaction(function () use ($request) {
                // Create the order
                $order = Order::create([
                    'user_id' => $request->userId,
                    'total_price' => $request->totalPrice,
                    'status' => 'pending',
                    'shipping_name' => $request->shippingDetails['name'],
                    'shipping_email' => $request->shippingDetails['email'],
                    'shipping_phone' => $request->shippingDetails['phone'],
                    'shipping_address' => $request->shippingDetails['address'],
                    'shipping_city' => $request->shippingDetails['city'],
                    'shipping_method' => $request->shippingDetails['shipping'],
                ]);

                // Process each phone
                foreach ($request->items as $item) {
                    
                    $color = Color::where('color', $item['color'])->first();
                    
                    if (!$color) {
                        throw new \Exception("Color {$item['color']} not found in database.");
                    }

                    $inventory = PhoneColor::where('phoneId', $item['id'])
                        ->where('colorId', $color->id)
                        ->first();

                    // Check if in stock
                    if (!$inventory || $inventory->quantity < $item['quantity']) {
                        throw new \Exception("Not enough stock for {$item['name']} in {$item['color']}.");
                    }

                    // Subtract from inventory
                    $inventory->decrement('quantity', $item['quantity']);

                    // Create order item
                    OrderItem::create([
                        'order_id' => $order->id,
                        'phone_id' => $item['id'],
                        'color_id' => $color->id,
                        'price' => $item['price'],
                        'quantity' => $item['quantity'],
                    ]);
                }

                return response()->json([
                    'message' => 'Order placed successfully!',
                    'order_id' => $order->id
                ], 201);
            });

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Checkout failed: ' . $e->getMessage()
            ], 400);
        }
    }
}