<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\PhoneColor;
use Illuminate\Database\Eloquent\Attributes\Fillable;
#[Fillable(['color'])]
class Color extends Model
{
    public function colors(){
        return $this->hasMany(PhoneColor::class, 'colorId');
    }
}
