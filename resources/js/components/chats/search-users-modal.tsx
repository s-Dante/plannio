import { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, UserPlus, Check, ChevronLeft, ChevronRight, Users, Loader2 } from 'lucide-react';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';

export function SearchUsersModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [sentRequests, setSentRequests] = useState<number[]>([]);

    // Paginacion de usuarios si aun no busca
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [isSearchMode, setIsSearchMode] = useState(false);

    // Cargamos todos los usuarios al abrir el modal
    const loadAllUsers = useCallback(async (p = 1) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/chats/users?page=${p}`);
            const data = await res.json();
            setResults(data.data);
            setPage(data.current_page);
            setLastPage(data.last_page);
            setTotal(data.total);
        } catch {
            toast.error('Error cargando usuarios');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (isOpen) {
            setQuery('');
            setIsSearchMode(false);
            loadAllUsers(1);
        }
    }, [isOpen, loadAllUsers]);

    // Buscamos por nombre y apellido
    useEffect(() => {
        if (!query.trim()) {
            if (isSearchMode) {
                setIsSearchMode(false);
                loadAllUsers(1);
            }
            return;
        }
        setIsSearchMode(true);
        const timer = setTimeout(async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/chats/search?q=${encodeURIComponent(query)}`);
                const data = await res.json();
                setResults(data);
            } catch {
                toast.error('Error buscando usuarios');
            } finally {
                setLoading(false);
            }
        }, 350);
        return () => clearTimeout(timer);
    }, [query]);

    const handleSendRequest = (userId: number) => {
        router.post('/chats/request', { friend_id: userId }, {
            onSuccess: () => {
                toast.success('Solicitud enviada correctamente');
                setSentRequests(prev => [...prev, userId]);
            },
            onError: (errors) => {
                toast.error(errors.message || 'No se pudo enviar la solicitud');
            }
        });
    };

    const handlePageChange = (newPage: number) => {
        loadAllUsers(newPage);
    };

    const getButtonState = (user: any) => {
        if (sentRequests.includes(user.id)) return 'sent';
        if (user.friendship_status === 2) return 'friends';
        if (user.friendship_status === 1) return 'pending';
        return 'none';
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md rounded-3xl bg-white dark:bg-stone-900 border-none p-0 overflow-hidden">
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        <UserPlus className="h-5 w-5 text-[var(--color-accent)]" />
                        Añadir Amigos
                    </DialogTitle>
                    <p className="text-xs text-gray-500 mt-1">
                        {isSearchMode
                            ? `Resultados para "${query}"`
                            : `${total} usuarios en la plataforma`
                        }
                    </p>
                </DialogHeader>

                <div className="p-6 pt-2">
                    {/* Barra de búsqueda */}
                    <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Busca por nombre, usuario o correo..."
                            className="pl-9 h-11 rounded-xl bg-gray-50 dark:bg-stone-800"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>

                    {/* Lista de usuarios */}
                    <div className="space-y-2 min-h-[280px] max-h-[320px] overflow-y-auto custom-scrollbar">
                        {loading && (
                            <div className="flex items-center justify-center py-10">
                                <Loader2 className="h-6 w-6 animate-spin text-[var(--color-accent)]" />
                            </div>
                        )}

                        {!loading && results.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                                <Users className="h-10 w-10 mb-2 opacity-30" />
                                <p className="text-sm">
                                    {isSearchMode ? 'No se encontraron usuarios.' : 'No hay otros usuarios aún.'}
                                </p>
                            </div>
                        )}

                        {!loading && results.map((user) => {
                            const btnState = getButtonState(user);
                            return (
                                <div
                                    key={user.id}
                                    className="flex items-center justify-between p-3 rounded-2xl border border-gray-100 dark:border-stone-800 hover:bg-gray-50 dark:hover:bg-stone-800/50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <img
                                                src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`}
                                                className="h-10 w-10 rounded-full object-cover"
                                                alt={user.name}
                                            />
                                            {user.is_online && (
                                                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white dark:border-stone-900 bg-green-500" />
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm leading-tight">
                                                {user.name} {user.father_lastname}
                                            </h4>
                                            <p className="text-xs text-gray-500">@{user.username}</p>
                                        </div>
                                    </div>

                                    {btnState === 'friends' && (
                                        <Button variant="ghost" className="h-8 rounded-lg text-[var(--color-accent)] bg-[var(--color-accent)]/10" disabled>
                                            <Check className="h-4 w-4 mr-1" /> Amigos
                                        </Button>
                                    )}
                                    {btnState === 'pending' && (
                                        <Button variant="ghost" className="h-8 rounded-lg text-gray-500 bg-gray-100 dark:bg-stone-700" disabled>
                                            Pendiente
                                        </Button>
                                    )}
                                    {btnState === 'sent' && (
                                        <Button variant="ghost" className="h-8 rounded-lg text-green-600 bg-green-50 dark:bg-green-900/20" disabled>
                                            <Check className="h-4 w-4 mr-1" /> Enviado
                                        </Button>
                                    )}
                                    {btnState === 'none' && (
                                        <Button
                                            onClick={() => handleSendRequest(user.id)}
                                            size="sm"
                                            className="h-8 rounded-lg bg-[var(--color-accent)] hover:bg-[#829965]"
                                        >
                                            Añadir
                                        </Button>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Paginación */}
                    {!isSearchMode && lastPage > 1 && (
                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-stone-800">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handlePageChange(page - 1)}
                                disabled={page <= 1 || loading}
                                className="h-8 rounded-xl"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <span className="text-xs text-gray-500 font-semibold">
                                Página {page} de {lastPage}
                            </span>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handlePageChange(page + 1)}
                                disabled={page >= lastPage || loading}
                                className="h-8 rounded-xl"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
