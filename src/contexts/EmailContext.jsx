import React, { createContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';

export const EmailContext = createContext();

const initializeSmtp = () => {
  try {
    const storedSmtp = localStorage.getItem('smtpConfig');
    return storedSmtp ? JSON.parse(storedSmtp) : {
      host: '',
      port: '',
      user: '',
      pass: ''
    };
  } catch (error) {
    console.error("Failed to initialize SMTP from localStorage", error);
    return { host: '', port: '', user: '', pass: '' };
  }
};

export const EmailProvider = ({ children }) => {
  const [smtpConfig, setSmtpConfig] = useState(initializeSmtp);
  const [emailLogs, setEmailLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const saveSmtpConfig = (config) => {
    try {
      localStorage.setItem('smtpConfig', JSON.stringify(config));
      setSmtpConfig(config);
    } catch (error) {
      console.error("Failed to save SMTP config to localStorage", error);
    }
  };

  const getEmailLogs = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from('email_logs').select('*').order('created_at', { ascending: false });
    if (error) {
      console.error("Error fetching email logs:", error);
    } else {
      setEmailLogs(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    getEmailLogs();
  }, [getEmailLogs]);
  
  const logEmail = async (logData) => {
    const { error } = await supabase.from('email_logs').insert([logData]);
    if (error) {
      console.error("Error logging email:", error);
    }
  };

  const sendWelcomeEmail = async (to, name) => {
    const subject = `Bem-vindo(a) ao Guia Local, ${name}!`;
    const body = `
      Olá ${name},

      Seja muito bem-vindo(a) ao Guia Local! Estamos super felizes por ter você conosco.

      Agora você faz parte da nossa comunidade, conectando clientes aos melhores negócios da cidade.

      Como começar a brilhar?

      1.  **Cadastre seu Anúncio Gratuitamente:**
          Acesse seu painel e clique em "Meus Anúncios" para criar seu primeiro anúncio. Preencha as informações do seu negócio para que os clientes possam te encontrar.

      2.  **Quer mais visibilidade? Contrate um Plano!**
          Para se destacar ainda mais nos resultados de busca e ter acesso a recursos exclusivos, como mais fotos e links, considere um de nossos planos pagos. Acesse a seção "Planos" no seu painel para ver as vantagens e escolher o ideal para você.

      Se tiver qualquer dúvida, nossa equipe está pronta para ajudar!

      Um grande abraço,
      Equipe Guia Local
    `;

    console.log('--- SIMULANDO ENVIO DE E-MAIL ---');
    console.log('Configurações SMTP:', smtpConfig);
    console.log(`Para: ${to}`);
    console.log(`Assunto: ${subject}`);
    console.log(`Corpo do E-mail: ${body}`);
    console.log('--- FIM DA SIMULAÇÃO ---');
    
    let logPayload = {
      recipient: to,
      subject,
      body,
      status: 'sent',
    };

    if (!smtpConfig.host || !smtpConfig.port || !smtpConfig.user || !smtpConfig.pass) {
       const errorMessage = "E-mail não pôde ser enviado: Configurações de SMTP incompletas.";
       console.warn(errorMessage);
       logPayload.status = 'failed';
       logPayload.error_message = errorMessage;
    }
    
    await logEmail(logPayload);
  };

  const value = { smtpConfig, saveSmtpConfig, sendWelcomeEmail, emailLogs, loading };

  return <EmailContext.Provider value={value}>{children}</EmailContext.Provider>;
};