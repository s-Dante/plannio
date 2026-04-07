<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\Schema;

$tables = ['users', 'friends', 'groups', 'group_users', 'messages', 'message_reads', 'tasks', 'task_completitions', 'places', 'place_ratings', 'rewards', 'user_unlocked_rewards', 'calls', 'call_participants'];

$schema = [];
foreach($tables as $table) {
    if (!Schema::hasTable($table)) continue;
    $cols = Schema::getColumnListing($table);
    $types = [];
    foreach($cols as $c) {
        $types[$c] = Schema::getColumnType($table, $c);
    }
    $schema[$table] = $types;
}
echo json_encode($schema, JSON_PRETTY_PRINT);
