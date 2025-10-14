import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, FileText, Save } from 'lucide-react';
import type { Live } from '../../types/database';

interface EditLiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  liveId: string | null;
  lives: (Live & { ventas_total: number; pedidos_count: number; estado: 'programado' | 'activo' | 'finalizado' })[];
  onUpdateLive: (updatedLive: Partial<Live>) => void;
}

export default function EditLiveModal({ isOpen, onClose, liveId, lives, onUpdateLive }: EditLiveModalProps) {
  const [formData, setFormData] = useState({
    titulo: '',
    fecha_hora: '',
    notas: ''
  });

  const live = lives.find(l => l.live_id === liveId);

  useEffect(() => {
    if (live && isOpen) {
      const fechaHora = new Date(live.fecha_hora);
      const fecha = fechaHora.toISOString().split('T')[0];
      const hora = fechaHora.toTimeString().slice(0, 5);
      
      setFormData({
        titulo: live.titulo || '',
        fecha_hora: `${fecha}T${hora}`,
        notas: live.notas || ''
      });
    }
  }, [live, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.titulo.trim()) {
      alert('El título es obligatorio');
      return;
    }

    const updatedLive = {
      live_id: liveId!,
      titulo: formData.titulo,
      fecha_hora: new Date(formData.fecha_hora).toISOString(),
      notas: formData.notas,
      updated_at: new Date().toISOString()
    };

    onUpdateLive(updatedLive);
    onClose();
  };

  const handleClose = () => {
    setFormData({
      titulo: '',
      fecha_hora: '',
      notas: ''
    });
    onClose();
  };

  if (!isOpen || !live) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Editar Live</h2>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="h-4 w-4 inline mr-1" />
                Título del Live *
              </label>
              <input
                type="text"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Ej: Nuevos Productos de Temporada"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4 inline mr-1" />
                Fecha y Hora *
              </label>
              <input
                type="datetime-local"
                value={formData.fecha_hora}
                onChange={(e) => setFormData({ ...formData, fecha_hora: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notas (opcional)
              </label>
              <textarea
                rows={3}
                value={formData.notas}
                onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                placeholder="Describe el contenido del live..."
              />
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
          >
            <Save className="h-4 w-4 mr-2" />
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
}