import React from 'react';
    import { Helmet } from 'react-helmet-async';
    import { useSystemLogs } from '@/hooks/useSystemLogs';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
    import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
    import { Badge } from '@/components/ui/badge';
    import { Button } from '@/components/ui/button';
    import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
    import { AlertCircle, Info, AlertTriangle, Code, RefreshCw } from 'lucide-react';
    import { cn } from '@/lib/utils';

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString('pt-BR', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit', second: '2-digit'
        });
    };

    const LogLevelBadge = ({ level }) => {
        const variants = {
            ERROR: 'bg-red-600/20 text-red-400 border-red-600/30 hover:bg-red-600/30',
            WARNING: 'bg-yellow-600/20 text-yellow-400 border-yellow-600/30 hover:bg-yellow-600/30',
            INFO: 'bg-blue-600/20 text-blue-400 border-blue-600/30 hover:bg-blue-600/30',
        };
        const icons = {
            ERROR: <AlertCircle className="w-3 h-3 mr-1" />,
            WARNING: <AlertTriangle className="w-3 h-3 mr-1" />,
            INFO: <Info className="w-3 h-3 mr-1" />,
        }
        return (
            <Badge className={cn('font-semibold', variants[level] || 'bg-gray-500/20 text-gray-400 border-gray-500/30')}>
                {icons[level]}
                {level}
            </Badge>
        );
    };

    const AdminSystemLogs = () => {
        const { logs, loading, refreshLogs } = useSystemLogs();

        return (
            <>
                <Helmet>
                    <title>Log do Sistema - Admin - Guia Local</title>
                </Helmet>
                <div className="flex items-center justify-between space-y-2 mb-6">
                    <h1 className="text-3xl font-bold tracking-tight">Log do Sistema</h1>
                    <Button onClick={refreshLogs} disabled={loading}>
                        <RefreshCw className={cn("mr-2 h-4 w-4", loading && "animate-spin")} />
                        Atualizar
                    </Button>
                </div>
                
                <Card>
                    <CardHeader>
                        <CardTitle>Registros de Eventos do Sistema</CardTitle>
                        <CardDescription>Visualize todos os eventos, avisos e erros registrados pela plataforma.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[180px]">Data</TableHead>
                                        <TableHead className="w-[120px]">Nível</TableHead>
                                        <TableHead className="w-[200px]">Origem</TableHead>
                                        <TableHead>Mensagem</TableHead>
                                        <TableHead className="text-right w-[80px]">Detalhes</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-24 text-center">
                                                Carregando logs...
                                            </TableCell>
                                        </TableRow>
                                    ) : logs.length > 0 ? (
                                        logs.map(log => (
                                            <TableRow key={log.id}>
                                                <TableCell className="text-sm text-muted-foreground">{formatDate(log.created_at)}</TableCell>
                                                <TableCell><LogLevelBadge level={log.log_level} /></TableCell>
                                                <TableCell className="font-mono text-xs text-muted-foreground">{log.source}</TableCell>
                                                <TableCell className="font-medium text-sm">{log.message}</TableCell>
                                                <TableCell className="text-right">
                                                    {log.payload && Object.keys(log.payload).length > 0 && (
                                                        <TooltipProvider>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <Code className="h-5 w-5 text-muted-foreground cursor-pointer" />
                                                                </TooltipTrigger>
                                                                <TooltipContent className="max-w-md bg-gray-900 text-gray-100 border-gray-700">
                                                                    <pre className="whitespace-pre-wrap text-xs p-2">{JSON.stringify(log.payload, null, 2)}</pre>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-24 text-center">
                                                Nenhum log do sistema encontrado.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </>
        );
    };

    export default AdminSystemLogs;