import React, { useState } from 'react';
    import { Helmet } from 'react-helmet-async';
    import { useAdStatus } from '@/contexts/AdStatusContext';
    import { useToast } from '@/components/ui/use-toast';
    import { Button } from '@/components/ui/button';
    import {
        Card,
        CardContent,
        CardHeader,
        CardTitle,
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
        Dialog,
        DialogContent,
        DialogHeader,
        DialogTitle,
        DialogTrigger,
        DialogFooter,
        DialogClose,
    } from '@/components/ui/dialog';
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
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { PlusCircle, Edit, Trash2 } from 'lucide-react';
    
    const AdminAdStatus = () => {
        const { statuses, addStatus, updateStatus, deleteStatus } = useAdStatus();
        const { toast } = useToast();
        const [isDialogOpen, setIsDialogOpen] = useState(false);
        const [currentStatus, setCurrentStatus] = useState(null);
        const [statusName, setStatusName] = useState('');
    
        const handleOpenDialog = (status = null) => {
            setCurrentStatus(status);
            setStatusName(status ? status.name : '');
            setIsDialogOpen(true);
        };
    
        const handleCloseDialog = () => {
            setIsDialogOpen(false);
            setCurrentStatus(null);
            setStatusName('');
        };
    
        const handleSubmit = async (e) => {
            e.preventDefault();
            if (!statusName.trim()) {
                toast({
                    variant: 'destructive',
                    title: 'Erro',
                    description: 'O nome do status não pode estar em branco.',
                });
                return;
            }
    
            if (currentStatus) {
                await updateStatus(currentStatus.id, { name: statusName });
            } else {
                await addStatus({ name: statusName });
            }
            handleCloseDialog();
        };
    
        const handleDelete = async (id) => {
            await deleteStatus(id);
        };
    
        return (
            <>
                <Helmet>
                    <title>Status de Anúncios - Admin - Guia Local</title>
                </Helmet>
                <div className="flex items-center justify-between space-y-2 mb-6">
                    <h2 className="text-3xl font-bold tracking-tight">Status de Anúncios</h2>
                    <Button onClick={() => handleOpenDialog()}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Novo Status
                    </Button>
                </div>
    
                <Card>
                    <CardHeader>
                        <CardTitle>Todos os Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nome</TableHead>
                                    <TableHead className="text-right w-[120px]">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {statuses && statuses.length > 0 ? (
                                    statuses.map((status) => (
                                        <TableRow key={status.id}>
                                            <TableCell className="font-medium">{status.name}</TableCell>
                                            <TableCell className="text-right space-x-2">
                                                <Button variant="outline" size="icon" onClick={() => handleOpenDialog(status)}>
                                                    <Edit className="h-4 w-4" />
                                                </Button>
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
                                                                Essa ação não pode ser desfeita. Isso excluirá permanentemente o status.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleDelete(status.id)}>
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
                                        <TableCell colSpan={2} className="h-24 text-center">
                                            Nenhum status encontrado.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
    
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>{currentStatus ? 'Editar Status' : 'Adicionar Novo Status'}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit}>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="name" className="text-right">
                                        Nome
                                    </Label>
                                    <Input
                                        id="name"
                                        value={statusName}
                                        onChange={(e) => setStatusName(e.target.value)}
                                        className="col-span-3"
                                        required
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button type="button" variant="secondary">
                                        Cancelar
                                    </Button>
                                </DialogClose>
                                <Button type="submit">Salvar</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </>
        );
    };
    
    export default AdminAdStatus;