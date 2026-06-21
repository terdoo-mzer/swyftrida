<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\concerns\HasUuids;

#[Fillable(['origin', 'destination', 'departure_time', 'capacity', 'price', 'status'])]
#[Table(key: 'uuid', keyType: 'string', incrementing: false)]
class Trip extends Model
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
            'origin' => 'string',
            'destination' => 'string',
            'departure_time' => 'datetime',
            'capacity' => 'integer',
            'price' => 'decimal:2',
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
