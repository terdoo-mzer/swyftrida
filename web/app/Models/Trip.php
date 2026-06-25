<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\Booking;

#[Fillable(['origin', 'destination', 'departure_time', 'capacity', 'price', 'status'])]
#[Table(key: 'id', keyType: 'string', incrementing: false)]
class Trip extends Model
{
    use HasUuids;

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

    public function bookings (): HasMany
    {
        return $this->hasMany(Booking::class);
    }
}
