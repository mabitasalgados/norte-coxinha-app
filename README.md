# Norte Coxinha App

Este é o aplicativo PWA de delivery da Norte Coxinha.

## Como integrar com o site existente (HostGator)

1. Faça o deploy deste aplicativo (por exemplo, na Vercel, Netlify ou no próprio HostGator em uma subpasta `/app`).
2. No seu site HTML principal (`nortecoxinha.com.br`), adicione o seguinte botão onde desejar:

```html
<a href="https://nortecoxinha.com.br/app" class="btn-delivery">
  Peça agora pelo App
</a>
```

## Configuração do Banco de Dados (Supabase)

1. Crie um projeto no [Supabase](https://supabase.com).
2. Vá em **SQL Editor** e execute o conteúdo do arquivo `database.sql` que está na raiz deste projeto.
3. Copie a URL e a Anon Key do Supabase (em Project Settings > API) e coloque no arquivo `.env`.

## Configuração do Mercado Pago

1. Crie uma conta no Mercado Pago e acesse o painel de desenvolvedores.
2. Copie a Public Key e o Access Token.
3. Coloque no arquivo `.env`.

*Nota: A integração atual do Mercado Pago no frontend é simulada. Para uma integração completa e segura, você deve criar uma Edge Function no Supabase que utiliza o `MERCADO_PAGO_ACCESS_TOKEN` para gerar a preferência de pagamento e retornar a URL do checkout para o frontend.*
