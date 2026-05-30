<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignUuid('trip_id')->constrained('trips')->onDelete('cascade');
            $table->foreignUuid('seat_id')->constrained('seats')->onDelete('cascade');
            $table->string('payment_ref')->unique();
            $table->string('payment_customer_id');
            $table->string('payment_gateway')->default('paystack'); // tracks which gateway was used
            $table->string('virtual_account_number');
            $table->decimal('amount_paid', 10, 2)->nullable();
            $table->enum('payment_status', ['pending','paid', 'expired']);
            $table->timestamp('booked_at')->nullable();
            $table->timestamp('expires_at');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
