<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Colors;

#[Fillable(['color', 'tag'])]
class Color extends Model
{
    public function colors(){
        return $this->hasMany(Colors::class, 'id');
    }
}
