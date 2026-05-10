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
        Schema::table('user_unlocked_rewards', function (Blueprint $table) {
            $table->boolean('is_equipped')->default(false)->after('reward_id');
            $table->index(['user_id', 'is_equipped']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('user_unlocked_rewards', function (Blueprint $table) {
            $table->dropIndex(['user_id', 'is_equipped']);
            $table->dropColumn('is_equipped');
        });
    }
};
