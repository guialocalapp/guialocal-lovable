import React from 'react';
    import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
    import { motion } from 'framer-motion';
    import { LayoutDashboard, Newspaper, UserCircle, LogOut, Building } from 'lucide-react';
    import { Button } from '@/components/ui/button';
    import { useAuth } from '@/hooks/useAuth';
    
    const navItems = [
      { name: 'Dashboard', path: '/client/dashboard', icon: LayoutDashboard },
      { name: 'Meus Anúncios', path: '/client/listings', icon: Newspaper },
      { name: 'Meu Perfil', path: '/client/profile', icon: UserCircle },
    ];
    
    const ClientLayout = () => {
      const location = useLocation();
      const { user, logout } = useAuth();
      const navigate = useNavigate();
    
      const handleLogout = () => {
        logout();
        navigate('/');
      };
    
      return (
        <div className="min-h-screen w-full bg-gray-900 text-white flex">
          <aside className="w-64 bg-gray-950 p-4 flex flex-col justify-between border-r border-gray-800">
            <div>
              <div className="flex items-center gap-2 text-xl font-bold text-purple-400 mb-8 px-2">
                <Building className="h-6 w-6" />
                <span>Guia Local</span>
              </div>
              <nav className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-purple-900/50 hover:text-purple-300 ${location.pathname.startsWith(item.path) ? 'bg-purple-900 text-purple-200' : 'text-gray-400'}`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
            <div>
              <div className="px-3 py-2 text-sm text-gray-500">
                <p>{user?.fullName}</p>
                <p className="truncate">{user?.email}</p>
              </div>
              <Button onClick={handleLogout} variant="ghost" className="w-full justify-start text-red-400 hover:bg-red-900/50 hover:text-red-300">
                <LogOut className="mr-3 h-4 w-4" />
                Sair
              </Button>
            </div>
          </aside>
          <div className="flex-1 flex flex-col">
            <header className="sticky top-0 h-16 flex items-center gap-4 border-b bg-gray-950/80 backdrop-blur-lg px-6 z-10">
              <h1 className="text-xl font-semibold">Painel do Cliente</h1>
            </header>
            <main className="flex-1 p-6 overflow-y-auto">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Outlet />
              </motion.div>
            </main>
          </div>
        </div>
      );
    };
    
    export default ClientLayout;