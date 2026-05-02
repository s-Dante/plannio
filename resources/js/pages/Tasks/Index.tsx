import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { useState, useEffect } from 'react';
import { ClipboardList, Calendar, Clock, AlertCircle, Plus, LayoutDashboard, Users, User } from 'lucide-react';
import { toast } from 'sonner';
import { format, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { CreateTaskModal } from '@/components/create-task-modal';

export default function TasksIndex({ tasks, groups, statuses, priorities, auth }: any) {
    const [localTasks, setLocalTasks] = useState(tasks);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [filterGroup, setFilterGroup] = useState<number | 'personal' | null>(null);

    useEffect(() => {
        setLocalTasks(tasks);
    }, [tasks]);

    const columns = [
        { id: 1, title: 'Por Hacer', color: 'bg-gray-100 dark:bg-stone-800' },
        { id: 2, title: 'En Progreso', color: 'bg-blue-50 dark:bg-blue-900/20' },
        { id: 3, title: 'Completadas', color: 'bg-green-50 dark:bg-green-900/20' }
    ];

    const getPriorityColor = (priority: number) => {
        switch (priority) {
            case 1: return 'text-gray-500 bg-gray-100'; // Baja
            case 2: return 'text-blue-500 bg-blue-100'; // Media
            case 3: return 'text-orange-500 bg-orange-100'; // Alta
            case 4: return 'text-red-500 bg-red-100'; // Urgente
            default: return 'text-gray-500 bg-gray-100';
        }
    };

    const getPriorityLabel = (val: number) => priorities.find((p: any) => p.value === val)?.name || 'Media';

    // Manejo de Drag & Drop (HTML5 Nativo)
    const handleDragStart = (e: React.DragEvent, taskId: number) => {
        e.dataTransfer.setData('taskId', taskId.toString());
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault(); // Permitir el drop
    };

    const handleDrop = (e: React.DragEvent, newStatus: number) => {
        const taskId = parseInt(e.dataTransfer.getData('taskId'));
        const task = localTasks.find((t: any) => t.id === taskId);

        if (!task || task.status === newStatus) return;

        // Optimistic UI Update
        const updatedTasks = localTasks.map((t: any) => {
            if (t.id === taskId) {
                return { ...t, status: newStatus };
            }
            return t;
        });
        setLocalTasks(updatedTasks);

        // Backend Update
        router.put(`/tasks/${taskId}/status`, { status: newStatus }, {
            preserveScroll: true,
            onSuccess: () => {
                if (newStatus === 3 && task.status !== 3) {
                    toast.success('¡Tarea completada! Has ganado puntos.', { icon: '🎉' });
                }
            },
            onError: () => {
                toast.error('No se pudo actualizar la tarea');
                setLocalTasks(tasks); // Rollback
            }
        });
    };

    const renderGanttTimeline = (task: any) => {
        if (!task.start_date || !task.due_date) return null;
        
        const start = new Date(task.start_date);
        const end = new Date(task.due_date);
        const now = new Date();
        
        const totalDays = differenceInDays(end, start) || 1;
        const daysPassed = Math.max(0, differenceInDays(now, start));
        
        let percentage = Math.min(100, Math.max(0, (daysPassed / totalDays) * 100));
        if (task.status === 3) percentage = 100; // Completada

        const isOverdue = now > end && task.status !== 3;

        return (
            <div className="mt-3">
                <div className="flex justify-between text-xs mb-1 text-gray-500">
                    <span>{format(start, "d MMM", { locale: es })}</span>
                    <span className={isOverdue ? 'text-red-500 font-bold' : ''}>{format(end, "d MMM", { locale: es })}</span>
                </div>
                <div className="h-2 w-full bg-gray-200 dark:bg-stone-700 rounded-full overflow-hidden">
                    <div 
                        className={`h-full ${isOverdue ? 'bg-red-500' : 'bg-[var(--color-accent)]'} transition-all`} 
                        style={{ width: `${percentage}%` }}
                    ></div>
                </div>
            </div>
        );
    };

    return (
        <AppLayout>
            <Head title="Tareas y Actividades" />

            <div className="flex flex-col h-full bg-[#f6f7f9] dark:bg-stone-900 relative">
                
                {/* Cabecera */}
                <div className="px-8 py-6 border-b border-gray-200 dark:border-stone-800 bg-white/50 dark:bg-stone-900/50 backdrop-blur-md">
                    <div className="flex items-center justify-between max-w-7xl mx-auto">
                        <div>
                            <h1 className="text-2xl font-bold text-[#0D304A] dark:text-gray-100 flex items-center gap-2">
                                <LayoutDashboard className="h-6 w-6 text-[var(--color-accent)]" /> 
                                Panel de Actividades
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Organiza tus tareas personales y colaborativas.</p>
                        </div>
                        <button 
                            className="bg-[var(--color-accent)] hover:bg-[#829965] text-white px-4 py-2 rounded-xl shadow-sm flex items-center gap-2 transition-transform active:scale-95 font-semibold text-sm"
                            onClick={() => setIsCreateModalOpen(true)}
                        >
                            <Plus className="h-4 w-4" /> Nueva Tarea
                        </button>
                    </div>

                    {/* Filtros de Grupos */}
                    <div className="max-w-7xl mx-auto mt-6 flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                        <button 
                            onClick={() => setFilterGroup(null)}
                            className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-bold transition-all border ${filterGroup === null ? 'bg-[var(--color-accent)] text-white border-[var(--color-accent)] shadow-md' : 'bg-white dark:bg-stone-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-stone-700 hover:bg-gray-50'}`}
                        >
                            Todas las Tareas
                        </button>
                        <button 
                            onClick={() => setFilterGroup('personal')}
                            className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all border ${filterGroup === 'personal' ? 'bg-[var(--color-accent)] text-white border-[var(--color-accent)] shadow-md' : 'bg-white dark:bg-stone-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-stone-700 hover:bg-gray-50'}`}
                        >
                            <User className="h-4 w-4" /> Personales
                        </button>
                        {groups && groups.map((g: any) => (
                            <button 
                                key={g.id}
                                onClick={() => setFilterGroup(g.id)}
                                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all border ${filterGroup === g.id ? 'bg-[var(--color-accent)] text-white border-[var(--color-accent)] shadow-md' : 'bg-white dark:bg-stone-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-stone-700 hover:bg-gray-50'}`}
                            >
                                <img src={g.avatar || `https://ui-avatars.com/api/?name=${g.name}`} className="h-5 w-5 rounded-full object-cover" />
                                {g.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tablero Kanban */}
                <div className="flex-1 overflow-auto p-8">
                    <div className="flex gap-6 min-w-max max-w-7xl mx-auto items-start">
                        {columns.map(column => (
                            <div
                                key={column.id}
                                className={`w-80 rounded-2xl flex flex-col border border-gray-200 dark:border-stone-700/50 ${column.color}`}
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, column.id)}
                            >
                                <div className="p-4 font-bold text-gray-700 dark:text-gray-200 border-b border-gray-200/50 dark:border-stone-700/50 flex justify-between items-center bg-white/50 dark:bg-stone-800/50 rounded-t-2xl">
                                    {column.title}
                                    <span className="bg-white dark:bg-stone-700 px-2 py-0.5 rounded-full text-xs font-semibold text-gray-500 shadow-sm border border-gray-100 dark:border-stone-600">
                                        {localTasks.filter((t: any) => t.status === column.id && (filterGroup === 'personal' ? t.group_id === null : filterGroup ? t.group_id === filterGroup : true)).length}
                                    </span>
                                </div>

                                <div className="p-3 space-y-3">
                                    {localTasks.filter((t: any) => t.status === column.id && (filterGroup === 'personal' ? t.group_id === null : filterGroup ? t.group_id === filterGroup : true)).map((task: any) => (
                                        <div 
                                            key={task.id}
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, task.id)}
                                            className="bg-white dark:bg-stone-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-stone-700 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow group"
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider ${getPriorityColor(task.priority)}`}>
                                                    {getPriorityLabel(task.priority)}
                                                </span>
                                                {task.group && (
                                                    <span className="text-[10px] bg-purple-100 text-purple-600 px-2 py-1 rounded-md font-semibold truncate max-w-[100px]">
                                                        {task.group.name}
                                                    </span>
                                                )}
                                            </div>
                                            
                                            <h3 className={`font-bold text-[#0D304A] dark:text-gray-200 ${task.status === 3 ? 'line-through opacity-60' : ''}`}>
                                                {task.title}
                                            </h3>
                                            {task.description && (
                                                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{task.description}</p>
                                            )}

                                            {/* Pseudo Gantt Timeline */}
                                            {renderGanttTimeline(task)}

                                            {task.points_reward > 0 && task.status === 3 && (
                                                <div className="mt-3 text-xs font-bold text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded-lg inline-flex items-center gap-1">
                                                    ⭐ +{task.points_reward} pts
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    
                                    {localTasks.filter((t: any) => t.status === column.id && (filterGroup === 'personal' ? t.group_id === null : filterGroup ? t.group_id === filterGroup : true)).length === 0 && (
                                        <div className="h-24 flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-stone-700 rounded-xl">
                                            <span className="text-gray-400 text-sm font-medium">No hay tareas aquí</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <CreateTaskModal 
                    isOpen={isCreateModalOpen} 
                    onClose={() => setIsCreateModalOpen(false)} 
                />

            </div>
        </AppLayout>
    );
}
