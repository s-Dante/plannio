<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

use App\Models\User;
use App\Models\Place;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('place_ratings', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Place::class, 'place_id');
            $table->foreignIdFor(User::class, 'user_id');
            $table->tinyInteger('rating')->unsigned()->min(1)->max(5);
            $table->text('comment')->nullable();
            $table->unique(['place_id', 'user_id'], 'place_ratings_user_unique');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('place_ratings');
    }
};
