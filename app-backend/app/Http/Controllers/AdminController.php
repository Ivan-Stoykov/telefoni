<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
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
}
