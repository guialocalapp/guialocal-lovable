import React from 'react';
import { Helmet } from 'react-helmet-async';

const PrivacyPolicyPage = () => {
  return (
    <>
      <Helmet>
        <title>Política de Privacidade - Guia Local</title>
        <meta name="description" content="Entenda como coletamos, usamos e protegemos suas informações pessoais em nossa plataforma." />
      </Helmet>
      <div className="container mx-auto px-4 py-12 md:px-6 lg:py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">
            Política de Privacidade
          </h1>
          <div className="mt-8 prose prose-lg text-gray-600 dark:text-gray-300">
            <p><strong>Última atualização:</strong> 09 de Setembro de 2025</p>
            
            <p>
              A sua privacidade é importante para nós. É política do Guia Local respeitar a sua privacidade em relação a qualquer informação sua que possamos coletar no site Guia Local, e outros sites que possuímos e operamos.
            </p>

            <h2>1. Informações que coletamos</h2>
            <p>
              Solicitamos informações pessoais apenas quando realmente precisamos delas para lhe fornecer um serviço. Fazemo-lo por meios justos e legais, com o seu conhecimento e consentimento. Também informamos por que estamos coletando e como será usado.
            </p>

            <h2>2. Como usamos suas informações</h2>
            <p>
              Apenas retemos as informações coletadas pelo tempo necessário para fornecer o serviço solicitado. Quando armazenamos dados, protegemos dentro de meios comercialmente aceitáveis para evitar perdas e roubos, bem como acesso, divulgação, cópia, uso ou modificação não autorizados.
            </p>

            <h2>3. Compartilhamento de informações</h2>
            <p>
              Não compartilhamos informações de identificação pessoal publicamente ou com terceiros, exceto quando exigido por lei.
            </p>

            <h2>4. Links para outros sites</h2>
            <p>
              O nosso site pode ter links para sites externos que não são operados por nós. Esteja ciente de que não temos controle sobre o conteúdo e práticas desses sites e não podemos aceitar responsabilidade por suas respectivas políticas de privacidade.
            </p>

            <h2>5. Seus direitos</h2>
            <p>
              Você é livre para recusar a nossa solicitação de informações pessoais, entendendo que talvez não possamos fornecer alguns dos serviços desejados.
            </p>

            <h2>6. Alterações a esta política</h2>
            <p>
              O uso continuado de nosso site será considerado como aceitação de nossas práticas em torno de privacidade e informações pessoais. Se você tiver alguma dúvida sobre como lidamos com dados do usuário e informações pessoais, entre em contato conosco.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicyPage;