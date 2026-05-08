<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Order;
class AdminController extends Controller
{
    public function usersList()
    {
        $users = User::get();
        return response($users, 200);
    }

    public function user(string $id)
    {
        $user = User::where("id", $id)->first();
        return response($user, 200);
    }

    public function userOrders($id)
    {
        $orders = Order::where('user_id', $id)
            ->with(['orderItems.phone.phoneSpec.brand', 'orderItems.color'])
            ->get();

        return response()->json($orders, 200);
    }

    public function updateUser(Request $request, $id)
    {
        $user = User::findOrFail($id);
        
        $user->update($request->all());
        
        return response(['message' => 'User updated successfully', 'user' => $user], 200);
    }

    public function deleteUser($id)
    {
        $user = User::findOrFail($id);
        $user->delete();
        
        return response(['message' => 'User deleted successfully'], 200);
    }

    public function ordersList()
    {
        $orders = Order::with(['orderItems.phone.phoneSpec.brand', 'orderItems.color'])->get(); 
        return response($orders, 200);
    }

    public function order($id)
    {
        $order = Order::with(['orderItems.phone.phoneSpec', 'orderItems.color'])
            ->findOrFail($id);
                  
        return response($order, 200);
    }

    public function updateOrder(Request $request, $id)
    {
        $order = Order::findOrFail($id);
        
        $order->update($request->only([
            'status', 
            'shipping_name', 
            'shipping_email',
            'shipping_phone', 
            'shipping_address', 
            'shipping_city'
        ]));
        
        return response()->json([
            'message' => 'Order logistics updated successfully', 
            'order' => $order
        ], 200);
    }

    public function deleteOrder($id)
    {
        Order::findOrFail($id)->delete();
        return response()->json(['message' => 'Order and associated items deleted'], 200);
    }
}
