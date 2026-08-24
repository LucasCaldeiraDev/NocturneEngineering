# Research — padrões de referência

_Compilado a partir de repertório de casos conhecidos (sem navegação externa nesta etapa)._

## Referências de padrão

- **Apple (AirPods Pro / iPhone)** — scrub de sequência por scroll com pin longo; copy curta entra e sai em sincronia com o media stage; a página "respira" (libera o scroll) depois da transformação.
- **Porsche / Lucid / Polestar** — fotografia de estúdio com uma única fonte de luz, piso refletivo, paleta quase monocromática; specs em tipografia mono/condensada como elemento gráfico.
- **Awwwards automotive cases** — rail de progresso lateral, números de etapa como HUD, grain sutil para matar o "digital flat".

## Padrões extraídos (aplicar)

1. **Um palco, uma câmera.** A montagem inteira acontece num enquadramento fixo — o usuário nunca perde a referência espacial. Movimento de câmera só na órbita final (recompensa).
2. **Copy como HUD, não como parágrafo.** Rótulo mono numerado + uma frase forte + uma linha técnica. Nada de blocos de texto sobre o carro.
3. **Física de "encaixe".** Cada peça chega com um micro-flash/impulso no ponto de snap — o scroll ganha tato.
4. **Recompensa dupla.** Faróis acendem (emoção) antes da pintura (beleza) — clímax escalonado, igual ao roteiro do cliente.
5. **Mobile não é o desktop encolhido.** Pin mais curto, HUD reduzido, mesmos assets com crop `cover` (carro centralizado aguenta crop 9:16).

## Antipadrões (evitar)

- Scrub de vídeo como única fonte da narrativa (falha em Safari/hardware fraco) → usamos 6 quadros-chave + transições GSAP; vídeo só na órbita.
- Autoplay pesado no primeiro paint → preloader gate só no quadro 1 + fontes.
- Glassmorphism/gradientes decorativos → luz e material vêm da fotografia, não do CSS.
