<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Phone;
use App\Models\PhoneSpec;
use App\Models\PhoneColor;
use App\Models\Color;
use App\Models\Brand;
use App\Models\Processor;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Str;

class PhoneController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $phones = Phone::with("PhoneSpec.processor", "PhoneSpec.brand", "colors.color")->where('isDeleted', false)->get();
        return response($phones, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        $request->validate([
                'name' => 'required',
                'price' => 'required|numeric',
                'RAM' => 'required',
                'Storage' => 'required',
                'brand' => 'required_without:phoneSpecId',
                'specs.processor.name' => 'required_without:phoneSpecId',
        ]);

        $request->merge(['slug' => Str::slug(strtolower($request->name))]);

        if ($request->has('phoneSpecId')) {
            $phone = Phone::create($request->only([
                'RAM',
                'Storage',
                'price',
                'name',
                'phoneSpecId',
                'slug'
            ])); 
        }
        else{
            $brand = Brand::firstOrCreate(['name' => $request->input('brand')]);
            $processor = Processor::firstOrCreate([
                'name' => $request->specs['processor']['name'],
                'brand' => $request->specs['processor']['brand'] ?? $brand->name,
                'coreCount' => $request->specs['processor']['coreCount'] ?? 0,
                'GPU' => $request->specs['processor']['GPU'] ?? 'Unknown'
            ]);

            $specData = $request->input('specs');
            $specData['processorId'] = $processor->id;
            $specData['brandId'] = $brand->id;

            $namearr = explode(' ', $request->input('name'));
            array_pop($namearr);
            $specData['specName'] = implode(' ', $namearr);
            unset($specData['processor']); 

            $spec = PhoneSpec::create($specData);

            $phone = Phone::create([
                'RAM' => $request->RAM,
                'Storage' => $request->Storage,
                'price' => $request->price,
                'name' => $request->name,
                'phoneSpecId' => $spec->id,
                'slug' => $request->slug
            ]); 
        }
        if ($request->has('colors')) {
                foreach ($request->colors as $colorData) {
                    if (!isset($colorData['colorName'])) continue;
                    $color = Color::firstOrCreate(['color' => $colorData['colorName']]);
                    PhoneColor::create([
                        'phoneId' => $phone->id,
                        'colorId' => $color->id,
                        'quantity' => $colorData['quantity'] ?? 0
                    ]);
                }

                return response()->json($phone, 201);
            }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $slug)
    {
        $slug = strtolower($slug);
        

        $phone = Phone::with("phoneSpec.processor", "phoneSpec.brand", "colors.color","reviews.user")
            ->where("slug", $slug)
            ->firstOrFail();

        $models = Phone::where('phoneSpecId', $phone->phoneSpec->id)->where('isDeleted', false)->get();
        
        return response()->json(["phone" => $phone, 'models'=>$models], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $phone = Phone::findOrFail($id);

        $request->validate([
            'price' => 'sometimes|numeric',
        ]);
        
        $phone->update($request->only(['RAM', 'Storage', 'price', 'name']));


        if ($request->has('colors')) {
            PhoneColor::where('phoneId', $id)->delete();
            foreach ($request->colors as $colorData) {
                if (!isset($colorData['colorName'])) continue;
                $color = Color::firstOrCreate(['color' => $colorData['colorName']]);
                PhoneColor::updateOrCreate(
                    ['phoneId' => $phone->id, 'colorId' => $color->id],
                    ['quantity' => $colorData['quantity'] ?? 0]
                );
            }
        }

        return response()->json(['message' => 'Phone was updated'], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $phone = Phone::findOrFail($id);
        $phone->update(['isDeleted' => true]);
        
        return response()->json(['message' => 'Phone was deleted'], 200);
    }
}
