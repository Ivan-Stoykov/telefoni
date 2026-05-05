<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['user_id', 'phone_id', 'rating', 'comment'])]
class Review extends Model
{
    protected $casts = [
        'rating' => 'integer',
        'phone_id' => 'integer',
        'user_id' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function phone()
    {
        return $this->belongsTo(Phone::class);
    }
}
