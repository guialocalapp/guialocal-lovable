
import React from 'react';
    import { Link, useLocation } from 'react-router-dom';
    import { cn } from '@/lib/utils';
    import { ScrollArea } from '@/components/ui/scroll-area';
    import {
      LayoutDashboard, Users, Newspaper, Map, CreditCard, Settings, Bot, AppWindow, DollarSign
    } from 'lucide-react';
    import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
    import { useMediaQuery } from '@/hooks/useMediaQuery';
    
    const AdminSidebar = ({ isOpen, setSidebarOpen }) => {
      const location = useLocation();
      const isMobile = !useMediaQuery("(min-width: 1024px)");
    
      const handleLinkClick = () => {
        if (isMobile) {
          setSidebarOpen(false);
        }
      };
    
      const isActive = (path) => location.pathname.startsWith(path);
    
      const navItems = [
        { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        {
          label: 'Usuários',
          icon: Users,
          subItems: [
            { path: '/admin/users', label: 'Administradores' },
            { path: '/admin/clients', label: 'Clientes' },
            { path: '/admin/affiliates', label: 'Afiliados' },
          ],
        },
        {
          label: 'Anúncios',
          icon: Newspaper,
          subItems: [
            { path: '/admin/listings', label: 'Todos os Anúncios' },
            { path: '/admin/listing-status', label: 'Status' },
            { path: '/admin/categories', label: 'Categorias' },
            { path: '/admin/facilities', label: 'Comodidades' },
            { path: '/admin/reviews', label: 'Avaliações' },
          ],
        },
        { path: '/admin/payments', icon: DollarSign, label: 'Pagamentos' },
        {
          label: 'Conteúdo',
          icon: AppWindow,
          subItems: [
            { path: '/admin/banners', label: 'Banners' },
            { path: '/admin/menus', label: 'Menus' },
          ],
        },
        { path: '/admin/plans', icon: CreditCard, label: 'Planos' },
        { path: '/admin/cities', icon: Map, label: 'Cidades' },
        {
          label: 'Configurações',
          icon: Settings,
          subItems: [
            { path: '/admin/settings', label: 'Geral' },
            { path: '/admin/email', label: 'Email' },
            { 
              label: 'Pagamentos',
              subItems: [
                { path: '/admin/active-gateway', label: 'Gateway Ativo' },
                { path: '/admin/asaas-settings', label: 'Asaas' },
                { path: '/admin/mercadopago-settings', label: 'Mercado Pago' },
              ]
            },
            { path: '/admin/mapbox', label: 'Mapbox' },
            { path: '/admin/cloudflare', label: 'Cloudflare' },
          ],
        },
        {
          label: 'Sistema',
          icon: Bot,
          subItems: [
            { path: '/admin/email-logs', label: 'Log de Emails' },
            { path: '/admin/system-logs', label: 'Log do Sistema' },
          ]
        },
      ];
    
      const renderNavItem = (item, level = 0) => {
        if (item.subItems) {
          const isParentActive = item.subItems.some(sub => isActive(sub.path) || (sub.subItems && sub.subItems.some(s => isActive(s.path))));
          return (
            <Accordion type="single" collapsible defaultValue={isParentActive ? `item-${item.label}` : ''} key={item.label}>
              <AccordionItem value={`item-${item.label}`} className="border-b-0">
                <AccordionTrigger className={cn(
                  "flex items-center w-full text-sm font-medium rounded-md hover:bg-muted py-2",
                  level === 0 ? "px-3" : "px-0",
                  isParentActive && "text-primary"
                )}>
                  {item.icon && <item.icon className="mr-3 h-5 w-5" />}
                  <span>{item.label}</span>
                </AccordionTrigger>
                <AccordionContent className={cn(level === 0 ? "pl-6" : "pl-4")}>
                  {item.subItems.map(subItem => renderNavItem(subItem, level + 1))}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          );
        }
    
        return (
          <Link
            key={item.path}
            to={item.path}
            onClick={handleLinkClick}
            className={cn(
              'flex items-center rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted-foreground/10 hover:text-foreground',
              isActive(item.path) && 'bg-primary/10 text-primary'
            )}
          >
            {item.icon && <item.icon className="mr-3 h-5 w-5" />}
            {item.label}
          </Link>
        );
      };
    
      return (
        <>
          {isMobile && isOpen && (
            <div 
              className="fixed inset-0 bg-black/60 z-30" 
              onClick={() => setSidebarOpen(false)}
            />
          )}
          <aside className={cn(
            "fixed top-0 left-0 h-full w-64 border-r bg-background z-40 pt-16 transition-transform duration-300 ease-in-out",
            isOpen ? "translate-x-0" : "-translate-x-full",
            "lg:translate-x-0"
          )}>
            <ScrollArea className="h-full py-4">
              <div className="space-y-1 px-3">
                {navItems.map(item => renderNavItem(item))}
              </div>
            </ScrollArea>
          </aside>
        </>
      );
    };
    
    export default AdminSidebar;
  