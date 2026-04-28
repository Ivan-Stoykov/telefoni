<?php

namespace App\Models;
use App\Models\Color;
use App\Models\Phone;

use Illuminate\Database\Eloquent\Model;
#[Fillable(['colorId', 'phoneId'])]
class Colors extends Model
{
    public function color(){
        return $this->belongsTo(Color::class, 'colorId');
    }

    public function phone(){
        return $this->belongsTo(Phone::class, 'phoneId');
    }
    
}
