import React, { useState, useEffect } from 'react';
import { useCartStore } from '@/store/cart';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';

export function Checkout() {
  const { items, getTotal, clearCart } = useCartStore();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [complemento, setComplemento] = useState('');
  const [formaPagamento, setFormaPagamento] = useState('pix');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function checkUser() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/app/login');
      } else {
        setUser(session.user);
        
        // Verifica se o usuário tem registro na tabela public.users
        const { data: userProfile } = await supabase
          .from('users')
          .select('id')
          .eq('id', session.user.id)
          .single();
          
        // Se não tiver (por erro de RLS no cadastro), tenta inserir
        if (!userProfile) {
          await supabase.from('users').insert({
            id: session.user.id,
            nome: session.user.user_metadata?.nome || 'Usuário',
            email: session.user.email,
            telefone: session.user.user_metadata?.telefone || '',
          });
        }
      }
      setLoading(false);
    }
    checkUser();
  }, [navigate]);

  if (loading) return <div className="p-8 text-center">Carregando...</div>;
  if (items.length === 0) {
    navigate('/app/carrinho');
    return null;
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rua || !numero || !bairro || !cidade) {
      setMessage('Por favor, preencha todos os campos obrigatórios do endereço.');
      return;
    }

    setProcessing(true);
    setMessage('');
    try {
      // 1. Salvar o endereço
      const { data: addressData, error: addressError } = await supabase
        .from('addresses')
        .insert({
          user_id: user.id,
          rua,
          numero,
          bairro,
          cidade,
          complemento
        })
        .select()
        .single();

      if (addressError) {
        console.error('Erro ao salvar endereço:', addressError);
        throw new Error('Erro ao salvar endereço. Verifique as permissões do banco.');
      }

      // 2. Criar o pedido
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          endereco_id: addressData.id,
          valor_total: getTotal(),
          forma_pagamento: formaPagamento,
          status: 'pendente',
          pagamento_status: 'pendente'
        })
        .select()
        .single();

      if (orderError) {
        console.error('Erro ao criar pedido:', orderError);
        throw new Error('Erro ao criar pedido.');
      }

      // 3. Criar os itens do pedido
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.id,
        quantidade: item.quantidade,
        preco: item.preco
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        console.error('Erro ao salvar itens:', itemsError);
        throw new Error('Erro ao salvar itens do pedido.');
      }

      // Limpar carrinho e redirecionar
      clearCart();
      
      if (formaPagamento === 'cartao' || formaPagamento === 'pix') {
        setMessage('Redirecionando para o Mercado Pago...');
        setTimeout(() => navigate('/app/pedidos'), 2000);
      } else {
        setMessage('Pedido realizado com sucesso! Aguardando pagamento.');
        setTimeout(() => navigate('/app/pedidos'), 2000);
      }
      
    } catch (error: any) {
      console.error('Erro ao finalizar pedido:', error);
      setMessage(error.message || 'Erro ao finalizar pedido. Tente novamente.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Finalizar Pedido</h1>
      
      {message && (
        <div className={`p-4 rounded-lg mb-6 ${message.includes('Erro') ? 'bg-red-50 text-red-800' : 'bg-blue-50 text-blue-800'}`}>
          {message}
        </div>
      )}
      
      <form onSubmit={handleCheckout} className="space-y-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Endereço de Entrega</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Rua *</label>
                <input
                  type="text"
                  required
                  value={rua}
                  onChange={(e) => setRua(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#d62828] focus:border-[#d62828]"
                  placeholder="Nome da rua"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Número *</label>
                <input
                  type="text"
                  required
                  value={numero}
                  onChange={(e) => setNumero(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#d62828] focus:border-[#d62828]"
                  placeholder="123"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bairro *</label>
                <input
                  type="text"
                  required
                  value={bairro}
                  onChange={(e) => setBairro(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#d62828] focus:border-[#d62828]"
                  placeholder="Seu bairro"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cidade *</label>
                <input
                  type="text"
                  required
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#d62828] focus:border-[#d62828]"
                  placeholder="Sua cidade"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Complemento / Ponto de Referência</label>
              <input
                type="text"
                value={complemento}
                onChange={(e) => setComplemento(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#d62828] focus:border-[#d62828]"
                placeholder="Apto, Bloco, Casa de esquina..."
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Forma de Pagamento</h2>
          <div className="space-y-3">
            <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="pagamento"
                value="pix"
                checked={formaPagamento === 'pix'}
                onChange={(e) => setFormaPagamento(e.target.value)}
                className="text-[#d62828] focus:ring-[#d62828]"
              />
              <span className="font-medium">PIX</span>
            </label>
            <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="pagamento"
                value="cartao"
                checked={formaPagamento === 'cartao'}
                onChange={(e) => setFormaPagamento(e.target.value)}
                className="text-[#d62828] focus:ring-[#d62828]"
              />
              <span className="font-medium">Cartão de Crédito (Mercado Pago)</span>
            </label>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Resumo do Pedido</h2>
          <div className="space-y-2 mb-4">
            {items.map(item => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>{item.quantidade}x {item.nome}</span>
                <span>R$ {(item.preco * item.quantidade).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-4 flex justify-between items-center text-xl font-bold">
            <span>Total</span>
            <span className="text-[#d62828]">R$ {getTotal().toFixed(2)}</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={processing}
          className="w-full bg-[#d62828] text-white py-4 rounded-lg font-bold text-lg hover:bg-red-700 transition-colors disabled:opacity-50"
        >
          {processing ? 'Processando...' : 'Confirmar Pedido'}
        </button>
      </form>
    </div>
  );
}
