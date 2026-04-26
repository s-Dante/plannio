<?php

namespace App\Http\Controllers;

use App\Models\Reward;
use Illuminate\Http\Request;
use App\Enums\RewardTypeEnum;

class RewardController extends Controller
{
    public function index()
    {
        // En lugar de una vista entera, podríamos devolver JSON o pasarlo a Inertia
        $rewards = Reward::all();
        $unlocked = auth()->user()->unlockedRewards()->withPivot('is_equipped')->get();

        return response()->json([
            'rewards' => $rewards,
            'unlocked' => $unlocked
        ]);
    }

    public function toggleEquip(Request $request, Reward $reward)
    {
        $user = auth()->user();

        // Verificar si el usuario la tiene desbloqueada
        $unlockedReward = $user->unlockedRewards()->where('rewards.id', $reward->id)->first();

        if (!$unlockedReward) {
            return response()->json(['message' => 'No has desbloqueado esta recompensa'], 403);
        }

        $isEquipped = $unlockedReward->pivot->is_equipped;

        if ($isEquipped) {
            // Desequipar
            $user->unlockedRewards()->updateExistingPivot($reward->id, ['is_equipped' => false]);
            return back()->with('success', 'Recompensa desequipada.');
        } else {
            // Reglas para equipar
            if ($reward->type->value === RewardTypeEnum::FRAME->value) {
                // Desequipar el marco actual (solo puede haber 1)
                $currentFrame = $user->unlockedRewards()
                    ->wherePivot('is_equipped', true)
                    ->where('type', RewardTypeEnum::FRAME->value)
                    ->first();

                if ($currentFrame) {
                    $user->unlockedRewards()->updateExistingPivot($currentFrame->id, ['is_equipped' => false]);
                }
            } else if ($reward->type->value === RewardTypeEnum::BADGE->value) {
                // Verificar cuantas insignias tiene equipadas (máximo 3)
                $equippedBadgesCount = $user->unlockedRewards()
                    ->wherePivot('is_equipped', true)
                    ->where('type', RewardTypeEnum::BADGE->value)
                    ->count();

                if ($equippedBadgesCount >= 3) {
                    return back()->withErrors(['message' => 'Ya tienes 3 insignias equipadas. Desequipa una primero.']);
                }
            }

            // Equipar la nueva recompensa
            $user->unlockedRewards()->updateExistingPivot($reward->id, ['is_equipped' => true]);
            return back()->with('success', 'Recompensa equipada.');
        }
    }
}
