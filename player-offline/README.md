# Brostt Clima — Player Offline

Projeto completo em `index.html`, sem fontes, imagens ou bibliotecas externas. Mostra condições atuais e os próximos quatro dias. Altere CIDADE, LAT, LON e FUSO no HTML para configurar o local.

## Instalação no BrosttPlayer por arquivo ou pacote

1. Baixe `brosttplayer-previsao.zip` nesta pasta e importe no player. Se ele aceitar somente HTML, extraia o ZIP e importe `index.html`.
2. Defina `index.html` como entrada do pacote, se o player solicitar.
3. Abra com internet e aguarde a primeira sincronização. Depois desconecte a rede e teste a reprodução, o fechamento e a reabertura do conteúdo.
4. Mantenha o armazenamento DOM/localStorage habilitado na WebView do player. Não limpe os dados entre reproduções e mantenha a mesma origem/caminho do conteúdo.

Este pacote é autossuficiente para exibição: CSS, JavaScript e ícones estão no HTML. Apenas a atualização da previsão usa a internet. `sw.js` é opcional para hospedagem HTTPS e não é usado quando o player abre `file://`.

O código do BrosttPlayer não foi fornecido: a persistência real após reinício precisa ser verificada no dispositivo. Se o player bloquear localStorage, o painel avisa e mantém apenas cache em memória. Se bloquear as consultas à API a partir de arquivo local, será necessário permitir a origem no player ou integrar a atualização pelo aplicativo.

## Uso por URL HTTPS

Hospede esta pasta por HTTPS, mantendo `index.html` e `sw.js` juntos. Abra com internet uma vez e aguarde uma previsão sincronizada e a mensagem de aplicação disponível offline. Depois, teste desconectando a rede e recarregando a mesma URL no mesmo perfil do player.

Para desenvolvimento local: `python3 -m http.server 8080 --directory player-offline` a partir da raiz do repositório. Localhost é a exceção de desenvolvimento ao requisito HTTPS.

## Cache e limites

- A última resposta válida é salva em localStorage por cidade; a leitura ocorre antes da consulta à rede.
- Atualização a cada hora, verificação a cada 15 minutos e nova tentativa ao receber o evento online. Consulta limitada a 15 segundos.
- Falhas HTTP, tempo limite e respostas inválidas preservam o último cache válido. Falhas de escrita mantêm dados apenas na memória e geram um aviso.
- Service Worker armazena o HTML para reabertura offline. O player precisa permitir Service Worker, Cache Storage e armazenamento persistente. Iframes, modo privado, limpeza automática e alguns players Android podem impedir ou apagar o cache.
- Um arquivo HTML aberto por `file://` depende do cache de arquivos do próprio player para reabertura; Service Worker não funciona nesse protocolo. O cache de dados também depende do suporte do player ao localStorage.
- Sem uma primeira sincronização, não há dados offline. Sem internet, não há novas previsões: os dados antigos são identificados, com horário de sincronização e datas nos cartões. Dias vencidos deixam de ser exibidos.
- Após 24 horas, o painel identifica os dados como antigos. A temperatura salva não representa uma medição atual.
- Ao editar o HTML, incremente a versão CACHE em sw.js para preparar a nova versão. Não há garantia contra remoção de armazenamento pelo sistema.

Fonte: MET Norway Locationforecast, CC BY 4.0. É necessária conexão com api.met.no para atualizar a previsão.

## Tela cheia no Xibo

O painel se ajusta à largura e à altura da região. Quando o conteúdo excede a altura, reduz o conjunto proporcionalmente e centraliza, mantendo todos os cartões e o rodapé visíveis. O ajuste é recalculado ao mudar a resolução ou os dados.
