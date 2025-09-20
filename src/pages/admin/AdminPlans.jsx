import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { usePlans } from '@/hooks/usePlans';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
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
import { PlusCircle, Edit, Trash2 } from 'lucide-react';

const formatCurrency = (value) => {
    if (typeof value !== 'number') return 'R$ 0,00';
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const AdminPlans = () => {
    const { plans, deletePlan } = usePlans();
    const { toast } = useToast();

    const handleDelete = (id) => {
        deletePlan(id);
    };

    const formatLimit = (limit) => {
        return limit === -1 ? 'Ilimitado' : limit;
    };

    return (
        <>
            <Helmet>
                <title>Gerenciar Planos - Admin - Guia Local</title>
            </Helmet>
            <div className="flex items-center justify-between space-y-2 mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Gerenciamento de Planos</h1>
                <Link to="/admin/plans/new">
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" /> Novo Plano
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Todos os Planos</CardTitle>
                    <CardDescription>Uma lista de todos os planos disponíveis na plataforma.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px]">Ícone</TableHead>
                                <TableHead>Nome</TableHead>
                                <TableHead>Valor Mensal</TableHead>
                                <TableHead>Valor Anual</TableHead>
                                <TableHead>Limite de Anúncios</TableHead>
                                <TableHead>Imagens</TableHead>
                                <TableHead>Vídeos</TableHead>
                                <TableHead className="text-right w-[120px]">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {plans.length > 0 ? (
                                plans.map((plan) => (
                                    <TableRow key={plan.id}>
                                        <TableCell>
                                            {plan.icon ? (
                                                <img src={plan.icon} alt={plan.name} className="h-8 w-8 rounded-sm object-cover" />
                                            ) : (
                                                <div className="h-8 w-8 rounded-sm bg-gray-700" />
                                            )}
                                        </TableCell>
                                        <TableCell className="font-medium">{plan.name}</TableCell>
                                        <TableCell>{formatCurrency(plan.monthlyPrice)}</TableCell>
                                        <TableCell>{formatCurrency(plan.annualPrice)}</TableCell>
                                        <TableCell>{formatLimit(plan.adLimit)}</TableCell>
                                        <TableCell>{formatLimit(plan.imageLimit)}</TableCell>
                                        <TableCell>{formatLimit(plan.videoLimit)}</TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Link to={`/admin/plans/edit/${plan.id}`}>
                                                <Button variant="outline" size="icon">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="destructive" size="icon">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Essa ação não pode ser desfeita. Isso excluirá permanentemente o plano.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleDelete(plan.id)}>
                                                            Excluir
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={8} className="h-24 text-center">
                                        Nenhum plano encontrado.
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

export default AdminPlans;