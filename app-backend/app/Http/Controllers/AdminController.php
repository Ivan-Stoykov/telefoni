<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
class AdminController extends Controller
{
    public function users()
    {
        $users = User::get();
        return response($users, 200);
    }
}
