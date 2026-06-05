<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Carbon\Carbon;

class TripSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('trips')->insert([
            'id' => (string) Str::uuid(),
            'origin' => 'abuja',
            'destination' => 'lagos',
            'departure_time' => Carbon::tomorrow()->setTime(18, 0, 0), // Tomorrow at 8:00 AM
            'capacity' => 12,
            'price' => 40000,
            'status' => 'active',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}