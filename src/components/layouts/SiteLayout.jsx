import React, { useMemo } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useMenus } from '@/hooks/useMenus';
import { useCategories } from '@/hooks/useCategories';
import { useSettings } from '@/hooks/useSettings';
import { LogIn, UserPlus, Facebook, Instagram, Youtube } from 'lucide-react';
import { WhatsappLogo } from '@/components/icons/WhatsappLogo';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { ThemeProvider } from '@/contexts/ThemeContext';

const ListItem = React.forwardRef(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";


const SiteLayout = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { menuItems, loading: menuLoading } = useMenus();
  const { structuredCategories, loading: categoriesLoading } = useCategories();
  const { settings, loading: settingsLoading } = useSettings();

  const handleDashboardAccess = () => {
    if (user?.profile?.role === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/client/dashboard');
    }
  };

  const headerMenuItems = useMemo(() => {
    if (!menuItems) return [];
    const headerItems = menuItems.filter(item => item.location === 'header' && item.is_active);
    const itemMap = new Map(headerItems.map(item => [item.id, { ...item, children: [] }]));
    const rootItems = [];
    
    headerItems.forEach(item => {
      if (item.parent_id && itemMap.has(item.parent_id)) {
        const parent = itemMap.get(item.parent_id);
        const child = itemMap.get(item.id);
        if (parent && child) {
          parent.children.push(child);
        }
      } else if (!item.parent_id) {
        const rootItem = itemMap.get(item.id);
        if (rootItem) {
          rootItems.push(rootItem);
        }
      }
    });

    const sortChildren = (item) => {
        if (item && item.children && item.children.length > 0) {
            item.children.sort((a, b) => a.order_index - b.order_index);
            item.children.forEach(sortChildren);
        }
    };
    
    rootItems.forEach(sortChildren);
    rootItems.sort((a, b) => a.order_index - b.order_index);
    
    return rootItems;
  }, [menuItems]);

  const footerMenuItems = useMemo(() => {
    if (!menuItems) return [];
    return menuItems.filter(item => item.location === 'footer' && item.is_active)
      .sort((a, b) => a.order_index - b.order_index);
  }, [menuItems]);

  const categoryColumns = useMemo(() => {
    if (categoriesLoading || !structuredCategories) return [[], []];
    const midPoint = Math.ceil(structuredCategories.length / 2);
    const firstColumn = structuredCategories.slice(0, midPoint);
    const secondColumn = structuredCategories.slice(midPoint);
    return [firstColumn, secondColumn];
  }, [structuredCategories, categoriesLoading]);

  return (
    <ThemeProvider defaultTheme="light" storageKey="guia-local-site-theme-forced-light">
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-lg">
          <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary">
              <img src="https://horizons-cdn.hostinger.com/2c27583f-ab66-40c9-bb32-e2150e053b88/guia-local---logo-3.1-gSfMg.png" alt="Guia Local App Logo" className="h-10 w-auto" />
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              <NavigationMenu>
                <NavigationMenuList>
                  {!menuLoading && headerMenuItems.map((item) => {
                    if (item.children && item.children.length > 0) {
                      return (
                        <NavigationMenuItem key={item.id}>
                          <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
                          <NavigationMenuContent>
                            <div className="grid w-[600px] grid-cols-3 gap-x-4 p-4 md:w-[700px] lg:w-[800px]">
                              {item.children.map(level2Item => (
                                  <div key={level2Item.id} className="flex flex-col">
                                      <h3 className="mb-2 text-sm font-semibold text-foreground px-3">{level2Item.title}</h3>
                                      <ul className="flex flex-col">
                                          {level2Item.children && level2Item.children.length > 0 ? (
                                              level2Item.children.map(level3Item => (
                                                  <li key={level3Item.id}>
                                                      <NavigationMenuLink asChild>
                                                          <Link to={level3Item.link} className="block select-none rounded-md p-3 text-sm leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                                                              {level3Item.title}
                                                          </Link>
                                                      </NavigationMenuLink>
                                                  </li>
                                              ))
                                          ) : (
                                              <li>
                                                  <NavigationMenuLink asChild>
                                                      <Link to={level2Item.link} className="block select-none rounded-md p-3 text-sm font-semibold leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                                                          Ver tudo
                                                      </Link>
                                                  </NavigationMenuLink>
                                              </li>
                                          )}
                                      </ul>
                                  </div>
                              ))}
                            </div>
                          </NavigationMenuContent>
                        </NavigationMenuItem>
                      );
                    }
                    return (
                      <NavigationMenuItem key={item.id}>
                        <Link to={item.link} legacyBehavior passHref>
                          <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                            {item.title}
                          </NavigationMenuLink>
                        </Link>
                      </NavigationMenuItem>
                    );
                  })}
                </NavigationMenuList>
              </NavigationMenu>
            </nav>
            <div className="flex items-center gap-2">
              {user ? (
                <>
                  <Button onClick={handleDashboardAccess} variant="ghost" className="text-foreground hover:bg-accent">Meu Painel</Button>
                  <Button onClick={signOut} variant="outline" className="text-foreground border-border hover:bg-accent">Sair</Button>
                </>
              ) : (
                <>
                  <Button asChild variant="ghost" className="text-foreground hover:bg-accent">
                    <Link to="/login"><LogIn className="mr-2 h-4 w-4" /> Entrar</Link>
                  </Button>
                  <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Link to="/cadastro"><UserPlus className="mr-2 h-4 w-4" /> Cadastre-se</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="flex-grow">
          <Outlet />
        </main>

        <footer className="bg-secondary text-secondary-foreground border-t border-border">
          <div className="container mx-auto px-4 md:px-6 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              
              <div className="space-y-4">
                <Link to="/" className="flex items-center gap-2">
                  <img src="https://horizons-cdn.hostinger.com/2c27583f-ab66-40c9-bb32-e2150e053b88/guia-local---logo-3.1-6Llxj.png" alt="Guia Local App Logo" className="h-auto w-4/5 max-w-[80%]" />
                </Link>
                <p className="text-sm text-muted-foreground">
                  {settingsLoading ? 'Carregando...' : settings?.general?.siteDescription || 'Encontre os melhores comércios e serviços da sua cidade em um só lugar.'}
                </p>
                <div className="flex space-x-4">
                  {settings?.general?.socialFacebook && <a href={settings.general.socialFacebook} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary"><Facebook size={20} /></a>}
                  {settings?.general?.socialInstagram && <a href={settings.general.socialInstagram} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary"><Instagram size={20} /></a>}
                  {settings?.general?.socialYoutube && <a href={settings.general.socialYoutube} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary"><Youtube size={20} /></a>}
                  {settings?.general?.socialWhatsapp && <a href={`https://wa.me/${settings.general.socialWhatsapp}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary"><WhatsappLogo className="h-5 w-5" /></a>}
                </div>
              </div>

              <div>
                <p className="font-semibold mb-4">Institucional</p>
                <ul className="space-y-2">
                  {menuLoading ? <li>Carregando...</li> : footerMenuItems.map(item => (
                    <li key={item.id}>
                      <Link to={item.link} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                        {item.title}
                      </Link>
                    </li>
                  ))}
                   <li><Link to="/quem-somos" className="text-sm text-muted-foreground hover:text-primary transition-colors">Quem Somos</Link></li>
                   <li><Link to="/politica-de-privacidade" className="text-sm text-muted-foreground hover:text-primary transition-colors">Política de Privacidade</Link></li>
                   <li><Link to="/termos-de-servico" className="text-sm text-muted-foreground hover:text-primary transition-colors">Termos de Serviço</Link></li>
                </ul>
              </div>

              <div>
                <p className="font-semibold mb-4">Categorias</p>
                <ul className="space-y-2">
                  {categoriesLoading ? <li>Carregando...</li> : categoryColumns[0].map(parentCat => (
                    <li key={parentCat.id} className="space-y-2">
                      <Link to={`/anuncios/${parentCat.slug}`} className="text-sm font-semibold text-foreground hover:text-primary transition-colors">
                        {parentCat.name}
                      </Link>
                      {parentCat.children && parentCat.children.length > 0 && (
                        <ul className="pl-4 space-y-1">
                          {parentCat.children.map(childCat => (
                            <li key={childCat.id}>
                              <Link to={`/anuncios/${childCat.slug}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                {childCat.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="font-semibold mb-4 text-secondary invisible">Categorias</p>
                <ul className="space-y-2">
                  {categoriesLoading ? <li></li> : categoryColumns[1].map(parentCat => (
                    <li key={parentCat.id} className="space-y-2">
                      <Link to={`/anuncios/${parentCat.slug}`} className="text-sm font-semibold text-foreground hover:text-primary transition-colors">
                        {parentCat.name}
                      </Link>
                      {parentCat.children && parentCat.children.length > 0 && (
                        <ul className="pl-4 space-y-1">
                          {parentCat.children.map(childCat => (
                            <li key={childCat.id}>
                              <Link to={`/anuncios/${childCat.slug}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                {childCat.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>
          <div className="border-t border-border/50">
            <div className="container mx-auto py-4 px-4 md:px-6 flex flex-col sm:flex-row justify-between items-center text-xs text-muted-foreground">
              <p>&copy; {new Date().getFullYear()} Guia Local. Todos os direitos reservados.</p>
              <p>Desenvolvido com ❤️ e ☕ em Gravataí  e Cachoerinha / RS.</p>
            </div>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
};

export default SiteLayout;