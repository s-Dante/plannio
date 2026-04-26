import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';

interface CreateTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    groupId?: number | null;
}

export function CreateTaskModal({ isOpen, onClose, groupId = null }: CreateTaskModalProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState(2); // Media
    const [date, setDate] = useState<DateRange | undefined>({
        from: undefined,
        to: undefined,
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!title.trim()) {
            toast.error('El título de la tarea es requerido.');
            return;
        }

        setLoading(true);

        router.post('/tasks', {
            title,
            description,
            group_id: groupId,
            priority,
            start_date: date?.from ? format(date.from, 'yyyy-MM-dd') : null,
            due_date: date?.to ? format(date.to, 'yyyy-MM-dd') : null
        }, {
            onSuccess: () => {
                toast.success('Tarea creada exitosamente');
                onClose();
                setTitle('');
                setDescription('');
                setDate({ from: undefined, to: undefined });
                setPriority(2);
            },
            onError: (err) => {
                toast.error(err?.message || 'Error al crear la tarea');
            },
            onFinish: () => setLoading(false)
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-white dark:bg-stone-900 border-gray-200 dark:border-stone-800">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-[#0D304A] dark:text-gray-100">
                        Nueva Tarea {groupId ? 'del Grupo' : ''}
                    </DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div>
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Título</label>
                        <Input 
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Ej. Revisar diseño final..."
                            className="mt-1 dark:bg-stone-800"
                        />
                    </div>
                    
                    <div>
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Descripción (Opcional)</label>
                        <textarea 
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Detalles de la tarea..."
                            className="mt-1 w-full p-2 text-sm rounded-md border border-gray-300 dark:border-stone-700 bg-white dark:bg-stone-800 focus:ring-2 focus:ring-[var(--color-accent)] outline-none resize-none"
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Prioridad</label>
                            <select 
                                value={priority} 
                                onChange={(e) => setPriority(Number(e.target.value))}
                                className="mt-1 w-full p-2 h-10 rounded-md border border-gray-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-sm focus:ring-2 focus:ring-[var(--color-accent)] outline-none"
                            >
                                <option value={1}>Baja</option>
                                <option value={2}>Media</option>
                                <option value={3}>Alta</option>
                                <option value={4}>Urgente</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Rango de Fechas (Inicio y Entrega)</label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={`w-full justify-start text-left font-normal border-gray-300 dark:border-stone-700 dark:bg-stone-800 ${!date && "text-muted-foreground"}`}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {date?.from ? (
                                            date.to ? (
                                                <>
                                                    {format(date.from, "LLL dd, y", { locale: es })} -{" "}
                                                    {format(date.to, "LLL dd, y", { locale: es })}
                                                </>
                                            ) : (
                                                format(date.from, "LLL dd, y", { locale: es })
                                            )
                                        ) : (
                                            <span>Selecciona un rango de fechas</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        initialFocus
                                        mode="range"
                                        defaultMonth={date?.from}
                                        selected={date}
                                        onSelect={setDate}
                                        numberOfMonths={2}
                                        locale={es}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    <Button 
                        type="submit" 
                        className="w-full bg-[var(--color-accent)] hover:bg-[#829965] text-white font-bold"
                        disabled={loading}
                    >
                        {loading ? 'Creando...' : 'Crear Tarea'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
