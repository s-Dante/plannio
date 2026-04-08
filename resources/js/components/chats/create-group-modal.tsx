import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Users, Check } from 'lucide-react';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    friends: any[];
}

export function CreateGroupModal({ isOpen, onClose, friends }: Props) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);

    const toggleMember = (id: number) => {
        if (selectedMembers.includes(id)) {
            setSelectedMembers(selectedMembers.filter(m => m !== id));
        } else {
            setSelectedMembers([...selectedMembers, id]);
        }
    };

    const handleCreateGroup = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!name.trim()) {
            toast.error("El grupo debe tener un nombre.");
            return;
        }

        if (selectedMembers.length === 0) {
            toast.error("Debes seleccionar al menos a 1 amigo.");
            return;
        }

        setLoading(true);

        router.post('/chats/groups', {
            name,
            description,
            members: selectedMembers
        }, {
            onSuccess: () => {
                toast.success('Grupo creado exitosamente');
                setName('');
                setDescription('');
                setSelectedMembers([]);
                onClose();
            },
            onError: (errors) => {
                toast.error(errors.message || 'No se pudo crear el grupo');
            },
            onFinish: () => setLoading(false)
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md rounded-3xl bg-white dark:bg-stone-900 border-none p-0 overflow-hidden">
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        <Users className="h-5 w-5 text-[var(--color-accent)]" />
                        Nuevo Grupo
                    </DialogTitle>
                    <p className="text-xs text-gray-500 mt-1">Crea un chat grupal seleccionando a tus amigos.</p>
                </DialogHeader>

                <div className="p-6 pt-2">
                    <form onSubmit={handleCreateGroup} className="space-y-4">
                        <div className="space-y-1">
                            <Label>Nombre del Grupo</Label>
                            <Input 
                                placeholder="Ej: Viaje a la playa" 
                                className="h-10 rounded-xl bg-gray-50 dark:bg-stone-800"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-1">
                            <Label>Descripción <span className="opacity-50 font-normal">(Opcional)</span></Label>
                            <Input 
                                placeholder="Propósito del grupo..." 
                                className="h-10 rounded-xl bg-gray-50 dark:bg-stone-800"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>

                        <div className="pt-2">
                            <Label>Selecciona amigos ({selectedMembers.length} seleccionados)</Label>
                            <div className="mt-2 space-y-2 min-h-[150px] max-h-[220px] overflow-y-auto custom-scrollbar p-1">
                                {!friends || friends.length === 0 ? (
                                    <p className="text-center text-sm text-gray-500 py-4">No tienes amigos agregados aún para formar un grupo.</p>
                                ) : (
                                    friends.map((friend) => (
                                        <div 
                                            key={friend.id} 
                                            onClick={() => toggleMember(friend.id)}
                                            className={`flex items-center justify-between p-2 rounded-2xl border cursor-pointer hover:bg-gray-50 transition-colors ${selectedMembers.includes(friend.id) ? 'border-[var(--color-accent)] bg-gray-50/50 dark:bg-stone-800/80' : 'border-gray-100 dark:border-stone-800'}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <img src={friend.avatar || `https://ui-avatars.com/api/?name=${friend.name}`} className="h-8 w-8 rounded-full object-cover" />
                                                <div>
                                                    <h4 className="font-bold text-sm leading-tight">{friend.name}</h4>
                                                    <p className="text-xs text-gray-500">@{friend.username}</p>
                                                </div>
                                            </div>
                                            
                                            <div className={`h-5 w-5 rounded-md border flex items-center justify-center transition-colors ${selectedMembers.includes(friend.id) ? 'bg-[var(--color-accent)] border-[var(--color-accent)] text-white' : 'border-gray-300 dark:border-stone-600'}`}>
                                                {selectedMembers.includes(friend.id) && <Check className="h-3 w-3" />}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <Button 
                            type="submit" 
                            className="w-full h-11 rounded-xl bg-[var(--color-accent)] hover:bg-[#829965] mt-2" 
                            disabled={loading || selectedMembers.length === 0 || !name.trim()}
                        >
                            {loading ? 'Creando...' : 'Crear Grupo'}
                        </Button>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
