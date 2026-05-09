<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PhoneSpec;
use App\Models\Brand;
use App\Models\Processor;

class PhoneSpecController extends Controller
{
    function index()
    {
        return PhoneSpec::all();
    }

function update(Request $request, string $id)
    {
        $phoneSpec = PhoneSpec::findOrFail($id);
        $brand = Brand::firstOrCreate(['name' => $request->brand['name']]);
            $processor = Processor::firstOrCreate([
                'name' => $request->processor['name'],
                'brand' => $request->processor['brand'],
                'coreCount' => $request->processor['coreCount'],
                'GPU' => $request->processor['GPU']]);

            $specData = $request->except(['processor', 'brand']);
            $specData['processorId'] = $processor->id;
            $specData['brandId'] = $brand->id;  

            $phoneSpec->update($specData);

        return response($phoneSpec, 200);
    }
}
