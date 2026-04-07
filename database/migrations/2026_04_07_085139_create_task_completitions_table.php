<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

use App\Models\Task;
use App\Models\User;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('task_completitions', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Task::class, 'task_id');
            $table->foreignIdFor(User::class, 'user_id');
            $table->timestamp('completed_at');
            $table->unique(['task_id', 'user_id'], 'task_completitions_user_unique');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('task_completitions');
    }
};
