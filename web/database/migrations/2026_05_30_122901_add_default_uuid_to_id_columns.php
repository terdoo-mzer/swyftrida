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
        Schema::table('id_columns', function (Blueprint $table) {
            //
            DB::statement('ALTER TABLE users ALTER COLUMN id SET DEFAULT gen_random_uuid()');
            DB::statement('ALTER TABLE accounts ALTER COLUMN id SET DEFAULT gen_random_uuid()');
            DB::statement('ALTER TABLE trips ALTER COLUMN id SET DEFAULT gen_random_uuid()');
            DB::statement('ALTER TABLE seats ALTER COLUMN id SET DEFAULT gen_random_uuid()');
            DB::statement('ALTER TABLE bookings ALTER COLUMN id SET DEFAULT gen_random_uuid()');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('id_columns', function (Blueprint $table) {
            //
            DB::statement('ALTER TABLE users ALTER COLUMN id DROP DEFAULT');
            DB::statement('ALTER TABLE accounts ALTER COLUMN id DROP DEFAULT');
            DB::statement('ALTER TABLE trips ALTER COLUMN id DROP DEFAULT');
            DB::statement('ALTER TABLE seats ALTER COLUMN id DROP DEFAULT');
            DB::statement('ALTER TABLE bookings ALTER COLUMN id DROP DEFAULT');
        });
    }
};
