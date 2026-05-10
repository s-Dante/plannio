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
     * Recuperamos todos los mensajes de un grupo, descifrándolos si es necesario.
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
            ->oldest()
            ->limit(100)
            ->get();

        // Mapeamos para descifrar los mensajes
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
     * Guardamos y ciframos un mensaje, procesamos el archivo multimedia y lo enviamos por broadcast.
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

        // Manejamos que tipo de multimedia se sube
        //      Quiza debamos modificar para permitir envio de mas de un solo documento multimedia a la vez
        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $mimeType = $file->getMimeType();
            $fileSize = $file->getSize();

            // Usamos un uniqid para evitar colisiones, pero mantenemos el nombre original
            $originalName = $file->getClientOriginalName();
            $safeName = uniqid() . '_' . str_replace([' ', '#', '?', '&'], '_', $originalName);
            
            $extension = strtolower($file->getClientOriginalExtension());
            $audioExts = ['mp3', 'wav', 'ogg', 'm4a', 'aac', 'flac', 'weba'];
            $videoExts = ['mp4', 'mov', 'avi', 'webm', 'mkv', 'm4v'];

            if (in_array($extension, $audioExts) || str_starts_with($mimeType, 'audio/')) {
                $type = MessageTypeEnum::AUDIO;
            } elseif (in_array($extension, $videoExts) || str_starts_with($mimeType, 'video/')) {
                $type = MessageTypeEnum::VIDEO;
            } elseif (str_starts_with($mimeType, 'image/')) {
                $type = MessageTypeEnum::IMAGE;
            } else {
                $type = MessageTypeEnum::FILE;
            }
            
            $path = $file->storeAs('chats/' . $groupId, $safeName, 'public');
            $mediaUrl = Storage::url($path);
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

        $message->load('user');

        // Desciframos el mensaje para el payload del broadcast
        if ($message->is_encrypted && $message->content) {
            try {
                $message->content = Crypt::decryptString($message->content);
            } catch (\Exception $e) {
            }
        }

        broadcast(new MessageSent($message))->toOthers();

        return response()->json($message);
    }
}
