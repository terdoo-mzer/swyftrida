<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\Trip;
use App\Models\User;
use App\Models\Seat;
use Override;

#[Fillable(['user_id', 'trip_id', 'seat_id', 'payment_ref', 'payment_customer_id', 'payment_gateway', 'virtual_account_number', 'amount_paid', 'payment_status', 'booked_at', 'expires_at'])]
#[Table(key:'id', keyType:'string', incrementing:false)]
class Booking extends Model
{
    use HasUuids;
    protected function casts () 
    {
        return [
            'amount_paid' => 'decimal:2',
            'booked_at' => 'datetime',
            'expires_at' => 'datetime',
            'payment_status' => 'string'
        ];
    }

    public function user (): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function seat(): BelongsTo
    {
        return $this->belongsTo(Seat::class);
    }

    public function trip(): BelongsTo
    {
        return $this->belongsTo(Trip::class);
    }

    #[Override]
    public function uniqueIds(): array
    {
        return ['id', 'trip_id', 'user_id', 'seat_id'];
    }
}
