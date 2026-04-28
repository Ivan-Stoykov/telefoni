<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\PhoneSpec;
use App\Models\Colors;

#[Fillable(['SalesPackage', 'RAM', 'Storage', 'PhoneSpecId', 'Description'])]
class Phone extends Model
{
    public function spec(){
        return $this->belongsTo(PhoneSpec::class, 'PhoneSpecId');
    }

    public function colors()
    {
        return $this->hasMany(Colors::class, 'Id');
    }
}
