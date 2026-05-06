<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PhoneSpec;

class PhoneSpecController extends Controller
{
    function index()
    {
        return PhoneSpec::all();
    }
}
