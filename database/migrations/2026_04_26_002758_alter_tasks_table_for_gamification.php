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
        Schema::table('tasks', function (Blueprint $table) {
            // Para que exista la opción de que las tareas sean personales
            $table->unsignedBigInteger('group_id')->nullable()->change();

            // Columnas de Kanban y Gantt
            $table->tinyInteger('status')->default(1)->after('description');
            $table->tinyInteger('priority')->default(1)->after('status');
            $table->timestamp('start_date')->nullable()->after('priority');
            $table->timestamp('due_date')->nullable()->after('start_date');

            // Columnas para Gamificación
            $table->integer('points_reward')->default(0)->after('is_completed');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->unsignedBigInteger('group_id')->nullable(false)->change();
            $table->dropColumn(['status', 'priority', 'start_date', 'due_date', 'points_reward']);
        });
    }
};
