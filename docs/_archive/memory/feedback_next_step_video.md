---
name: Next step pode ser vídeo gravado
description: Profissional pode substituir mensagem IA no painel de próximo passo por um vídeo gravado fazendo o CTA
type: feedback
originSessionId: b841adf7-19e2-47bd-8670-a3d917c2439d
---

No painel de "Próximo Passo" (sheet que abre ao clicar CTA no final do relatório), o profissional pode substituir a mensagem personalizada da IA por um vídeo gravado dele fazendo o CTA.

**Why:** Vídeo pessoal do profissional converte mais que texto. O profissional se diferencia mostrando a cara.

**How to apply:** O NextStepSheet precisa suportar dois modos: (1) mensagem texto da IA (`proximo_passo.sheet_message`) ou (2) embed de vídeo do profissional (`next_step_video_url` já existe na tabela `professionals`). O campo `next_step_type` já tem valor 'video' — usar isso para decidir qual modo renderizar.
