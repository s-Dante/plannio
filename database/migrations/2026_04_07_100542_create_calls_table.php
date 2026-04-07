<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

use App\Models\Group;
use App\Models\User;

use App\Enums\CallStatusEnum;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('calls', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Group::class, 'group_id')->index('calls_group_id_foreign');
            $table->foreignIdFor(User::class, 'caller_id')->index('calls_caller_id_foreign');
            $table->integer('status')->default(CallStatusEnum::INITIATED->value);
            $table->timestamp('started_at')->nullable();
            $table->timestamp('ended_at')->nullable();
            $table->integer('duration')->nullable();
            $table->index(['caller_id', 'status'], 'calls_caller_id_status_index');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('calls');
    }
};
