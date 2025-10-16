import React, { useState } from 'react';
import { Database, Trash2, RefreshCw, CheckCircle, XCircle, Loader } from 'lucide-react';
import { seedDatabase, clearDatabase } from '../../utils/seedDatabase';

export default function DatabaseSeeder() {
  const [isSeeding, setIsSeeding] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  const handleSeed = async () => {
    setIsSeeding(true);
    setResult(null);

    try {
      const result = await seedDatabase();
      setResult(result);
    } catch (error) {
      setResult({ success: false, error });
    } finally {
      setIsSeeding(false);
    }
  };

  const handleClear = async () => {
    setIsClearing(true);
    setResult(null);

    try {
      const result = await clearDatabase();
      setResult(result);
      setShowConfirmClear(false);
    } catch (error) {
      setResult({ success: false, error });
    } finally {
      setIsClearing(false);
    }
  };

  const handleClearAndSeed = async () => {
    setIsClearing(true);
    setResult(null);

    try {
      await clearDatabase();
      const result = await seedDatabase();
      setResult(result);
      setShowConfirmClear(false);
    } catch (error) {
      setResult({ success: false, error });
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Database className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Datos de Prueba</h3>
          <p className="text-sm text-gray-500">Gestiona los datos de ejemplo en la base de datos</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={handleSeed}
            disabled={isSeeding || isClearing}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isSeeding ? (
              <>
                <Loader className="h-5 w-5 animate-spin" />
                <span>Insertando...</span>
              </>
            ) : (
              <>
                <RefreshCw className="h-5 w-5" />
                <span>Insertar Datos</span>
              </>
            )}
          </button>

          <button
            onClick={() => setShowConfirmClear(true)}
            disabled={isSeeding || isClearing}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <Trash2 className="h-5 w-5" />
            <span>Limpiar Datos</span>
          </button>

          <button
            onClick={handleClearAndSeed}
            disabled={isSeeding || isClearing}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isClearing ? (
              <>
                <Loader className="h-5 w-5 animate-spin" />
                <span>Procesando...</span>
              </>
            ) : (
              <>
                <Database className="h-5 w-5" />
                <span>Resetear BD</span>
              </>
            )}
          </button>
        </div>

        {result && (
          <div className={`p-4 rounded-lg ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <div className="flex items-start space-x-3">
              {result.success ? (
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <h4 className={`font-medium ${result.success ? 'text-green-900' : 'text-red-900'}`}>
                  {result.success ? '¡Operación Exitosa!' : 'Error en la Operación'}
                </h4>
                {result.success && result.data && (
                  <div className="mt-2 text-sm text-green-800">
                    <p>Datos insertados:</p>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      <li>{result.data.products} productos</li>
                      <li>{result.data.clientes} clientes</li>
                      <li>{result.data.lives} lives</li>
                      <li>{result.data.pedidos} pedidos con items</li>
                      <li>{result.data.baskets} baskets de lives</li>
                    </ul>
                  </div>
                )}
                {!result.success && (
                  <p className="mt-1 text-sm text-red-800">
                    {result.error?.message || 'Ocurrió un error al procesar la operación'}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Información</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• <strong>Insertar Datos:</strong> Agrega datos de ejemplo a la base de datos</li>
            <li>• <strong>Limpiar Datos:</strong> Elimina todos los datos de la base de datos</li>
            <li>• <strong>Resetear BD:</strong> Limpia y vuelve a insertar datos de ejemplo</li>
          </ul>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-amber-900 mb-2">⚠️ Advertencia</h4>
          <p className="text-sm text-amber-800">
            Estas operaciones afectan directamente la base de datos. La opción de limpiar datos
            eliminará TODOS los registros de forma permanente. Úsala con precaución.
          </p>
        </div>
      </div>

      {/* Modal de confirmación para limpiar */}
      {showConfirmClear && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">¿Limpiar Base de Datos?</h3>
                <p className="text-sm text-gray-500">Esta acción no se puede deshacer</p>
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-red-800">
                Se eliminarán TODOS los datos de productos, clientes, lives, pedidos y baskets.
                Esta acción es permanente y no se puede revertir.
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowConfirmClear(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleClear}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Sí, Limpiar Todo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
