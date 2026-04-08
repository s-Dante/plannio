import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, UserPlus, Check } from 'lucide-react';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';

export function SearchUsersModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [sentRequests, setSentRequests] = useState<number[]>([]);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        try {
            const res = await fetch(`/api/chats/search?q=${encodeURIComponent(query)}`);
            const data = await res.json();
            setResults(data);
        } catch (err) {
            toast.error("Error buscando usuarios");
        } finally {
            setLoading(false);
        }
    };

    const handleSendRequest = (userId: number) => {
        router.post('/chats/request', { friend_id: userId }, {
            onSuccess: () => {
                toast.success('Solicitud enviada correctamente');
                setSentRequests([...sentRequests, userId]);
            },
            onError: (errors) => {
                toast.error(errors.message || 'No se pudo enviar la solicitud');
            }
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md rounded-3xl bg-white dark:bg-stone-900 border-none p-0 overflow-hidden">
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        <UserPlus className="h-5 w-5 text-[var(--color-accent)]" />
                        Añadir Amigos
                    </DialogTitle>
                    <p className="text-xs text-gray-500 mt-1">Busca a personas por nombre o correo electrónico.</p>
                </DialogHeader>

                <div className="p-6 pt-2">
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input 
                                placeholder="Escribe el nombre o correo..." 
                                className="pl-9 h-11 rounded-xl bg-gray-50 dark:bg-stone-800"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                        </div>
                        <Button type="submit" className="h-11 rounded-xl" disabled={loading}>
                            Buscar
                        </Button>
                    </form>

                    <div className="mt-6 space-y-3 min-h-[250px] max-h-[300px] overflow-y-auto custom-scrollbar">
                        {loading && <p className="text-center text-sm text-gray-500 py-4">Buscando...</p>}
                        
                        {!loading && results.length === 0 && query && (
                            <p className="text-center text-sm text-gray-500 py-4">No se encontraron usuarios.</p>
                        )}
                        
                        {!loading && results.map((user) => (
                            <div key={user.id} className="flex items-center justify-between p-3 rounded-2xl border border-gray-100 dark:border-stone-800 hover:bg-gray-50 dark:hover:bg-stone-800/50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}`} className="h-10 w-10 rounded-full object-cover" alt={user.name} />
                                        {user.is_online && (
                                            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500"></span>
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm leading-tight">{user.name}</h4>
                                        <p className="text-xs text-gray-500">@{user.username}</p>
                                    </div>
                                </div>
                                
                                {sentRequests.includes(user.id) ? (
                                    <Button variant="ghost" className="h-8 rounded-lg text-green-600 bg-green-50 dark:bg-green-900/20" disabled>
                                        <Check className="h-4 w-4 mr-1" /> Enviado
                                    </Button>
                                ) : (
                                    <Button onClick={() => handleSendRequest(user.id)} size="sm" className="h-8 rounded-lg bg-[var(--color-accent)] hover:bg-[#829965]">
                                        Añadir
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
