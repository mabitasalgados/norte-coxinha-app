import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';

export function Kitchen() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();

    const subscription = supabase
      .channel('public:orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        fetchOrders();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  async function fetchOrders() {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          quantidade,
          products (nome)
        )
      `)
      .in('status', ['pago', 'preparando'])
      .order('created_at', { ascending: true });

    if (!error) {
      setOrders(data || []);
    }
    setLoading(false);
  }

  const updateStatus = async (orderId: string, status: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);

    if (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  if (loading) return <div className="p-8 text-center">Carregando pedidos...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Painel da Cozinha</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Novos Pedidos */}
        <div>
          <h2 className="text-xl font-bold text-blue-800 mb-4 bg-blue-100 p-3 rounded-lg">Novos Pedidos (Pagos)</h2>
          <div className="space-y-4">
            {orders.filter(o => o.status === 'pago').map(order => (
              <div key={order.id} className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-bold">#{order.id.slice(0, 5)}</span>
                  <span className="text-sm text-gray-500">{format(new Date(order.created_at), "HH:mm")}</span>
                </div>
                <ul className="mb-4 space-y-2">
                  {order.order_items?.map((item: any, idx: number) => (
                    <li key={idx} className="font-medium text-lg">
                      {item.quantidade}x {item.products?.nome}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => updateStatus(order.id, 'preparando')}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors"
                >
                  Iniciar Preparo
                </button>
              </div>
            ))}
            {orders.filter(o => o.status === 'pago').length === 0 && (
              <p className="text-gray-500 text-center py-4">Nenhum pedido novo.</p>
            )}
          </div>
        </div>

        {/* Preparando */}
        <div>
          <h2 className="text-xl font-bold text-orange-800 mb-4 bg-orange-100 p-3 rounded-lg">Em Preparo</h2>
          <div className="space-y-4">
            {orders.filter(o => o.status === 'preparando').map(order => (
              <div key={order.id} className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-bold">#{order.id.slice(0, 5)}</span>
                  <span className="text-sm text-gray-500">{format(new Date(order.created_at), "HH:mm")}</span>
                </div>
                <ul className="mb-4 space-y-2">
                  {order.order_items?.map((item: any, idx: number) => (
                    <li key={idx} className="font-medium text-lg">
                      {item.quantidade}x {item.products?.nome}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => updateStatus(order.id, 'pronto')}
                  className="w-full bg-green-600 text-white py-2 rounded-lg font-bold hover:bg-green-700 transition-colors"
                >
                  Marcar como Pronto
                </button>
              </div>
            ))}
            {orders.filter(o => o.status === 'preparando').length === 0 && (
              <p className="text-gray-500 text-center py-4">Nenhum pedido em preparo.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
