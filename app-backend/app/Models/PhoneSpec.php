<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Processor;
use App\Models\Phone;

#[Fillable(['MainCamera',
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
    public function processor(){
        return $this->belongsTo(Processor::class, 'processorId');
    }

    public function phone()
    {
        return $this->hasMany(Phone::class, 'id');
    }
}
