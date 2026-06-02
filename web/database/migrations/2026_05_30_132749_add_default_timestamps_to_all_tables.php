<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('all_tables', function (Blueprint $table) {
            //
            DB::statement('ALTER TABLE users ALTER COLUMN created_at SET DEFAULT now()');
            DB::statement('ALTER TABLE accounts ALTER COLUMN created_at SET DEFAULT now()');
            DB::statement('ALTER TABLE trips ALTER COLUMN created_at SET DEFAULT now()');
            DB::statement('ALTER TABLE seats ALTER COLUMN created_at SET DEFAULT now()');
            DB::statement('ALTER TABLE bookings ALTER COLUMN created_at SET DEFAULT now()');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('all_tables', function (Blueprint $table) {
            //
                DB::statement('ALTER TABLE users ALTER COLUMN created_at DROP DEFAULT');
                DB::statement('ALTER TABLE accounts ALTER COLUMN created_at DROP DEFAULT');
                DB::statement('ALTER TABLE trips ALTER COLUMN created_at DROP DEFAULT');
                DB::statement('ALTER TABLE seats ALTER COLUMN created_at DROP DEFAULT');
                DB::statement('ALTER TABLE bookings ALTER COLUMN created_at DROP DEFAULT');
                
        });
    }
};
