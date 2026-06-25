<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Booking;
use App\Models\Seat;

class BookingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $userId = '27ebb88c-241b-41b6-ac2f-fc20db76e904';

        // Trip 1: Lagos → Abuja, 26 Jun, 9 seats
        $trip1Id = '019ef3fe-8b99-73b6-ac7d-1d589439bf0b';

        // Trip 2: Abuja → Lagos, 26 Jun, 9 seats
        $trip2Id = '019ef3fe-9951-70f5-b0f8-db9887e73147';

        // Trip 3: Lagos → Abuja, 30 Jun, 10 seats
        $trip3Id = '019ef537-0028-72f7-bdfd-6441725d2c86';

        $bookings = [
            // Trip 1 — 4 paid bookings
            [
                'trip_id' => $trip1Id,
                'seat_number' => 1,
                'payment_status' => 'paid',
                'amount_paid' => 40000.00,
                'booked_at' => '2026-06-23 11:00:00',
                'expires_at' => '2026-06-23 11:15:00',
            ],
            [
                'trip_id' => $trip1Id,
                'seat_number' => 2,
                'payment_status' => 'paid',
                'amount_paid' => 40000.00,
                'booked_at' => '2026-06-23 11:30:00',
                'expires_at' => '2026-06-23 11:45:00',
            ],
            [
                'trip_id' => $trip1Id,
                'seat_number' => 3,
                'payment_status' => 'pending',
                'amount_paid' => null,
                'booked_at' => null,
                'expires_at' => '2026-06-23 12:15:00',
            ],
            [
                'trip_id' => $trip1Id,
                'seat_number' => 4,
                'payment_status' => 'expired',
                'amount_paid' => null,
                'booked_at' => null,
                'expires_at' => '2026-06-23 10:45:00',
            ],

            // Trip 2 — 3 paid bookings
            [
                'trip_id' => $trip2Id,
                'seat_number' => 1,
                'payment_status' => 'paid',
                'amount_paid' => 40000.00,
                'booked_at' => '2026-06-23 12:00:00',
                'expires_at' => '2026-06-23 12:15:00',
            ],
            [
                'trip_id' => $trip2Id,
                'seat_number' => 2,
                'payment_status' => 'paid',
                'amount_paid' => 40000.00,
                'booked_at' => '2026-06-23 12:30:00',
                'expires_at' => '2026-06-23 12:45:00',
            ],
            [
                'trip_id' => $trip2Id,
                'seat_number' => 3,
                'payment_status' => 'expired',
                'amount_paid' => null,
                'booked_at' => null,
                'expires_at' => '2026-06-23 11:30:00',
            ],

            // Trip 3 — 2 paid bookings
            [
                'trip_id' => $trip3Id,
                'seat_number' => 1,
                'payment_status' => 'paid',
                'amount_paid' => 10000.00,
                'booked_at' => '2026-06-23 17:00:00',
                'expires_at' => '2026-06-23 17:15:00',
            ],
            [
                'trip_id' => $trip3Id,
                'seat_number' => 2,
                'payment_status' => 'pending',
                'amount_paid' => null,
                'booked_at' => null,
                'expires_at' => '2026-06-23 17:30:00',
            ],
        ];

        foreach ($bookings as $data) {
            // Look up the seat by trip_id and seat_number
            $seat = Seat::where('trip_id', $data['trip_id'])
                ->where('seat_number', $data['seat_number'])
                ->first();

            if (!$seat) continue; // Skip if seat doesn't exist

            Booking::create([
                'user_id' => $userId,
                'trip_id' => $data['trip_id'],
                'seat_id' => $seat->id,
                'payment_status' => $data['payment_status'],
                'payment_customer_id' =>  'abcd_123',
                'virtual_account_number' => '123456890',
                'amount_paid' => $data['amount_paid'],
                'booked_at' => $data['booked_at'],
                'expires_at' => $data['expires_at'],
                'payment_ref' => 'TEST-REF-' . strtoupper(substr($data['trip_id'], 0, 13)) . '-' . $data['seat_number'],
                'payment_gateway' => 'paystack',
            ]);

        }
    }
}