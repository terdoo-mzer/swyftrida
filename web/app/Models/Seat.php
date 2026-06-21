<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\concerns\HasUuids;

#[Fillable(['trip_id', 'seat_number', 'status'])]
#[Table(key: 'uuid', keyType: 'string', incrementing: false)]
class Seat extends Model
{
    use HasUuids;
    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */ 
    protected function casts(): array
    {
        return [
            'id' => 'string',
            'trip_id' => 'string',
            'seat_number' => 'string',
        ];
    }
     /**
     * Get the columns that should receive a unique identifier.
     *
     * @return array<int, string>
     */
    public function uniqueIds(): array
    {
        return ['id'];
    }

}
