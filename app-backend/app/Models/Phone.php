<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\PhoneSpec;
use App\Models\PhoneColor;
use Illuminate\Database\Eloquent\Attributes\Fillable;
#[Fillable(['RAM', 'Storage', 'phoneSpecId', 'price', 'slug', 'name', 'isDeleted'])]
class Phone extends Model
{
    public function phoneSpec(){
        return $this->belongsTo(PhoneSpec::class, 'phoneSpecId');
    }

    public function colors()
    {
        return $this->hasMany(PhoneColor::class, 'phoneId');
    }

    public function reviews()
    {
        return $this->hasMany(Review::class, 'phone_id');
    }
}
