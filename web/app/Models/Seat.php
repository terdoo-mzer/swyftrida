<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['trip_id', 'seat_number'])]

class Seat extends Model
{
    protected $keyType = 'string';
    public $incrementing = false;

       /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */ 
    protected function casts(): array
    {
        return [
            'trip_id' => 'string',
            'seat_number' => 'string',
        ];
    }

}
