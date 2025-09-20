import React from 'react';
    import { Helmet } from 'react-helmet-async';
    import { Link } from 'react-router-dom';
    import { useBanners } from '@/hooks/useBanners';
    import { Button } from '@/components/ui/button';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
    import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
    import { Badge } from '@/components/ui/badge';
    import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
    import { MoreHorizontal, PlusCircle } from 'lucide-react';

    const AdminBanners = () => {
        const { banners, loading, deleteBanner } = useBanners();

        return (
            <>
                <Helmet>
                    <title>Gerenciar Banners - Admin - Guia Local</title>
                </Helmet>
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Banners</h1>
                    <Link to="/admin/banners/new">
                        <Button>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Adicionar Banner
                        </Button>
                    </Link>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Todos os Banners</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Título</TableHead>
                                    <TableHead>Localização</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Período</TableHead>
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan="5" className="text-center">Carregando...</TableCell>
                                    </TableRow>
                                ) : banners.length > 0 ? (
                                    banners.map(banner => (
                                        <TableRow key={banner.id}>
                                            <TableCell className="font-medium">{banner.title}</TableCell>
                                            <TableCell>{banner.location}</TableCell>
                                            <TableCell>
                                                <Badge variant={banner.status === 'ativo' ? 'default' : 'destructive'}>
                                                    {banner.status === 'ativo' ? 'Ativo' : 'Inativo'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {banner.start_date ? new Date(banner.start_date).toLocaleDateString() : 'N/A'} - {banner.end_date ? new Date(banner.end_date).toLocaleDateString() : 'N/A'}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <span className="sr-only">Abrir menu</span>
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                                        <DropdownMenuItem asChild>
                                                            <Link to={`/admin/banners/edit/${banner.id}`}>Editar</Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem onClick={() => deleteBanner(banner.id)} className="text-red-500">
                                                            Deletar
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan="5" className="text-center">Nenhum banner encontrado.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </>
        );
    };

    export default AdminBanners;