import React from 'react';
import { useCartStore } from '@/store/cart';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus } from 'lucide-react';

export function Cart() {
  const { items, removeItem, updateQuantity, getTotal } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Seu carrinho está vazio</h2>
        <p className="text-gray-500 mb-8">Que tal adicionar algumas delícias?</p>
        <Link to="/app" className="bg-[#d62828] text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors">
          Ver Cardápio
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Seu Carrinho</h1>
      
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <ul className="divide-y divide-gray-200">
          {items.map((item) => (
            <li key={item.id} className="p-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {item.imagem ? (
                  <img src={item.imagem} alt={item.nome} className="w-16 h-16 object-cover rounded-md" />
                ) : (
                  <div className="w-16 h-16 bg-gray-200 rounded-md"></div>
                )}
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{item.nome}</h3>
                  <p className="text-[#d62828] font-bold">R$ {item.preco.toFixed(2)}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantidade - 1)}
                    className="p-2 text-gray-600 hover:text-[#d62828] transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="px-4 font-medium text-gray-900">{item.quantidade}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantidade + 1)}
                    className="p-2 text-gray-600 hover:text-[#d62828] transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <button 
                  onClick={() => removeItem(item.id)}
                  className="p-2 text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-4 text-lg">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium text-gray-900">R$ {getTotal().toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center mb-6 text-lg">
          <span className="text-gray-600">Taxa de entrega</span>
          <span className="text-sm text-gray-500">Calculada no checkout</span>
        </div>
        <div className="flex justify-between items-center mb-8 text-xl font-bold border-t pt-4">
          <span className="text-gray-900">Total</span>
          <span className="text-[#d62828]">R$ {getTotal().toFixed(2)}</span>
        </div>
        
        <Link 
          to="/app/checkout" 
          className="w-full block text-center bg-[#d62828] text-white px-6 py-4 rounded-lg font-bold text-lg hover:bg-red-700 transition-colors"
        >
          Finalizar Pedido
        </Link>
      </div>
    </div>
  );
}
