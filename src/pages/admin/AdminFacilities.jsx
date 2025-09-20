import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useFacilities } from '@/hooks/useFacilities';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { PlusCircle, MoreHorizontal, Edit, Trash2 } from 'lucide-react';

const AdminFacilities = () => {
    const { facilities, deleteFacility, getFacilityIcon } = useFacilities();
    const { toast } = useToast();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [facilityToDelete, setFacilityToDelete] = useState(null);

    const handleDeleteClick = (facility) => {
        setFacilityToDelete(facility);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (facilityToDelete) {
            deleteFacility(facilityToDelete.id);
            toast({ title: "Sucesso!", description: "Facilidade excluída." });
            setFacilityToDelete(null);
        }
        setIsDeleteDialogOpen(false);
    };

    const IconComponent = ({ iconName }) => {
        const Icon = getFacilityIcon(iconName);
        return <Icon className="h-5 w-5" />;
    };

    return (
        <>
            <Helmet>
                <title>Gerenciar Facilidades - Admin - Guia Local</title>
            </Helmet>
            <div className="flex items-center justify-between space-y-2 mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Gerenciamento de Facilidades</h1>
                <Link to="/admin/facilities/new">
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" /> Nova Facilidade
                    </Button>
                </Link>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Lista de Facilidades</CardTitle>
                    <CardDescription>Adicione e gerencie facilidades como "Wi-Fi" ou "Estacionamento".</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-16">Ícone</TableHead>
                                <TableHead>Nome</TableHead>
                                <TableHead className="w-24 text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {facilities.length > 0 ? (
                                facilities.map((facility) => (
                                    <TableRow key={facility.id}>
                                        <TableCell><IconComponent iconName={facility.icon} /></TableCell>
                                        <TableCell className="font-medium">{facility.name}</TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Abrir menu</span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem asChild>
                                                        <Link to={`/admin/facilities/edit/${facility.id}`} className="flex items-center cursor-pointer">
                                                            <Edit className="mr-2 h-4 w-4" /> Editar
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleDeleteClick(facility)} className="flex items-center cursor-pointer text-red-500">
                                                        <Trash2 className="mr-2 h-4 w-4" /> Excluir
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan="3" className="h-24 text-center">
                                        Nenhuma facilidade encontrada.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Essa ação não pode ser desfeita. Isso excluirá permanentemente a facilidade
                            <span className="font-bold"> "{facilityToDelete?.name}"</span>.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete}>Continuar</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default AdminFacilities;