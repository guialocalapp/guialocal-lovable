import React from 'react';
import { Helmet } from 'react-helmet-async';

const AdminAsaas = () => {
    return (
        <>
            <Helmet>
                <title>Configuração Asaas - Admin - Guia Local</title>
            </Helmet>
            <div className="flex items-center justify-between space-y-2 mb-6">
                <h2 className="text-3xl font-bold tracking-tight">Configuração do Asaas</h2>
            </div>
            <div className="text-muted-foreground">
                A configuração do Asaas foi movida. Por favor, acesse a página de{' '}
                <a href="/admin/payment-gateways" className="text-primary hover:underline">
                    Gateways de Pagamento
                </a>
                {' '}para gerenciar suas chaves de API.
            </div>
        </>
    );
};

export default AdminAsaas;