import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { supabase } from '@/lib/supabase';

export function Navbar() {
  const { items } = useCartStore();
  const [isOpen, setIsOpen] = React.useState(false);
  const [user, setUser] = React.useState<any>(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/app');
  };

  const itemCount = items.reduce((acc, item) => acc + item.quantidade, 0);

  return (
    <nav className="bg-[#d62828] text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/app" className="flex-shrink-0 flex items-center">
              <span className="font-bold text-xl tracking-tight text-[#ffd166]">Norte Coxinha</span>
            </Link>
          </div>
          
          <div className="hidden sm:flex sm:items-center sm:space-x-8">
            <Link to="/app" className="hover:text-[#ffd166] px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Cardápio
            </Link>
            {user ? (
              <>
                <Link to="/app/pedidos" className="hover:text-[#ffd166] px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Meus Pedidos
                </Link>
                <button onClick={handleLogout} className="hover:text-[#ffd166] px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Sair
                </button>
              </>
            ) : (
              <Link to="/app/login" className="hover:text-[#ffd166] px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2">
                <User size={18} /> Entrar
              </Link>
            )}
            <Link to="/app/carrinho" className="hover:text-[#ffd166] px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center relative">
              <ShoppingCart size={24} />
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-blue-900 rounded-full">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>

          <div className="flex items-center sm:hidden space-x-4">
            <Link to="/app/carrinho" className="hover:text-[#ffd166] p-2 rounded-md text-sm font-medium transition-colors relative">
              <ShoppingCart size={24} />
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-blue-900 rounded-full">
                  {itemCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md hover:text-[#ffd166] hover:bg-red-800 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="sm:hidden bg-[#d62828] border-t border-red-800">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/app"
              className="block px-3 py-2 rounded-md text-base font-medium hover:text-[#ffd166] hover:bg-red-800"
              onClick={() => setIsOpen(false)}
            >
              Cardápio
            </Link>
            {user ? (
              <>
                <Link
                  to="/app/pedidos"
                  className="block px-3 py-2 rounded-md text-base font-medium hover:text-[#ffd166] hover:bg-red-800"
                  onClick={() => setIsOpen(false)}
                >
                  Meus Pedidos
                </Link>
                <button
                  onClick={() => { handleLogout(); setIsOpen(false); }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:text-[#ffd166] hover:bg-red-800"
                >
                  Sair
                </button>
              </>
            ) : (
              <Link
                to="/app/login"
                className="block px-3 py-2 rounded-md text-base font-medium hover:text-[#ffd166] hover:bg-red-800"
                onClick={() => setIsOpen(false)}
              >
                Entrar / Cadastrar
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
