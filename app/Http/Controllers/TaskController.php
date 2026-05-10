<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Enums\TaskStatusEnum;
use App\Enums\TaskPriorityEnum;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // Obtenemos las tareas del usuario o de sus grupos
        $tasks = Task::where(function ($query) use ($user) {
            $query->where('user_id', $user->id)
                  ->whereNull('group_id');
        })->orWhereIn('group_id', $user->groups()->pluck('groups.id'))
          ->with(['group', 'completions'])
          ->orderBy('priority', 'desc')
          ->orderBy('created_at', 'desc')
          ->get();

        $groups = $user->groups()->with('members')->get()->map(function ($group) use ($user) {
            if ($group->is_individual) {
                $otherUser = $group->members->firstWhere('id', '!=', $user->id);
                if ($otherUser) {
                    $group->name = $otherUser->name . ' ' . $otherUser->father_lastname;
                    $group->avatar = $otherUser->avatar;
                }
            }
            return $group;
        });

        return Inertia::render('Tasks/Index', [
            'tasks' => $tasks,
            'groups' => $groups,
            'statuses' => TaskStatusEnum::cases(),
            'priorities' => TaskPriorityEnum::cases(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'group_id' => 'nullable|exists:groups,id',
            'priority' => 'required|integer',
            'start_date' => 'nullable|date',
            'due_date' => 'nullable|date',
        ]);

        $task = Task::create([
            ...$validated,
            'user_id' => $request->user()->id,
            'status' => TaskStatusEnum::TODO,
            'is_completed' => false,
        ]);

        return back()->with('success', 'Tarea creada exitosamente.');
    }

    public function updateStatus(Request $request, Task $task)
    {
        $validated = $request->validate([
            'status' => 'required|integer'
        ]);

        $task->status = TaskStatusEnum::from($validated['status']);
        
        // Si se mueve a DONE y no estaba completada, la marcamos como terminada
        if ($task->status === TaskStatusEnum::DONE && !$task->is_completed) {
            $task->markCompletedBy($request->user()->id);
        } else {
            // Si se mueve fuera de DONE, la reseteamos
            if ($task->status !== TaskStatusEnum::DONE && $task->is_completed) {
                $task->is_completed = false;
                $task->completed_at = null;
                $task->points_reward = 0;
            }
            $task->save();
        }

        return back();
    }

    public function destroy(Request $request, Task $task)
    {
        if ($task->user_id === $request->user()->id || ($task->group_id && $task->group->created_by === $request->user()->id())) {
            $task->delete();
            return back()->with('success', 'Tarea eliminada.');
        }

        abort(403);
    }
}
