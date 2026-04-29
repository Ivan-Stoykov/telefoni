<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Processor;
use App\Models\Phone;
use Illuminate\Database\Eloquent\Attributes\Fillable;
#[Fillable([
    'name',
    'slug',
    'imageUrl',
    'description',
    'MainCamera',
    'MCFeatures',
    'MCVideo',
    'SelfieCamera',
    'SCFeatures',
    'SCVideo',
    'Wifi',
    'Bluetooth',
    'Port',
    'NFC',
    'Positioning',
    'Display',
    'ScreenSize',
    'ScreenResolution',
    'ScreenType',
    'Procection',
    'Speakers',
    'ModelNumber',
    'Series',
    'Dimensions',
    'Weight',
    'OS',
    'Battery',
    'Charging',
    'processorId'
])]
class PhoneSpec extends Model
{
    public function processor()
    {
        return $this->belongsTo(Processor::class, 'processorId');
    }

    public function phone()
    {
        return $this->hasMany(Phone::class, 'phoneSpecId');
    }
    public function brand()
    {
        return $this->belongsTo(Brand::class, 'brandId');
    }
}
