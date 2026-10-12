# Offcanvas

Painel modal controlado, com `OffcanvasHeader`, `OffcanvasTitle`, `OffcanvasDescription`, `OffcanvasBody` e `OffcanvasFooter`. Exports e tipos estão em `src/components/Offcanvas/index.ts`.

```tsx
import { useState } from "react";
import {
	Offcanvas,
	OffcanvasHeader,
	OffcanvasTitle,
	OffcanvasDescription,
	OffcanvasBody,
	OffcanvasFooter,
} from "./components/Offcanvas";
import { Button } from "./components/Button/Button";

function Preferences() {
	const [open, setOpen] = useState(false);
	return (
		<>
			<Button onClick={() => setOpen(true)}>Configurações</Button>
			<Offcanvas open={open} onOpenChange={setOpen}>
				<OffcanvasHeader>
					<OffcanvasTitle>Configurações</OffcanvasTitle>
					<OffcanvasDescription>Personalize suas preferências.</OffcanvasDescription>
				</OffcanvasHeader>
				<OffcanvasBody>Conteúdo</OffcanvasBody>
				<OffcanvasFooter>
					<Button onClick={() => setOpen(false)}>Salvar</Button>
				</OffcanvasFooter>
			</Offcanvas>
		</>
	);
}
```

| Prop                                                | Padrão                       | Comportamento                                                     |
| --------------------------------------------------- | ---------------------------- | ----------------------------------------------------------------- |
| `open`                                              | obrigatório                  | Estado controlado                                                 |
| `onOpenChange`                                      | obrigatório                  | Solicita `false` ao fechar; o consumidor atualiza `open`          |
| `side`                                              | `right`                      | `left`, `right`, `top`, `bottom`                                  |
| `size`                                              | `md`                         | `sm`, `md`, `lg`; reutiliza os breakpoints de 480/768/1024px      |
| `closeOnOverlayClick`                               | `true`                       | Fecha por gesto iniciado e concluído fora do painel               |
| `closeOnEsc`                                        | `true`                       | Fecha pelo evento nativo `cancel`                                 |
| `showCloseButton`                                   | `true`                       | Controle de fechamento visível independentemente do header        |
| `closeLabel`                                        | `Fechar painel`              | Nome acessível do botão                                           |
| `initialFocusRef`                                   | foco nativo                  | Foco inicial explícito em um descendente do painel                |
| `returnFocusRef`                                    | elemento anteriormente ativo | Destino da restauração de foco                                    |
| `className`, `style`                                | —                            | Personalização do painel                                          |
| `aria-label`, `aria-labelledby`, `aria-describedby` | —                            | Atributos explícitos têm prioridade sobre associações automáticas |

Os slots aceitam atributos HTML e `className`. Use um único título e uma única descrição por painel; IDs fornecidos nesses slots também são associados automaticamente. Sem `OffcanvasTitle`, forneça `aria-label` ou `aria-labelledby`. Descrições são opcionais. Para conteúdos extensos, mantenha o foco inicial em um título ou outro elemento com `tabIndex={-1}` usando `initialFocusRef`.

## Arquitetura e acessibilidade

- Reutiliza `Button`, `clsx`, tokens semânticos e `acquireBodyScrollLock`, inclusive quando outro Modal permanece aberto.
- `showModal()` coloca o diálogo na camada superior e torna o restante do documento inerte. Foco e navegação são nativos; não há focus trap manual, listeners globais ou dependência nova.
- Header, body e footer separam responsabilidades de apresentação; somente body rola. Nenhuma infraestrutura genérica ou modo não controlado foi introduzido.
- O portal só é criado após montagem; SSR retorna conteúdo vazio e a hidratação abre o painel no cliente.
- O diálogo permanece montado e oculto quando fechado, preservando o estado dos filhos. A modalidade e o scroll lock permanecem ativos durante a animação de saída e são liberados ao terminar ou desmontar.
- Entrada usa `@starting-style`; saída usa `transform` e backdrop usa `opacity`. Um timer cancelável acompanha a duração CSS computada. Reabertura cancela a saída. `prefers-reduced-motion` elimina a duração.
- Dimensões são limitadas à viewport, com `dvh`, safe areas e rolagem interna. Temas claro/escuro acompanham os tokens do tema global, inclusive no portal.

## Integração e limites

Importar o componente inclui seu CSS local. Carregue `src/styles/globals.css` uma vez, como nos componentes existentes, para disponibilizar os tokens. Não há classes Tailwind dinâmicas no Offcanvas. O repositório atualmente oferece build de aplicação Vite, sem entrypoint central de biblioteca ou configuração de publicação; este componente segue os barrels locais existentes.

Requer navegador com suporte a `HTMLDialogElement.showModal()`. Navegadores sem `@starting-style` ainda abrem o painel, mas sem transição de entrada. Não use `form method="dialog"` nem chame `dialog.close()` diretamente: as ações devem atualizar o estado controlado. O comportamento do teclado virtual depende da viewport exposta pelo navegador. Não há fallback modal parcial para navegadores antigos.

Testes unitários simulam apenas os métodos nativos ausentes no JSDOM. Stories exercitam teclado no Chromium real; a configuração existente também executa auditoria de acessibilidade. A validação em outros motores, leitores de tela e aparelhos com teclado virtual continua sendo uma verificação manual recomendada.
