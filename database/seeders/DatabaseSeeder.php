<?php

namespace Database\Seeders;

use App\Models\Call;
use App\Models\CallParticipant;
use App\Models\Friend;
use App\Models\Group;
use App\Models\GroupUser;
use App\Models\Message;
use App\Models\MessageRead;
use App\Models\Place;
use App\Models\PlaceRating;
use App\Models\Reward;
use App\Models\Task;
use App\Models\TaskCompletition;
use App\Models\User;
use App\Models\UserUnlockedReward;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Crear algunas recompenzas y usuarios
        $rewards = Reward::factory(20)->create();
        $users = User::factory(50)->create();

        // 2. Asignar recompenzas desbloqueadas y lugares
        foreach ($users as $user) {
            $userRewards = $rewards->random(rand(1, 3));
            foreach ($userRewards as $reward) {
                UserUnlockedReward::factory()->create([
                    'user_id' => $user->id,
                    'reward_id' => $reward->id,
                ]);
            }
        }

        // 3. Crear lugares
        $this->call(PlaceSeeder::class);
        $places = Place::factory(20)->create(function () use ($users) {
            return ['created_by' => $users->random()->id];
        });

        // 4. Crear valoraciones de lugares
        foreach ($places as $place) {
            $raters = $users->random(rand(2, 5));
            foreach ($raters as $rater) {
                PlaceRating::factory()->create([
                    'place_id' => $place->id,
                    'user_id' => $rater->id,
                ]);
            }
        }

        // 5. Crear amistades
        foreach ($users as $user) {
            $friends = $users->where('id', '!=', $user->id)->random(rand(1, 3));
            foreach ($friends as $friend) {
                // Evitar duplicar amistades
                $exists = Friend::where(function($q) use ($user, $friend) {
                    $q->where('user_id', $user->id)->where('friend_id', $friend->id);
                })->orWhere(function($q) use ($user, $friend) {
                    $q->where('user_id', $friend->id)->where('friend_id', $user->id);
                })->exists();

                if (!$exists) {
                    Friend::factory()->create([
                        'user_id' => $user->id,
                        'friend_id' => $friend->id,
                    ]);
                }
            }
        }

        // 6. Crear grupos y miembros
        $groups = Group::factory(10)->create(function () use ($users) {
            return ['created_by' => $users->random()->id];
        });

        foreach ($groups as $group) {
            $members = collect([$users->firstWhere('id', $group->created_by)]);
            $members = $members->merge($users->where('id', '!=', $group->created_by)->random(rand(2, 5)))->unique();

            foreach ($members as $member) {
                GroupUser::factory()->create([
                    'group_id' => $group->id,
                    'user_id' => $member->id,
                    'role' => $member->id === $group->created_by ? 2 : 1,
                ]);
            }

            // Crear mensajes
            $messages = Message::factory(rand(5, 15))->create([
                'group_id' => $group->id,
                'user_id' => $members->random()->id,
            ]);

            // Crear lecturas de mensajes
            foreach ($messages as $message) {
                $readers = $members->where('id', '!=', $message->user_id)->random(rand(1, $members->count() - 1));
                foreach ($readers as $reader) {
                    MessageRead::factory()->create([
                        'message_id' => $message->id,
                        'user_id' => $reader->id,
                    ]);
                }
            }

            // Crear tareas y completaciones
            $tasks = Task::factory(rand(1, 4))->create([
                'group_id' => $group->id,
                'user_id' => $members->random()->id,
            ]);

            foreach ($tasks as $task) {
                if ($task->is_completed) {
                    TaskCompletition::factory()->create([
                        'task_id' => $task->id,
                        'user_id' => $members->random()->id,
                    ]);
                }
            }

            // Crear llamadas (10% probabilidad)
            if (rand(1, 100) > 90) {
                $call = Call::factory()->create([
                    'group_id' => $group->id,
                    'caller_id' => $members->random()->id,
                ]);

                // Call participants
                foreach ($members->random(rand(1, $members->count())) as $participant) {
                    CallParticipant::factory()->create([
                        'call_id' => $call->id,
                        'user_id' => $participant->id,
                    ]);
                }
            }
        }
    }
}
