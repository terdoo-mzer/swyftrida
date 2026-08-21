<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::statement("
            UPDATE bookings
            SET amount_expected = trips.price
            FROM trips
            WHERE bookings.trip_id = trips.id
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('bookings')
            ->update([
                'amount_expected' => null,
            ]);
    }
};