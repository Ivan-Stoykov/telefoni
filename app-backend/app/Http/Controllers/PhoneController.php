<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Phone;
use Symfony\Component\HttpFoundation\Response;

class PhoneController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $phones = Phone::with("PhoneSpec.processor", "PhoneSpec.brand", "colors.color")->get();
        return response($phones, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $slug)
    {
        $phone = Phone::with("phoneSpec.processor", "phoneSpec.brand", "colors.color")->where("slug", $slug)->first();
        $models = Phone::where('phoneSpecId', $phone->phoneSpec->id)->get();
        return response(["phone" => $phone, 'models'=>$models], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
