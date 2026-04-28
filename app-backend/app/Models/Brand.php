<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use App\Models\PhoneSpec;
#[Fillable(['name'])]
class Brand extends Model
{
    public function phoneSpecs()
    {
        return $this->hasMany(PhoneSpec::class, 'brandId');
    }
}
