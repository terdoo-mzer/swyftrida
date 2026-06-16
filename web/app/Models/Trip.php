<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['origin', 'destination', 'departure_time', 'capacity', 'price'])]
class Trip extends Model
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
            'origin' => 'string',
            'destination' => 'string',
            'departure_time' => 'datetime',
            'capacity' => 'integer',
            'price' => 'decimal:2',
        ];
    }
}
