import React, { useState, useEffect } from 'react';
import { Video, Plus, Calendar, DollarSign, Users, TrendingUp, Play, Pause, BarChart3, X } from 'lucide-react';
import { Trash2, AlertTriangle, Clock } from 'lucide-react';
import type { Live } from '../../types/database';
import { supabase } from '../../lib/supabaseClient';
import LiveDetailsModal from './LiveDetailsModal';
import EditLiveModal from './EditLiveModal';
import ActiveLiveModal from './ActiveLiveModal';

interface LivesManagerProps {
  onAddNotification: (notification: any) => void;
}

// Helper para generar UUID
const generateUUID = () => {
  return crypto.randomUUID();
};

// Helper function to check if manual start should be available (15 minutes before)
const canManuallyStart = (fechaHora: string): boolean => {
  const liveTime = new Date(fechaHora);
  const now = new Date();
  const fifteenMinutesBefore = new Date(liveTime.getTime() - 15 * 60 * 1000);
  return now >= fifteenMinutesBefore && now < liveTime;
};

// Helper function to get time until live starts
const getTimeUntilLive = (fechaHora: string): string => {
  const liveTime = new Date(fechaHora);
  const now = new Date();
  const diffMs = liveTime.getTime() - now.getTime();
  
  if (diffMs <= 0) return 'Iniciando...';
  
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  
  if (diffHours > 0) {
    return `${diffHours}h ${diffMinutes % 60}m`;
  } else {
    return `${diffMinutes}m`;
  }
};

export default function LivesManager({ onAddNotification }: LivesManagerProps) {
  const [showCrearLive, setShowCrearLive] = useState(false);
  const [selectedLive, setSelectedLive] = useState<string | null>(null);
  const [showLiveDetails, setShowLiveDetails] = useState(false);
  const [showEditLive, setShowEditLive] = useState(false);
  const [showActiveLive, setShowActiveLive] = useState(false);
  const [lives, setLives] = useState<(Live & { ventas_total: number; pedidos_count: number; estado: 'programado' | 'activo' | 'finalizado' })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // New live form state
  const [newLiveTitle, setNewLiveTitle] = useState('');
  const [newLiveDate, setNewLiveDate] = useState('');
  const [newLiveTime, setNewLiveTime] = useState('20:00');
  const [newLiveNotes, setNewLiveNotes] = useState('');
  
  // Delete confirmation state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [liveToDelete, setLiveToDelete] = useState<string | null>(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  const loadLives = async () => {
    try {
      setIsLoading(true);
      
      // Obtener todos los lives
      const { data: livesData, error: livesError } = await supabase
        .from('lives')
        .select('*')
        .order('fecha_hora', { ascending: false });

      if (livesError) throw livesError;

      // Para cada live, calcular ventas totales y cantidad de pedidos
      const livesWithStats = await Promise.all(
        (livesData || []).map(async (live) => {
          // Obtener baskets del live
          const { data: baskets } = await supabase
            .from('baskets')
            .select('total')
            .eq('live_id', live.live_id);

          // Obtener pedidos del live
          const { data: pedidos } = await supabase
            .from('pedidos')
            .select('pedido_id')
            .eq('live_id', live.live_id);

          const ventas_total = baskets?.reduce((sum, b) => sum + (b.total || 0), 0) || 0;
          const pedidos_count = pedidos?.length || 0;

          return {
            ...live,
            ventas_total,
            pedidos_count,
          };
        })
      );

      setLives(livesWithStats);
    } catch (error) {
      console.error('Error loading lives:', error);
      onAddNotification({
        title: 'Error',
        message: 'No se pudieron cargar los lives',
        type: 'error',
        read: false
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLives();
    const interval = setInterval(loadLives, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (amount: number) => `$${amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;
  
  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'programado':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'activo':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'finalizado':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'programado':
        return Calendar;
      case 'activo':
        return Play;
      case 'finalizado':
        return Pause;
      default:
        return Calendar;
    }
  };

  const handleViewDetails = (liveId: string) => {
    setSelectedLive(liveId);
    setShowLiveDetails(true);
  };

  const handleLiveClick = (live: any) => {
    setSelectedLive(live.live_id);
    
    switch (live.estado) {
      case 'finalizado':
        setShowLiveDetails(true);
        break;
      case 'programado':
        setShowEditLive(true);
        break;
      case 'activo':
        setShowActiveLive(true);
        break;
      default:
        break;
    }
  };

  const handleCreateLive = async () => {
    if (!newLiveTitle.trim()) {
      alert('El título es obligatorio');
      return;
    }

    if (!newLiveDate) {
      alert('La fecha es obligatoria');
      return;
    }

    try {
      // Combine date and time
      const fechaHora = new Date(`${newLiveDate}T${newLiveTime}`).toISOString();

      // Insertar en Supabase
      const { data, error } = await supabase
        .from('lives')
        .insert({
          titulo: newLiveTitle,
          fecha_hora: fechaHora,
          estado: 'programado',
          notas: newLiveNotes || null,
        })
        .select()
        .single();

      if (error) throw error;

      // Recargar lives
      await loadLives();

      // Add notification
      onAddNotification({
        title: 'Live Creado',
        message: `Nuevo live "${newLiveTitle}" programado exitosamente`,
        type: 'success',
        read: false
      });

      // Reset form and close modal
      setNewLiveTitle('');
      setNewLiveDate('');
      setNewLiveTime('20:00');
      setNewLiveNotes('');
      setShowCrearLive(false);
    } catch (error) {
      console.error('Error creating live:', error);
      onAddNotification({
        title: 'Error',
        message: 'No se pudo crear el live',
        type: 'error',
        read: false
      });
    }
  };

  const handleCancelCreateLive = () => {
    // Reset form and close modal
    setNewLiveTitle('');
    setNewLiveDate('');
    setNewLiveTime('20:00');
    setNewLiveNotes('');
    setShowCrearLive(false);
  };

  const handleDeleteClick = (liveId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setLiveToDelete(liveId);
    setShowDeleteModal(true);
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setLiveToDelete(null);
    setDeleteConfirmText('');
  };

  const handleDeleteConfirm = async () => {
    if (deleteConfirmText !== 'ELIMINAR' || !liveToDelete) {
      console.log('Delete confirmation failed:', { deleteConfirmText, liveToDelete });
      return;
    }

    try {
      const liveToDeleteData = lives.find(l => l.live_id === liveToDelete);

      // Verificar que el live esté programado
      if (liveToDeleteData?.estado !== 'programado') {
        onAddNotification({
          title: 'Error',
          message: 'Solo se pueden eliminar lives programados',
          type: 'error',
          read: false
        });
        handleDeleteCancel();
        return;
      }

      // Eliminar de Supabase
      const { error } = await supabase
        .from('lives')
        .delete()
        .eq('live_id', liveToDelete);

      if (error) throw error;

      // Recargar lives
      await loadLives();

      onAddNotification({
        title: 'Live Eliminado',
        message: `El live "${liveToDeleteData?.titulo || 'seleccionado'}" ha sido eliminado`,
        type: 'warning',
        read: false
      });

      // Cerrar modal
      handleDeleteCancel();
    } catch (error) {
      console.error('Error deleting live:', error);
      onAddNotification({
        title: 'Error',
        message: 'No se pudo eliminar el live',
        type: 'error',
        read: false
      });
    }
  };

  return (
    <div className="p-4 lg:p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lives</h1>
          <p className="text-gray-600 mt-1">Gestiona tus transmisiones en vivo y analiza su rendimiento</p>
        </div>
        
        <button 
          onClick={() => setShowCrearLive(true)}
          className="mt-4 lg:mt-0 bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors duration-200 flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Crear Live
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Lives Este Mes</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {lives.filter(l => {
                  const liveDate = new Date(l.fecha_hora);
                  const now = new Date();
                  return liveDate.getMonth() === now.getMonth() && liveDate.getFullYear() === now.getFullYear();
                }).length}
              </p>
            </div>
            <div className="p-3 rounded-full bg-red-100">
              <Video className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ventas en Lives</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {formatCurrency(lives.reduce((sum, l) => sum + l.ventas_total, 0))}
              </p>
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Promedio por Live</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {formatCurrency(
                  lives.length > 0 
                    ? lives.reduce((sum, l) => sum + l.ventas_total, 0) / lives.length 
                    : 0
                )}
              </p>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Pedidos</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {lives.reduce((sum, l) => sum + l.pedidos_count, 0)}
              </p>
            </div>
            <div className="p-3 rounded-full bg-amber-100">
              <TrendingUp className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Lives List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Historial de Lives</h3>
        </div>
        
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
            <p className="text-gray-500 mt-4">Cargando lives...</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {lives.map((live) => {
              const EstadoIcon = getEstadoIcon(live.estado);
              
              return (
                <div 
                  key={live.live_id} 
                  className="p-6 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                  onClick={() => handleLiveClick(live)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        {live.estado === 'activo' && (
                          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                        )}
                        <h4 className="text-lg font-medium text-gray-900">
                          {live.titulo || `Live #${live.live_id}`}
                        </h4>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getEstadoColor(live.estado)}`}>
                          <EstadoIcon className="h-3 w-3 inline mr-1" />
                          {live.estado.charAt(0).toUpperCase() + live.estado.slice(1)}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-3">{live.notas}</p>
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDateTime(live.fecha_hora)}</span>
                        </div>
                        {live.estado === 'programado' && (
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{getTimeUntilLive(live.fecha_hora)}</span>
                          </div>
                        )}
                        {live.estado === 'finalizado' && (
                          <>
                            <div className="flex items-center space-x-1">
                              <DollarSign className="h-4 w-4" />
                              <span>{formatCurrency(live.ventas_total)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Users className="h-4 w-4" />
                              <span>{live.pedidos_count} pedidos</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end space-y-2">
                      {live.estado === 'finalizado' && (
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-600">
                            {formatCurrency(live.ventas_total)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {live.pedidos_count} pedidos
                          </p>
                        </div>
                      )}
                      
                      <div className="flex space-x-2">
                        {live.estado === 'programado' && (
                          <>
                            {canManuallyStart(live.fecha_hora) && (
                              <button 
                                className="px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 transition-colors flex items-center"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleManualStart(live.live_id);
                                }}
                              >
                                <Play className="h-3 w-3 mr-1" />
                                Iniciar Ahora
                              </button>
                            )}
                            <button 
                              className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedLive(live.live_id);
                                setShowEditLive(true);
                              }}
                            >
                              Editar
                            </button>
                            <button 
                              className="px-3 py-1 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 transition-colors flex items-center"
                              onClick={(e) => handleDeleteClick(live.live_id, e)}
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              Eliminar
                            </button>
                          </>
                        )}
                        {live.estado === 'finalizado' && (
                          <button 
                            className="px-3 py-1 bg-gray-600 text-white rounded-md text-sm hover:bg-gray-700 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewDetails(live.live_id);
                            }}
                          >
                            Ver Detalles
                          </button>
                        )}
                        {live.estado === 'activo' && (
                          <button 
                            className="px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedLive(live.live_id);
                              setShowActiveLive(true);
                            }}
                          >
                            En Vivo
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Empty State */}
      {!isLoading && lives.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Video className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes Lives programados</h3>
          <p className="text-gray-500 mb-4">
            Crea tu primer Live para comenzar a vender en tiempo real
          </p>
          <button 
            onClick={() => setShowCrearLive(true)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors duration-200"
          >
            Crear Primer Live
          </button>
        </div>
      )}

      {/* Quick Live Creator Modal */}
      {showCrearLive && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Crear Nuevo Live</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título del Live
                </label>
                <input
                  type="text"
                  value={newLiveTitle}
                  onChange={(e) => setNewLiveTitle(e.target.value)}
                  placeholder="Ej: Nuevos Productos de Temporada"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha
                  </label>
                  <input
                    type="date"
                    value={newLiveDate}
                    onChange={(e) => setNewLiveDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hora
                  </label>
                  <input
                    type="time"
                    value={newLiveTime}
                    onChange={(e) => setNewLiveTime(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notas (opcional)
                </label>
                <textarea
                  rows={3}
                  value={newLiveNotes}
                  onChange={(e) => setNewLiveNotes(e.target.value)}
                  placeholder="Describe el contenido del live..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleCancelCreateLive}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateLive}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Crear Live
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live Details Modal */}
      <LiveDetailsModal
        isOpen={showLiveDetails}
        onClose={() => setShowLiveDetails(false)}
        liveId={selectedLive}
        lives={lives}
      />

      {/* Edit Live Modal */}
      <EditLiveModal
        isOpen={showEditLive}
        onClose={() => setShowEditLive(false)}
        liveId={selectedLive}
        lives={lives}
        onUpdateLive={async () => {
          await loadLives();
        }}
      />

      {/* Active Live Modal */}
      <ActiveLiveModal
        isOpen={showActiveLive}
        onClose={() => {
          setShowActiveLive(false);
          loadLives();
        }}
        liveId={selectedLive}
        onAddNotification={onAddNotification}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Confirmar Eliminación</h3>
              <button
                onClick={handleDeleteCancel}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* Content */}
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h4 className="text-lg font-medium text-gray-900">¿Eliminar Live?</h4>
                  <p className="text-sm text-gray-500">
                    {lives.find(l => l.live_id === liveToDelete)?.titulo || 'Live seleccionado'}
                  </p>
                </div>
              </div>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-red-800">
                  <strong>¡Atención!</strong> Esta acción no se puede deshacer. El live programado será eliminado permanentemente.
                </p>
              </div>
              
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Para confirmar, escribe <strong>ELIMINAR</strong> en el campo de abajo:
                </label>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Escribe ELIMINAR"
                />
              </div>
            </div>
            
            {/* Footer */}
            <div className="flex space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={handleDeleteCancel}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleteConfirmText.trim() !== 'ELIMINAR'}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar Live
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
