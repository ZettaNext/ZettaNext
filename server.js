const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('.')); // Serve os arquivos estáticos (HTML, CSS, JS)

// Configuração do Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'contato.zettabyte0@gmail.com',
        pass: process.env.EMAIL_PASS // Senha de aplicativo do Gmail
    }
});

// Rota para processar o formulário
app.post('/send-email', async (req, res) => {
    const { name, email, phone, service, message } = req.body;

    // Mapear os valores do serviço para nomes legíveis
    const serviceNames = {
        'website': 'Desenvolvimento de Site',
        'sistema_personalizado': 'Desenvolvimento de Sistema Personalizado',
        'estoque': 'Sistema de Controle de Estoque',
        'agendamento': 'Sistema de Agendamento',
        'financas': 'Sistema de Finanças',
        'dados': 'Sistema de Análise de Dados'
    };

    const serviceName = serviceNames[service] || service;

    // Configurar o e-mail
    const mailOptions = {
        from: process.env.EMAIL_USER || 'contato.zettabyte0@gmail.com',
        to: 'contato.zettabyte0@gmail.com',
        subject: `Nova Solicitação de Orçamento - ${serviceName}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4;">
                <div style="background-color: #4F46E5; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
                    <h1 style="color: white; margin: 0;">Nova Solicitação de Orçamento</h1>
                </div>
                <div style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px;">
                    <h2 style="color: #333; border-bottom: 2px solid #4F46E5; padding-bottom: 10px;">Dados do Cliente</h2>
                    <p><strong>Nome:</strong> ${name}</p>
                    <p><strong>E-mail:</strong> <a href="mailto:${email}">${email}</a></p>
                    <p><strong>Telefone/WhatsApp:</strong> ${phone}</p>
                    <p><strong>Interesse Principal:</strong> ${serviceName}</p>
                    
                    <h2 style="color: #333; border-bottom: 2px solid #4F46E5; padding-bottom: 10px; margin-top: 30px;">Detalhes do Projeto</h2>
                    <p style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #4F46E5; border-radius: 4px;">
                        ${message.replace(/\n/g, '<br>')}
                    </p>
                    
                    <div style="margin-top: 30px; padding: 15px; background-color: #f0f0f0; border-radius: 4px; text-align: center;">
                        <p style="margin: 0; color: #666; font-size: 12px;">
                            Esta mensagem foi enviada através do formulário de contato do site ZettaNext Tecnologia
                        </p>
                    </div>
                </div>
            </div>
        `,
        replyTo: email
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({
            success: true,
            message: 'E-mail enviado com sucesso!'
        });
    } catch (error) {
        console.error('Erro ao enviar e-mail:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao enviar e-mail. Tente novamente mais tarde.'
        });
    }
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Acesse: http://localhost:${PORT}`);
});
