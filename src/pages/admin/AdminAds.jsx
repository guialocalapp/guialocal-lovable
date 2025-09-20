import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useAds } from '@/hooks/useAds';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { PlusCircle, Edit, Trash2, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from '@/components/ui/badge';
import { useLoading } from '@/contexts/LoadingContext';

const AdminAds = () => {
    const { ads, deleteAd, loading } = useAds();
    const { toast } = useToast();
    const { setIsLoading } = useLoading();

    const handleDelete = async (id) => {
        setIsLoading(true);
        try {
            await deleteAd(id);
        } catch (error) {
            toast({ variant: "destructive", title: "Erro!", description: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    const getModerationBadgeVariant = (status) => {
        switch (status) {
            case 'Aprovado':
                return 'success';
            case 'Reprovado':
                return 'destructive';
            case 'Em moderação':
                return 'secondary';
            default:
                return 'outline';
        }
    };
    
    return (
        <>
            <Helmet>
                <title>Gerenciar Anúncios - Admin - Guia Local</title>
            </Helmet>

             <div className="flex items-center justify-between space-y-2 mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Gerenciamento de Anúncios</h1>
                <Link to="/admin/listings/new">
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" /> Novo Anúncio
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Todos os Anúncios</CardTitle>
                    <CardDescription>Uma lista de todos os anúncios cadastrados.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="hidden w-[100px] sm:table-cell">Imagem</TableHead>
                                <TableHead>Título</TableHead>
                                <TableHead>Cliente</TableHead>
                                <TableHead>Plano</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Moderação</TableHead>
                                <TableHead>
                                    <span className="sr-only">Ações</span>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-24 text-center">
                                        Carregando...
                                    </TableCell>
                                </TableRow>
                            ) : ads && ads.length > 0 ? (
                                ads.map(ad => (
                                    <TableRow key={ad.id}>
                                        <TableCell className="hidden sm:table-cell">
                                            <img  
                                                alt={ad.title}
                                                className="aspect-square rounded-md object-cover"
                                                height="64"
                                                width="64" 
                                                src={ad.images && ad.images.length > 0 ? ad.images[0] : "https://images.unsplash.com/photo-1697862040431-f149c8e1ac9d"} />
                                        </TableCell>
                                        <TableCell className="font-medium">{ad.title}</TableCell>
                                        <TableCell>{ad.profiles?.full_name || 'N/A'}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{ad.profiles?.plan?.name || 'Nenhum'}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">{ad.listing_statuses?.name || 'N/A'}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={getModerationBadgeVariant(ad.moderation_status)}>{ad.moderation_status || 'N/A'}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button aria-haspopup="true" size="icon" variant="ghost">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                        <span className="sr-only">Toggle menu</span>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                                    <Link to={`/admin/listings/edit/${ad.id}`}>
                                                        <DropdownMenuItem>
                                                            <Edit className="mr-2 h-4 w-4" /> Editar
                                                        </DropdownMenuItem>
                                                    </Link>
                                                    <DropdownMenuSeparator />
                                                     <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-pointer">
                                                                <span className="text-red-500 flex items-center">
                                                                    <Trash2 className="mr-2 h-4 w-4" /> Excluir
                                                                </span>
                                                            </DropdownMenuItem>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Esta ação não pode ser desfeita. Isso excluirá permanentemente o anúncio.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                                <AlertDialogAction onClick={() => handleDelete(ad.id)}>Excluir</AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-24 text-center">
                                        Nenhum anúncio encontrado.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </>
    );
};

export default AdminAds;