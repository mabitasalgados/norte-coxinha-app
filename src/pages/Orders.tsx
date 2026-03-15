import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

export function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchOrders() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/app/login');
        return;
      }

      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            quantidade,
            preco,
            products (nome)
          )
        `)
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
      } else {
        setOrders(data || []);
      }
      setLoading(false);
    }

    fetchOrders();

    // Set up realtime subscription
    const subscription = supabase
      .channel('public:orders')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'orders' }, payload => {
        setOrders(current =>
          current.map(order =>
            order.id === payload.new.id ? { ...order, ...payload.new } : order
          )
        );
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [navigate]);

  if (loading) return <div className="p-8 text-center">Carregando pedidos...</div>;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente': return 'bg-yellow-100 text-yellow-800';
      case 'pago': return 'bg-blue-100 text-blue-800';
      case 'preparando': return 'bg-orange-100 text-orange-800';
      case 'pronto': return 'bg-green-100 text-green-800';
      case 'saiu_para_entrega': return 'bg-purple-100 text-purple-800';
      case 'entregue': return 'bg-gray-100 text-gray-800';
      case 'cancelado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pendente': return 'Pendente';
      case 'pago': return 'Pago';
      case 'preparando': return 'Preparando';
      case 'pronto': return 'Pronto';
      case 'saiu_para_entrega': return 'Saiu para Entrega';
      case 'entregue': return 'Entregue';
      case 'cancelado': return 'Cancelado';
      default: return status;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Meus Pedidos</h1>
      
      {orders.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <p className="text-gray-500">Você ainda não fez nenhum pedido.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl shadow-md p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 pb-4 border-b">
                <div>
                  <p className="text-sm text-gray-500">Pedido #{order.id.slice(0, 8)}</p>
                  <p className="text-sm text-gray-500">{format(new Date(order.created_at), "dd/MM/yyyy 'às' HH:mm")}</p>
                </div>
                <div className="mt-2 sm:mt-0">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                {order.order_items?.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{item.quantidade}x {item.products?.nome || 'Produto Indisponível'}</span>
                    <span>R$ {(item.preco * item.quantidade).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t">
                <span className="font-medium text-gray-900">Total</span>
                <span className="font-bold text-[#d62828] text-lg">R$ {order.valor_total.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
