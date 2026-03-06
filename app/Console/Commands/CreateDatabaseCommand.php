<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Config;
use PDO;
use PDOException;

class CreateDatabaseCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:create-database';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Crea la base de datos MySQL definida en .env si es que esta no existe';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $database = Config::get('database.connections.mysql.database');
        $host = Config::get('database.connections.mysql.host');
        $port = Config::get('database.connections.mysql.port');
        $username = Config::get('database.connections.mysql.username');
        $password = Config::get('database.connections.mysql.password');
        $charset = Config::get('database.connection.mysql.charsert', 'utf8mb4');
        $collation = Config::get('database.connection.mysql.collation', 'utf8mb4_unicode_ci');

        if (!$database) {
            $this->error('Error: DB_DATABASE no esta configurado en el .env');
            return Command::FAILURE;
        }

        try {
            $pdo = new PDO(
                "mysql:host={$host};port={$port}",
                $username,
                $password
            );

            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            $query = "CREATE DATABASE IF NOT EXISTS `{$database}`CHARACTER SET $charset COLLATE $collation;";

            $pdo->exec($query);

            $this->info("Verificacion de base de datos completa: `{$database}`.");

            return Command::SUCCESS;

        } catch (PDOException $e) {
            $this->error("Fallo la conexion o creacion de la base de datos: " . $e->getMessage());
            return Command::FAILURE;
        }
    }
}
