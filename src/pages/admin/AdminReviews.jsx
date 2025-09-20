import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useReviews } from '@/contexts/ReviewContext';
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
import { CheckCircle, XCircle, MoreHorizontal, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from '@/components/ui/badge';
import StarRating from '@/components/site/StarRating';

const AdminReviews = () => {
    const { reviews, loading, updateReviewStatus, deleteReview } = useReviews();
    const { toast } = useToast();

    const handleUpdateStatus = async (id, status) => {
        try {
            await updateReviewStatus(id, status);
        } catch (error) {
            toast({ variant: "destructive", title: "Erro!", description: error.message });
        }
    };
    
    const handleDelete = async (id) => {
        try {
            await deleteReview(id);
        } catch (error) {
            toast({ variant: "destructive", title: "Erro!", description: error.message });
        }
    }

    const getStatusBadgeVariant = (status) => {
        switch (status) {
            case 'Aprovado':
                return 'success';
            case 'Reprovado':
                return 'destructive';
            default:
                return 'secondary';
        }
    };
    
    return (
        <>
            <Helmet>
                <title>Gerenciar Avaliações - Admin - Guia Local</title>
            </Helmet>

             <div className="flex items-center justify-between space-y-2 mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Gerenciamento de Avaliações</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Todas as Avaliações</CardTitle>
                    <CardDescription>Uma lista de todas as avaliações cadastradas na plataforma.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Anúncio</TableHead>
                                <TableHead>Usuário</TableHead>
                                <TableHead>Avaliação</TableHead>
                                <TableHead>Comentário</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center">
                                        Carregando...
                                    </TableCell>
                                </TableRow>
                            ) : reviews && reviews.length > 0 ? (
                                reviews.map(review => (
                                    <TableRow key={review.id}>
                                        <TableCell className="font-medium">
                                            <Link to={`/anuncio/${review.listing?.slug}`} target="_blank" className="hover:underline">
                                                {review.listing?.title || 'Anúncio indisponível'}
                                            </Link>
                                        </TableCell>
                                        <TableCell>{review.user?.full_name || 'Usuário indisponível'}</TableCell>
                                        <TableCell>
                                            <StarRating rating={review.rating} />
                                        </TableCell>
                                        <TableCell className="max-w-xs truncate">{review.comment || 'N/A'}</TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusBadgeVariant(review.status)}>{review.status}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button aria-haspopup="true" size="icon" variant="ghost">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                        <span className="sr-only">Toggle menu</span>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                                    <DropdownMenuItem onSelect={() => handleUpdateStatus(review.id, 'Aprovado')}>
                                                        <CheckCircle className="mr-2 h-4 w-4 text-green-500" /> Aprovar
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onSelect={() => handleUpdateStatus(review.id, 'Reprovado')}>
                                                        <XCircle className="mr-2 h-4 w-4 text-red-500" /> Reprovar
                                                    </DropdownMenuItem>
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
                                                                    Esta ação não pode ser desfeita. Isso excluirá permanentemente a avaliação.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                                <AlertDialogAction onClick={() => handleDelete(review.id)}>Excluir</AlertDialogAction>
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
                                    <TableCell colSpan={6} className="h-24 text-center">
                                        Nenhuma avaliação encontrada.
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

export default AdminReviews;