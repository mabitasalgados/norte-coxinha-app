import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useCartStore, Product } from '@/store/cart';

export function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('ativo', true);
        
        if (error) throw error;
        setProducts(data || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-[#ffd166] rounded-xl p-6 mb-8 shadow-md">
        <h2 className="text-2xl font-bold text-[#d62828] mb-2">Promoção do Dia!</h2>
        <p className="text-gray-800">Compre 100 mini coxinhas e ganhe 1 refrigerante 2L.</p>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-6">Nosso Cardápio</h1>
      
      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Carregando cardápio...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Nenhum produto disponível no momento.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
              {product.imagem ? (
                <img src={product.imagem} alt={product.nome} className="h-48 w-full object-cover" />
              ) : (
                <div className="h-48 bg-gray-200 w-full flex items-center justify-center">
                  <span className="text-gray-400">Sem imagem</span>
                </div>
              )}
              <div className="p-4 flex-grow flex flex-col">
                <h3 className="text-lg font-semibold text-gray-900">{product.nome}</h3>
                <p className="text-sm text-gray-500 mt-1 flex-grow">{product.descricao}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xl font-bold text-[#d62828]">R$ {product.preco.toFixed(2)}</span>
                  <button 
                    onClick={() => addItem(product)}
                    className="bg-[#d62828] text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
                  >
                    Adicionar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
