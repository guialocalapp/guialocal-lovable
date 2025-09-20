import React from 'react';
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';

const baseUrl = 'https://guialocal.app';

export const ResetPasswordEmail = ({
  userName,
  resetLink,
}) => (
  <Html>
    <Head />
    <Preview>Guia Local - Redefinição de Senha</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src={`${baseUrl}/logo.png`}
          width="120"
          height="auto"
          alt="Guia Local"
          style={logo}
        />
        <Heading style={heading}>Redefinição de Senha</Heading>
        <Section>
          <Text style={text}>Olá, {userName || 'usuário'}!</Text>
          <Text style={text}>
            Recebemos uma solicitação para redefinir a senha da sua conta no Guia Local.
            Se você não fez essa solicitação, pode ignorar este e-mail com segurança.
          </Text>
          <Text style={text}>
            Para criar uma nova senha, clique no botão abaixo. Este link é válido por 60 minutos.
          </Text>
          <Button style={button} href={resetLink}>
            Redefinir Senha
          </Button>
          <Text style={text}>
            Se o botão não funcionar, copie e cole o seguinte link no seu navegador:
          </Text>
          <Link style={link} href={resetLink}>
            {resetLink}
          </Link>
          <Text style={text}>
            Atenciosamente,
            <br />
            Equipe Guia Local
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default ResetPasswordEmail;

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  border: '1px solid #f0f0f0',
  borderRadius: '4px',
};

const logo = {
  margin: '0 auto',
};

const heading = {
  fontSize: '28px',
  fontWeight: 'bold',
  marginTop: '48px',
  textAlign: 'center',
  color: '#333',
};

const text = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#555',
  padding: '0 20px',
};

const button = {
  backgroundColor: '#ff6f61',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center',
  display: 'block',
  width: '200px',
  padding: '12px',
  margin: '20px auto',
};

const link = {
  color: '#ff6f61',
  wordBreak: 'break-all',
  padding: '0 20px',
};