<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\PhoneSpec;

#[Fillable(['brand', 'name', 'coreCount', 'GPU'])]
class Processor extends Model
{
    public function spec(){
        return $this->hasMany(PhoneSpec::class, 'id');
    }
}
