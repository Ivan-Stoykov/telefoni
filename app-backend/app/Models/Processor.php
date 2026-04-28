<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\PhoneSpec;
use Illuminate\Database\Eloquent\Attributes\Fillable;
#[Fillable(['brand', 'name', 'coreCount', 'GPU'])]
class Processor extends Model
{
    public function spec()
    {
        return $this->hasMany(PhoneSpec::class, 'id');
    }
}
