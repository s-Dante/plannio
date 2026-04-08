<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Message;
use App\Models\Group;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Storage;
use App\Enums\MessageTypeEnum;
use App\Events\MessageSent;

class MessageController extends Controller
{
    /**
     * Retrieve messages for a specific chat group, decrypting if necessary.
     */
    public function index($groupId)
    {
        $group = Group::findOrFail($groupId);

        // Security check: ensure user is in group
        if (!$group->members()->where('user_id', auth()->id())->exists()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $messages = Message::with('user')
            ->where('group_id', $groupId)
            ->oldest() // Oldest first to render sequentially
            ->limit(100)
            ->get();

        // Transparent Decryption mapping
        $messages->transform(function ($message) {
            if ($message->is_encrypted && $message->content) {
                try {
                    $message->content = Crypt::decryptString($message->content);
                } catch (\Exception $e) {
                    $message->content = "⚠️ Mensaje Cifrado no disponible.";
                }
            }
            return $message;
        });

        return response()->json($messages);
    }

    /**
     * Store and encrypt a message, process media, and broadcast.
     */
    public function store(Request $request, $groupId)
    {
        $group = Group::findOrFail($groupId);

        if (!$group->members()->where('user_id', auth()->id())->exists()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $isEncrypted = $request->boolean('is_encrypted', true);
        $content = $request->input('content');
        $type = MessageTypeEnum::TEXT;
        $mediaUrl = null;
        $mimeType = null;
        $fileSize = null;
        
        $latitude = $request->input('latitude');
        $longitude = $request->input('longitude');

        if ($latitude && $longitude) {
            $type = MessageTypeEnum::LOCATION;
        }

        if ($content && $isEncrypted) {
            $content = Crypt::encryptString($content);
        }
        
        // Handle Media Attachment with Intervention Compress
        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $mimeType = $file->getMimeType();
            $fileSize = $file->getSize();

            if (str_starts_with($mimeType, 'image/')) {
                $type = MessageTypeEnum::IMAGE;
                $path = $file->storePublicly('chats/' . $groupId, 'public');
                $mediaUrl = Storage::url($path);
            } 
            elseif (str_starts_with($mimeType, 'video/')) {
                $type = MessageTypeEnum::VIDEO;
                $path = $file->storePublicly('chats/' . $groupId, 'public');
                $mediaUrl = Storage::url($path);
            }
            elseif (str_starts_with($mimeType, 'audio/')) {
                $type = MessageTypeEnum::AUDIO;
                $path = $file->storePublicly('chats/' . $groupId, 'public');
                $mediaUrl = Storage::url($path);
            }
            else {
                $type = MessageTypeEnum::FILE;
                $path = $file->storePublicly('chats/' . $groupId, 'public');
                $mediaUrl = Storage::url($path);
            }
        }

        $message = Message::create([
            'group_id' => $group->id,
            'user_id' => auth()->id(),
            'type' => $type,
            'content' => $content,
            'media_url' => $mediaUrl,
            'mime_type' => $mimeType,
            'file_size' => $fileSize,
            'latitude' => $latitude,
            'longitude' => $longitude,
            'is_encrypted' => $isEncrypted,
        ]);

        // Eager load for event relay
        $message->load('user');
        
        // We temporarily decrypt just for the Broadcast payload so the receiving client sees it natively
        if ($message->is_encrypted && $message->content) {
            try {
                $message->content = Crypt::decryptString($message->content);
            } catch (\Exception $e) { }
        }

        broadcast(new MessageSent($message))->toOthers();

        return response()->json($message);
    }
}
