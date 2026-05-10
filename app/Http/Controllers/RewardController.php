<?php

namespace App\Http\Controllers;

use App\Models\Reward;
use Illuminate\Http\Request;
use App\Enums\RewardTypeEnum;

class RewardController extends Controller
{
    public function index(Request $request)
    {
        $rewards = Reward::all();
        $unlocked = $request->user()->unlockedRewards()->withPivot('is_equipped')->get();

        return response()->json([
            'rewards' => $rewards,
            'unlocked' => $unlocked
        ]);
    }

    public function toggleEquip(Request $request, Reward $reward)
    {
        $user = $request->user();

        // Obtenemos la recompensa
        $unlockedReward = $user->unlockedRewards()->where('rewards.id', $reward->id)->first();

        // Verificamos que el usuario la haya desbloqueado
        if (!$unlockedReward) {
            return response()->json(['message' => 'No has desbloqueado esta recompensa'], 403);
        }

        $isEquipped = $unlockedReward->pivot->is_equipped;

        if ($isEquipped) {
            // Desequipar recompensa
            $user->unlockedRewards()->updateExistingPivot($reward->id, ['is_equipped' => false]);
            return back()->with('success', 'Recompensa desequipada.');
        } else {
            if ($reward->type->value === RewardTypeEnum::FRAME->value) {
                $currentFrame = $user->unlockedRewards()
                    ->wherePivot('is_equipped', true)
                    ->where('type', RewardTypeEnum::FRAME->value)
                    ->first();

                if ($currentFrame) {
                    $user->unlockedRewards()->updateExistingPivot($currentFrame->id, ['is_equipped' => false]);
                }
            } else if ($reward->type->value === RewardTypeEnum::BADGE->value) {
                $equippedBadgesCount = $user->unlockedRewards()
                    ->wherePivot('is_equipped', true)
                    ->where('type', RewardTypeEnum::BADGE->value)
                    ->count();

                if ($equippedBadgesCount >= 3) {
                    return back()->withErrors(['message' => 'Ya tienes 3 insignias equipadas. Desequipa una primero.']);
                }
            }

            $user->unlockedRewards()->updateExistingPivot($reward->id, ['is_equipped' => true]);
            return back()->with('success', 'Recompensa equipada.');
        }
    }
}
