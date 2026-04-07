<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

use App\Models\Group;
use App\Models\User;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('group_users', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Group::class, 'group_id');
            $table->foreignIdFor(User::class, 'user_id')->index('group_users_user_id_index');
            $table->integer('role')->default(0);
            $table->timestamp('joined_at')->useCurrent();
            $table->timestamp('left_at')->useCurrent();
            $table->unique(['group_id', 'user_id'], 'group_users_group_id_user_id_unique')->index('group_users_group_id_user_id_unique_index');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('group_users');
    }
};
