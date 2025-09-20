import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Newspaper, Tag, ArrowUpRight } from 'lucide-react';
import { useUsers } from '@/hooks/useUsers';
import { useAds } from '@/hooks/useAds';
import { useCategories } from '@/hooks/useCategories';
import { useAdStatus } from '@/contexts/AdStatusContext';

const AdminDashboard = () => {
  const { users, clients } = useUsers();
  const { ads } = useAds();
  const { categories } = useCategories();
  const { statuses } = useAdStatus();

  const totalUsers = users.length + clients.length;
  const totalAds = ads.length;
  
  const activeStatus = statuses.find(s => s.name.toLowerCase() === 'ativo');
  const activeAdsCount = activeStatus ? ads.filter(ad => ad.listing_status_id === activeStatus.id).length : 0;
  
  const totalCategories = categories.length;

  return (
    <>
      <Helmet>
        <title>Dashboard - Admin - Guia Local</title>
      </Helmet>
      <div className="space-y-6">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
              <p className="text-xs text-muted-foreground">Total de admins e clientes.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Anúncios</CardTitle>
              <Newspaper className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalAds}</div>
              <p className="text-xs text-muted-foreground">Total de anúncios cadastrados.</p>
            </CardContent>
          </Card>
           <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Anúncios Ativos</CardTitle>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeAdsCount}</div>
               <p className="text-xs text-muted-foreground">Anúncios com status 'Ativo'.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categorias</CardTitle>
              <Tag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCategories}</div>
               <p className="text-xs text-muted-foreground">Total de categorias criadas.</p>
            </CardContent>
          </Card>
        </div>
        <p className="text-muted-foreground">Bem-vindo ao seu painel de controle. Aqui você pode gerenciar todos os aspectos do Guia Local.</p>
      </div>
    </>
  );
};

export default AdminDashboard;