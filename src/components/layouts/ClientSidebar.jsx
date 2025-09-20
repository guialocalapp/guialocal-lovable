import React from 'react';
    import { Link, useLocation } from 'react-router-dom';
    import { cn } from '@/lib/utils';
    import { LayoutDashboard, Building, User, CreditCard, Plane, Users, MessageSquare } from 'lucide-react';

    const clientNavItems = [
      { href: '/client/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/client/listings', label: 'Meus Anúncios', icon: Building },
      { href: '/client/reviews', label: 'Avaliações', icon: MessageSquare },
      { href: '/client/profile', label: 'Meu Perfil', icon: User },
      { href: '/client/plans', label: 'Planos e Assinatura', icon: Plane },
      { href: '/client/payments', label: 'Pagamentos', icon: CreditCard },
      { href: '/client/affiliates', label: 'Afiliados', icon: Users },
    ];

    const ClientSidebar = ({ isOpen, toggleSidebar }) => {
      const location = useLocation();

      return (
        <>
          <div
            className={cn(
              'fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity',
              isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            )}
            onClick={toggleSidebar}
          />
          <aside
            className={cn(
              'sidebar w-[250px] flex flex-col',
              isOpen && 'is-mobile-open'
            )}
          >
            <div className="sidebar-logo">
              <Link to="/client/dashboard">
                <img src="https://horizons-cdn.hostinger.com/2c27583f-ab66-40c9-bb32-e2150e053b88/guia-local---logo-3.1-gSfMg.png" alt="Logo" className="h-9 transition-all duration-300" />
              </Link>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <nav>
                <ul className="flex flex-col gap-2">
                  {clientNavItems.map((item) => (
                    <li key={item.href}>
                      <Link
                        to={item.href}
                        className={cn(
                          'sidebar-nav-link text-muted-foreground',
                          location.pathname.startsWith(item.href) && 'active'
                        )}
                        onClick={toggleSidebar}
                      >
                        <item.icon className="nav-icon" />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </aside>
        </>
      );
    };

    export default ClientSidebar;