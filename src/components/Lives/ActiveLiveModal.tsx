import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { X, Search, Plus, Power, PanelRightOpen, PanelRightClose } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import type { Live, BasketWithDetails, Product, Cliente, LiveStats } from '../../types/database';
import LiveStatsPanel from './LiveStatsPanel';
import BasketCard from './BasketCard';
import BasketDrawer from './BasketDrawer';
import ProductSidebar from './ProductSidebar';
import FinalizeLiveModal from './FinalizeLiveModal';

interface ActiveLiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  liveId: string | null;
  onAddNotification: (notification: any) => void;
}

export default function ActiveLiveModal({
  isOpen,
  onClose,
  liveId,
  onAddNotification,
}: ActiveLiveModalProps) {
  const [live, setLive] = useState<Live | null>(null);
  const [baskets, setBaskets] = useState<BasketWithDetails[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [stats, setStats] = useState<LiveStats>({
    facturacion_total: 0,
    canastas_activas: 0,
    productos_vendidos: 0,
  });

  const [selectedBasketId, setSelectedBasketId] = useState<string | null>(null);
  const [showBasketDrawer, setShowBasketDrawer] = useState(false);
  const [highlightedBasketId, setHighlightedBasketId] = useState<string | null>(null);

  const [showClienteSelector, setShowClienteSelector] = useState(false);
  const [clienteSearch, setClienteSearch] = useState('');

  const [showFinalizeModal, setShowFinalizeModal] = useState(false);
  const [isProcessingFinalization, setIsProcessingFinalization] = useState(false);

  const [basketSearch, setBasketSearch] = useState('');
  const [isProductSidebarOpen, setIsProductSidebarOpen] = useState(false);
  const [isDesktopLayout, setIsDesktopLayout] = useState(false);

  useEffect(() => {
    const handleLayoutChange = () => {
      if (typeof window === 'undefined') return;

      const isDesktop = window.innerWidth >= 640;
      setIsDesktopLayout(isDesktop);
      setIsProductSidebarOpen(isDesktop);
    };

    handleLayoutChange();
    window.addEventListener('resize', handleLayoutChange);

    return () => window.removeEventListener('resize', handleLayoutChange);
  }, []);

  const loadLiveData = useCallback(async () => {
    if (!liveId) return;

    const { data: liveData } = await supabase
      .from('lives')
      .select('*')
      .eq('live_id', liveId)
      .maybeSingle();

    if (liveData) {
      setLive(liveData);
    }

    const { data: basketsData } = await supabase
      .from('baskets')
      .select('*')
      .eq('live_id', liveId)
      .eq('estado', 'abierta');

    let basketsWithDetails: BasketWithDetails[] = [];

    if (basketsData) {
      const loadedBaskets: BasketWithDetails[] = [];

      for (const basket of basketsData) {
        const { data: cliente } = await supabase
          .from('clientes')
          .select('*')
          .eq('cliente_id', basket.cliente_id)
          .maybeSingle();

        const { data: items } = await supabase
          .from('basket_items')
          .select('*')
          .eq('basket_id', basket.basket_id);

        const itemsWithProducts = [];
        if (items) {
          for (const item of items) {
            const { data: product } = await supabase
              .from('products')
              .select('*')
              .eq('product_id', item.product_id)
              .maybeSingle();

            if (product) {
              itemsWithProducts.push({ ...item, product });
            }
          }
        }

        if (cliente) {
          loadedBaskets.push({
            ...basket,
            cliente,
            items: itemsWithProducts,
          });
        }
      }

      basketsWithDetails = loadedBaskets;
      setBaskets(basketsWithDetails);

      const totalRevenue = basketsWithDetails.reduce((sum, b) => sum + b.total, 0);
      const totalProducts = basketsWithDetails.reduce(
        (sum, b) => sum + b.items.reduce((itemSum, item) => itemSum + item.cantidad, 0),
        0
      );

      setStats({
        facturacion_total: totalRevenue,
        canastas_activas: basketsWithDetails.length,
        productos_vendidos: totalProducts,
      });
    }

    const { data: productsData } = await supabase.from('products').select('*').eq('activo', true);
    if (productsData) {
      const reservedQuantities = basketsWithDetails.reduce<Record<string, number>>((acc, basket) => {
        for (const item of basket.items) {
          acc[item.product_id] = (acc[item.product_id] || 0) + item.cantidad;
        }
        return acc;
      }, {});

      const productsWithAvailability = productsData.map((product) => {
        const reserved = reservedQuantities[product.product_id] || 0;
        const available = Math.max(product.cantidad_en_stock - reserved, 0);
        return {
          ...product,
          stockDisponible: available,
        };
      });

      setProducts(productsWithAvailability);
    }

    const { data: clientesData } = await supabase.from('clientes').select('*');
    if (clientesData) {
      setClientes(clientesData);
    }
  }, [liveId]);

  useEffect(() => {
    if (isOpen && liveId) {
      loadLiveData();
      const interval = setInterval(loadLiveData, 5000);
      return () => clearInterval(interval);
    }
  }, [isOpen, liveId, loadLiveData]);

  useEffect(() => {
    if (!isOpen) return;
    if (live && live.estado !== 'activo') {
      onClose();
    }
  }, [isOpen, live, onClose]);

  const handleOpenBasket = async (clienteId: string) => {
    if (!liveId) return;

    const existingBasket = baskets.find((b) => b.cliente_id === clienteId);

    if (existingBasket) {
      setHighlightedBasketId(existingBasket.basket_id);
      setTimeout(() => {
        setHighlightedBasketId(null);
        setSelectedBasketId(existingBasket.basket_id);
        setShowBasketDrawer(true);
      }, 800);
      return;
    }

    const { data: newBasket, error } = await supabase
      .from('baskets')
      .insert({
        live_id: liveId,
        cliente_id: clienteId,
        estado: 'abierta',
        subtotal: 0,
        total: 0,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating basket:', error);
      onAddNotification({
        title: 'Error',
        message: 'No se pudo crear la canasta',
        type: 'error',
        read: false,
      });
      return;
    }

    if (newBasket) {
      onAddNotification({
        title: 'Canasta Creada',
        message: 'Nueva canasta abierta exitosamente',
        type: 'success',
        read: false,
      });
      await loadLiveData();
      setShowClienteSelector(false);
      setClienteSearch('');
    }
  };

  const handleAddProduct = async (basketId: string, productId: string) => {
    const product = products.find((p) => p.product_id === productId);
    const availableStock = product ? product.stockDisponible ?? product.cantidad_en_stock : 0;
    if (!product || availableStock < 1) {
      onAddNotification({
        title: 'Stock Insuficiente',
        message: 'No hay stock disponible para este producto',
        type: 'warning',
        read: false,
      });
      return;
    }

    const basket = baskets.find((b) => b.basket_id === basketId);
    const existingItem = basket?.items.find((item) => item.product_id === productId);

    if (existingItem) {
      await handleUpdateQuantity(existingItem.basket_item_id, existingItem.cantidad + 1);
      return;
    }

    const { error: itemError } = await supabase.from('basket_items').insert({
      basket_id: basketId,
      product_id: productId,
      cantidad: 1,
      precio_unitario_snapshot: product.precio_unitario,
      costo_unitario_snapshot: product.costo_unitario,
      total_item: product.precio_unitario,
    });

    if (itemError) {
      console.error('Error adding product:', itemError);
      return;
    }

    await updateBasketTotals(basketId);
    await loadLiveData();

    onAddNotification({
      title: 'Producto Agregado',
      message: `${product.nombre} agregado a la canasta`,
      type: 'success',
      read: false,
    });
  };

  const handleUpdateQuantity = async (basketItemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      await handleRemoveItem(basketItemId);
      return;
    }

    const basket = baskets.find((b) =>
      b.items.some((item) => item.basket_item_id === basketItemId)
    );
    const item = basket?.items.find((item) => item.basket_item_id === basketItemId);

    if (!item) return;

    const product = products.find((p) => p.product_id === item.product_id);
    if (!product) {
      return;
    }

    const productAvailableStock = (product.stockDisponible ?? product.cantidad_en_stock) + item.cantidad;

    if (newQuantity > productAvailableStock) {
      onAddNotification({
        title: 'Stock Insuficiente',
        message: `Solo hay ${productAvailableStock} unidades disponibles`,
        type: 'warning',
        read: false,
      });
      return;
    }

    const newTotal = item.precio_unitario_snapshot * newQuantity;

    await supabase
      .from('basket_items')
      .update({
        cantidad: newQuantity,
        total_item: newTotal,
      })
      .eq('basket_item_id', basketItemId);

    if (basket) {
      await updateBasketTotals(basket.basket_id);
    }

    await loadLiveData();
  };

  const handleRemoveItem = async (basketItemId: string) => {
    const basket = baskets.find((b) =>
      b.items.some((item) => item.basket_item_id === basketItemId)
    );

    await supabase.from('basket_items').delete().eq('basket_item_id', basketItemId);

    if (basket) {
      await updateBasketTotals(basket.basket_id);
    }

    await loadLiveData();

    onAddNotification({
      title: 'Producto Eliminado',
      message: 'Producto removido de la canasta',
      type: 'info',
      read: false,
    });
  };

  const updateBasketTotals = async (basketId: string) => {
    const { data: items } = await supabase
      .from('basket_items')
      .select('total_item')
      .eq('basket_id', basketId);

    const total = items?.reduce((sum, item) => sum + item.total_item, 0) || 0;

    await supabase
      .from('baskets')
      .update({
        subtotal: total,
        total: total,
      })
      .eq('basket_id', basketId);
  };

  const handleAddNewProduct = async (productData: {
    nombre: string;
    precio_unitario: number;
    cantidad_en_stock: number;
  }) => {
    const { error } = await supabase.from('products').insert({
      nombre: productData.nombre,
      categoria: 'General',
      precio_unitario: productData.precio_unitario,
      costo_unitario: productData.precio_unitario * 0.5,
      cantidad_en_stock: productData.cantidad_en_stock,
      activo: true,
    });

    if (error) {
      console.error('Error adding product:', error);
      onAddNotification({
        title: 'Error',
        message: 'No se pudo agregar el producto',
        type: 'error',
        read: false,
      });
      return;
    }

    await loadLiveData();

    onAddNotification({
      title: 'Producto Agregado',
      message: `${productData.nombre} agregado al inventario`,
      type: 'success',
      read: false,
    });
  };

  const handleFinalizeLive = async () => {
    if (!liveId) return;

    setIsProcessingFinalization(true);

    try {
      for (const basket of baskets) {
        const { data: pedido, error: pedidoError } = await supabase
          .from('pedidos')
          .insert({
            cliente_id: basket.cliente_id,
            live_id: liveId,
            estado: 'Pendiente',
            subtotal: basket.subtotal,
            impuestos: 0,
            total: basket.total,
            empleado: 'Sistema',
            notas: `Pedido generado desde Live: ${live?.titulo || liveId}`,
          })
          .select()
          .single();

        if (pedidoError || !pedido) {
          throw new Error(`Error creando pedido para cliente ${basket.cliente_id}`);
        }

        for (const item of basket.items) {
          await supabase.from('pedido_items').insert({
            pedido_id: pedido.pedido_id,
            product_id: item.product_id,
            cantidad: item.cantidad,
            precio_unitario_snapshot: item.precio_unitario_snapshot,
            costo_unitario_snapshot: item.costo_unitario_snapshot,
            total_item: item.total_item,
          });

          await supabase.rpc('update_product_stock', {
            p_product_id: item.product_id,
            p_quantity: -item.cantidad,
          });
        }

        await supabase
          .from('baskets')
          .update({ estado: 'finalizada' })
          .eq('basket_id', basket.basket_id);
      }

      await supabase.from('lives').update({ estado: 'finalizado' }).eq('live_id', liveId);

      onAddNotification({
        title: 'Live Finalizado',
        message: `${baskets.length} pedidos creados exitosamente`,
        type: 'success',
        read: false,
      });

      setShowFinalizeModal(false);
      onClose();
    } catch (error) {
      console.error('Error finalizing live:', error);
      onAddNotification({
        title: 'Error',
        message: 'No se pudo finalizar el Live. Intenta nuevamente.',
        type: 'error',
        read: false,
      });
    } finally {
      setIsProcessingFinalization(false);
    }
  };

  const filteredClientes = clientes.filter(
    (cliente) =>
      cliente.nombre.toLowerCase().includes(clienteSearch.toLowerCase()) ||
      cliente.telefono_whatsapp.includes(clienteSearch)
  );

  const filteredBaskets = baskets.filter((basket) =>
    basket.cliente.nombre.toLowerCase().includes(basketSearch.toLowerCase())
  );

  const suggestedProducts = useMemo(() => {
    const salesMap = new Map<
      string,
      { product: Product; quantity: number; lastAdded: number }
    >();

    baskets.forEach((basket) => {
      basket.items.forEach((item) => {
        const productFromInventory = products.find(
          (inventoryProduct) => inventoryProduct.product_id === item.product_id
        );
        const product = productFromInventory ?? item.product;
        if (!product) return;
        const available = productFromInventory?.stockDisponible ?? product.cantidad_en_stock;
        if (available < 1) return;

        const existingEntry = salesMap.get(product.product_id);
        const itemCreatedAt = item.created_at
          ? new Date(item.created_at).getTime()
          : 0;

        if (existingEntry) {
          existingEntry.quantity += item.cantidad;
          existingEntry.lastAdded = Math.max(existingEntry.lastAdded, itemCreatedAt);
        } else {
          salesMap.set(product.product_id, {
            product,
            quantity: item.cantidad,
            lastAdded: itemCreatedAt,
          });
        }
      });
    });

    const topSelling = Array.from(salesMap.values())
      .sort((a, b) => {
        if (b.quantity === a.quantity) {
          return b.lastAdded - a.lastAdded;
        }
        return b.quantity - a.quantity;
      })
      .map((entry) => entry.product);

    const recentProducts = [...products]
      .filter((product) => (product.stockDisponible ?? product.cantidad_en_stock) > 0)
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

    const combined: Product[] = [];
    [...topSelling, ...recentProducts].forEach((product) => {
      if (!product) return;
      if (!combined.some((p) => p.product_id === product.product_id)) {
        combined.push(product);
      }
    });

    return combined.slice(0, 5);
  }, [baskets, products]);

  const selectedBasket = baskets.find((b) => b.basket_id === selectedBasketId);

  if (!isOpen || !live) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center">
        <div className="bg-white w-full h-full flex flex-col overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-green-50">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  EN VIVO: {live.titulo || `Live #${live.live_id}`}
                </h2>
                <p className="text-sm text-gray-600">Gestión de ventas en tiempo real</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() =>
                  setIsProductSidebarOpen((prev) => (isDesktopLayout ? prev : !prev))
                }
                className="sm:hidden px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                {isProductSidebarOpen ? (
                  <PanelRightClose className="h-4 w-4" />
                ) : (
                  <PanelRightOpen className="h-4 w-4" />
                )}
                <span>{isProductSidebarOpen ? 'Ocultar catálogo' : 'Ver catálogo'}</span>
              </button>
              <button
                onClick={() => setShowFinalizeModal(true)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
              >
                <Power className="h-4 w-4" />
                <span>Finalizar Live</span>
              </button>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="flex flex-1 overflow-hidden flex-col sm:flex-row">
            <div className="flex-1 flex flex-col p-6 overflow-y-auto">
              <LiveStatsPanel stats={stats} />

              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Canastas Activas ({baskets.length})
                </h3>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Buscar canasta..."
                      value={basketSearch}
                      onChange={(e) => setBasketSearch(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <button
                    onClick={() => setShowClienteSelector(true)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Abrir Canasta</span>
                  </button>
                </div>
              </div>

              {filteredBaskets.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <Plus className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium">No hay canastas activas</p>
                    <p className="text-sm mt-2">
                      Abre una canasta para comenzar a agregar productos
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredBaskets.map((basket) => (
                    <BasketCard
                      key={basket.basket_id}
                      basket={basket}
                      onOpenBasket={(basketId) => {
                        setSelectedBasketId(basketId);
                        setShowBasketDrawer(true);
                      }}
                      suggestedProducts={suggestedProducts}
                      onQuickAdd={(basketId, productId) =>
                        handleAddProduct(basketId, productId)
                      }
                      isHighlighted={basket.basket_id === highlightedBasketId}
                    />
                  ))}
                </div>
              )}
            </div>

            {!isDesktopLayout && (
              <div
                className={`fixed inset-0 bg-black/40 transition-opacity duration-300 ${
                  isProductSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                } sm:hidden z-40`}
                onClick={() => setIsProductSidebarOpen(false)}
              />
            )}
            <ProductSidebar
              products={products}
              onAddNewProduct={handleAddNewProduct}
              isOpen={isDesktopLayout || isProductSidebarOpen}
              onClose={() => setIsProductSidebarOpen(false)}
            />
          </div>
        </div>
      </div>

      {showClienteSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Seleccionar Cliente</h3>

            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Buscar cliente..."
                value={clienteSearch}
                onChange={(e) => setClienteSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                autoFocus
              />
            </div>

            <div className="max-h-80 overflow-y-auto space-y-2">
              {filteredClientes.slice(0, 10).map((cliente) => (
                <button
                  key={cliente.cliente_id}
                  onClick={() => handleOpenBasket(cliente.cliente_id)}
                  className="w-full p-3 text-left hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors"
                >
                  <div className="font-medium text-gray-900">{cliente.nombre}</div>
                  <div className="text-sm text-gray-500">{cliente.telefono_whatsapp}</div>
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                setShowClienteSelector(false);
                setClienteSearch('');
              }}
              className="w-full mt-4 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      <BasketDrawer
        isOpen={showBasketDrawer}
        onClose={() => {
          setShowBasketDrawer(false);
          setSelectedBasketId(null);
        }}
        basket={selectedBasket || null}
        products={products}
        onAddProduct={handleAddProduct}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />

      <FinalizeLiveModal
        isOpen={showFinalizeModal}
        onClose={() => setShowFinalizeModal(false)}
        onConfirm={handleFinalizeLive}
        baskets={baskets}
        totalRevenue={stats.facturacion_total}
        isProcessing={isProcessingFinalization}
      />
    </>
  );
}
