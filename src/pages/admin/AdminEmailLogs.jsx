import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useEmailLogs } from '@/hooks/useEmailLogs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CheckCircle, AlertCircle, FileText } from 'lucide-react';

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('pt-BR', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
};

const StatusBadge = ({ status, errorMessage }) => {
    if (status === 'sent') {
        return <Badge className="bg-green-600/20 text-green-400 border-green-600/30 hover:bg-green-600/30"><CheckCircle className="w-3 h-3 mr-1" /> Enviado</Badge>;
    }
    
    if (status === 'failed') {
        return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                         <Badge variant="destructive" className="bg-red-600/20 text-red-400 border-red-600/30 hover:bg-red-600/30 cursor-pointer"><AlertCircle className="w-3 h-3 mr-1" /> Falhou</Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{errorMessage || 'Erro desconhecido'}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
    }
    return <Badge variant="outline">{status}</Badge>;
};

const AdminEmailLogs = () => {
    const { emailLogs, loading } = useEmailLogs();

    return (
        <>
            <Helmet>
                <title>Log de Emails - Admin - Guia Local</title>
            </Helmet>
            <div className="flex items-center justify-between space-y-2 mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Log de Emails</h1>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Histórico de Emails Enviados</CardTitle>
                    <CardDescription>Visualize todos os emails enviados pela plataforma.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Data</TableHead>
                                <TableHead>Destinatário</TableHead>
                                <TableHead>Assunto</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Corpo</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        Carregando logs...
                                    </TableCell>
                                </TableRow>
                            ) : emailLogs.length > 0 ? (
                                emailLogs.map(log => (
                                    <TableRow key={log.id}>
                                        <TableCell>{formatDate(log.created_at)}</TableCell>
                                        <TableCell>{log.recipient}</TableCell>
                                        <TableCell className="font-medium">{log.subject}</TableCell>
                                        <TableCell>
                                            <StatusBadge status={log.status} errorMessage={log.error_message} />
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <FileText className="h-5 w-5 text-muted-foreground cursor-pointer" />
                                                    </TooltipTrigger>
                                                    <TooltipContent className="max-w-sm">
                                                        <pre className="whitespace-pre-wrap text-xs">{log.body}</pre>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        Nenhum log de email encontrado.
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

export default AdminEmailLogs;