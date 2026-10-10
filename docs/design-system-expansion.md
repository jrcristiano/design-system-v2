# Diagnóstico e expansão do Design System

## Diagnóstico

O projeto já tem um catálogo amplo. Os componentes ficam em pastas próprias sob `src/components`, com implementação e, em geral, tipos e testes próximos. As stories ficam em `src/storybook`. O Storybook 10 usa o addon de acessibilidade, e os testes usam Vitest, Testing Library e jsdom.

| Área | Componentes existentes |
| --- | --- |
| Formulários | `Input` (inclui máscaras, data, hora e upload), `DateDropdownPicker`, `Checkbox`, `Radio`, `Switch`, `RichText`; havia apenas um contrato de tipos para `Select` |
| Feedback | `Alert`, `Toast`, `Tooltip`, `ProgressBar`, `Skeleton`, `Spinner`, `StatusIndicator`, `EmptyState` |
| Navegação | `Tab`, `Breadcrumb`, `Pagination`, `Stepper`, `Dropdown`, `Menu`, `SidebarFilter` |
| Sobreposições | `Modal`; `SidebarFilter` já cobre um painel lateral composto |
| Dados e conteúdo | `Table`, `Chart`, `Accordion`, `TreeView`, `Card`, `Avatar`, `Chip`, `Tag`, `Carousel`, `MediaPreview`, `Stopwatch` |
| Ações e tipografia | `Button`, `Fab`, `Icon`, `Typography`, `SortableList` |

### Padrões encontrados

- React 19.2 e TypeScript são usados em componentes funcionais; propriedades nativas de HTML são uma base comum para controles simples.
- O Tailwind CSS 4 é carregado em `src/styles/globals.css`. Vários componentes usam utilitários com variáveis CSS, enquanto componentes mais antigos também usam CSS inline e CSS Modules.
- `src/tokens` contém escalas e tokens semânticos. `src/tokens/theme.css` mapeia os tokens para `data-theme="light"` e `data-theme="dark"`; novos controles podem usar esses papéis sem alterar tokens globais.
- Os componentes de formulário existentes tendem a reunir label, estado de erro, mensagem e controle nativo. `Input` define o precedente mais próximo para os novos controles.
- Há testes próximos à implementação, mas os nomes e a estrutura variam entre pastas. As stories são mantidas separadamente.
- Alguns componentes oferecem um `index.ts` próprio; não há um barrel central em `src/components` nem um campo `exports` no `package.json`. Esta expansão segue o padrão de barrel local, sem inventar um novo entrypoint.

### Lacunas e limites observados

- Não havia um `Textarea` no catálogo, embora os tokens já incluam padding para esse controle.
- `src/components/Select/Select.interface.ts` definia propriedades para um seletor, mas faltavam implementação, testes e story.
- Um `Field` genérico se sobreporia ao label e à mensagem que `Input` já oferece. Não há uma necessidade interna demonstrada que justifique a camada compartilhada neste momento.
- Nomes de arquivos de tipos e convenções entre exports nomeados e default variam. A mudança não normaliza esses padrões nem refatora componentes existentes.
- O README já apontava para este documento, que ainda não existia.

## Priorização

| Componente | Justificativa | Prioridade | Complexidade | Dependências |
| --- | --- | --- | --- | --- |
| `Textarea` | Campo multilinear comum, sem implementação equivalente; tokens específicos já existem | Alta | Baixa | React e tokens existentes |
| `Select` | Controle nativo recorrente; contrato de tipos já estava no repositório, sem componente funcional | Alta | Baixa | React e tokens existentes |
| `Field` | Poderia compor label, ajuda e validação para vários controles | Média | Média | Nenhuma, mas há sobreposição com `Input` |
| `Combobox` / `Autocomplete` | Resolve busca e seleção em listas grandes, mas exige interação por teclado, foco e anúncio mais complexos | Média | Alta | Nenhuma adequada já instalada |
| `Date Picker` | Há implementações de data existentes em `Input` e `DateDropdownPicker`; requer primeiro escolher um contrato único | Baixa | Alta | Componentes atuais |
| `Dialog` / `Drawer` | `Modal` e `SidebarFilter` já cobrem esses usos; uma nova primitive exigiria alinhamento de foco e API | Baixa | Alta | Componentes atuais |

## Implementação

### `Textarea`

Adicionado em `src/components/Textarea`. Usa o elemento HTML `<textarea>` e herda atributos nativos, incluindo `rows`, `maxLength`, `name`, `value` e `defaultValue`. A API adiciona `label`, `message` e `state` (`default` ou `error`). A associação de descrição, a indicação de obrigatório e o identificador do erro são expostos ao controle nativo.

`label` assume o valor compatível `"Label"` quando omitido; use `label=""` com `aria-label` se o layout já fornecer outro nome acessível. `state` começa em `"default"`.

### `Select`

Adicionado em `src/components/Select`, reaproveitando `SelectProps` e `<select>` nativo. Mantém o suporte a label, mensagem, estado, tamanho e aos atributos nativos de seleção. Ícones laterais opcionais preservam as propriedades existentes no contrato de tipos; nomes acessíveis podem ser definidos por `iconLeftLabel` e `iconRightLabel` quando um ícone executa uma ação.

`label` também assume `"Label"` por padrão; `size` usa `"sm"`, `"md"` ou `"lg"`, e `state` usa `"default"` ou `"error"`. Ambos preservam `value` e `defaultValue` do elemento nativo.

Os dois componentes usam tokens semânticos de superfície, texto, borda e foco, sem adicionar dependências ou alterar componentes existentes. Cada pasta exporta seu componente e tipo por um `index.ts` local. Stories cobrem uso padrão, erro e estado desabilitado.

Exemplos básicos:

```tsx
import { Select } from "../src/components/Select";
import { Textarea } from "../src/components/Textarea";

function FeedbackForm() {
	return (
		<form>
			<Select label="Assunto" name="subject" required>
				<option value="">Selecione um assunto</option>
				<option value="support">Suporte</option>
			</Select>
			<Textarea label="Mensagem" name="message" rows={5} required />
		</form>
	);
}
```

O catálogo existente também oferece `StatusIndicator` para status que precisam de texto legível e `EmptyState` para coleções sem conteúdo. O primeiro deve incluir um rótulo; em modo somente ponto, passe `showLabel={false}` para que o componente exponha o rótulo como nome acessível. Em `EmptyState`, forneça uma ação apenas quando houver um próximo passo útil.

```tsx
import { EmptyState } from "../src/components/EmptyState";
import { StatusIndicator } from "../src/components/StatusIndicator";

<StatusIndicator status="success" label="Salvo" size="sm" />

<EmptyState
	title="Nenhum resultado encontrado"
	description="Ajuste os filtros para tentar novamente."
	action={<a href="/search">Voltar à busca</a>}
/>
```

## Melhorias futuras

- Definir um barrel público e uma estratégia de exports de pacote quando houver um contrato de distribuição a consolidar.
- Considerar `Field` depois de validar a composição com `Input`, `Textarea`, `Select` e controles de seleção.
- Auditar os usos de cores antigas e os caminhos de foco/teclado dos componentes existentes em uma tarefa dedicada; essa expansão não altera seu comportamento.
- Resolver a sobreposição de APIs de data antes de introduzir um novo date picker.
