Registro e Autorização 

Neste projeto,  expandirá o aplicativo "EUA Afora" com funcionalidades de registro e login de usuários, garantindo o acesso seguro às rotas protegidas. A aplicação, construída em React, migrada para um novo repositório e adaptada para utilizar a API de autenticação. As novas rotas `/signup` e `/signin` permitirão respectivamente o registro e a autorização de usuários, enquanto o redirecionamento automático garantirá que visitantes não autorizados sejam direcionados à página de login.

O projeto inclui a criação de componentes React como `Login` e `Register` para gerenciar formulários de autenticação, além do `ProtectedRoute` para bloquear o acesso de usuários não autorizados à rota principal `/`. Desenvolvido o `InfoTooltip`, um modal para exibir mensagens de sucesso ou erro durante o registro e login. Para uma experiência mais rica, o cabeçalho será dinâmico, exibindo diferentes informações para usuários logados e não logados.

A integração com a API utiliza endpoints específicos para registrar, autenticar e validar usuários, empregando tokens JWT para manter sessões ativas. O token é armazenado localmente com `localStorage`, permitindo a reconexão automática em visitas futuras. O envio de requisições autenticadas aos endpoints existentes do "EUA Afora" requer o cabeçalho `Authorization: Bearer {token}` para proteger os dados e funcionalidades do aplicativo.

Por fim, análise de segurança do projeto usando uma lista de verificação, identificando possíveis melhorias. Ajudará a preparar o código para técnicas avançadas de proteção, enquanto reforça o entendimento de boas práticas de autenticação e armazenamento seguro de credenciais.
