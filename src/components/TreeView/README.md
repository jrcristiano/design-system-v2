# TreeView

Componente de visualização hierárquica em árvore com suporte a múltiplos níveis, seleção e checkboxes.

## Características

✅ **Expandir e recolher** níveis da árvore  
✅ **Ícones padrão** para estado aberto/fechado (CaretDown/CaretRight)  
✅ **Múltiplos níveis** de hierarquia  
✅ **Estado visual** para item selecionado  
✅ **Ícones personalizados** por item (opcional)  
✅ **Spacing, tipografia e cores** do Design System  
✅ **Variação com checkbox** (seleção múltipla)  
✅ **Layout responsivo**  
✅ **Navegação por teclado** (Enter, Space, Arrow Left/Right)  
✅ **Acessibilidade** (ARIA roles e atributos)

## Uso Básico

```tsx
import { TreeView } from "@/components/TreeView";
import type { TreeNode } from "@/components/TreeView";

const data: TreeNode[] = [
	{
		id: "1",
		label: "Item 1",
		children: [
			{ id: "1-1", label: "Item 1.1" },
			{ id: "1-2", label: "Item 1.2" },
		],
	},
	{
		id: "2",
		label: "Item 2",
	},
];

function MyComponent() {
	return <TreeView data={data} />;
}
```

## Props

### TreeView

| Prop                 | Tipo                      | Padrão          | Descrição                       |
| -------------------- | ------------------------- | --------------- | ------------------------------- |
| `data`               | `TreeNode[]`              | **obrigatório** | Dados da árvore                 |
| `multiSelect`        | `boolean`                 | `false`         | Permite seleção múltipla        |
| `withCheckbox`       | `boolean`                 | `false`         | Exibe checkboxes                |
| `defaultExpandedIds` | `string[]`                | `[]`            | IDs expandidos inicialmente     |
| `defaultSelectedIds` | `string[]`                | `[]`            | IDs selecionados inicialmente   |
| `onSelectionChange`  | `(ids: string[]) => void` | -               | Callback de mudança de seleção  |
| `onExpandChange`     | `(ids: string[]) => void` | -               | Callback de mudança de expansão |

### TreeNode

| Propriedade     | Tipo                       | Descrição                             |
| --------------- | -------------------------- | ------------------------------------- |
| `id`            | `string`                   | Identificador único                   |
| `label`         | `string`                   | Texto do item                         |
| `icon`          | `ReactNode`                | Ícone personalizado (opcional)        |
| `children`      | `TreeNode[]`               | Filhos do nó (opcional)               |
| `disabled`      | `boolean`                  | Desabilita o item (opcional)          |
| `onClick`       | `(node: TreeNode) => void` | Callback ao clicar no item (opcional) |
| `onDoubleClick` | `(node: TreeNode) => void` | Callback ao duplo clique (opcional)   |
| `href`          | `string`                   | URL para navegação (opcional)         |

## Exemplos

### Com Ícones Personalizados

```tsx
import { FolderIcon, FileIcon } from "@phosphor-icons/react";

const data: TreeNode[] = [
	{
		id: "src",
		label: "src",
		icon: <FolderIcon size={18} />,
		children: [
			{
				id: "index.ts",
				label: "index.ts",
				icon: <FileIcon size={18} />,
			},
		],
	},
];

<TreeView data={data} />;
```

### Com Checkboxes

```tsx
const [selectedIds, setSelectedIds] = useState<string[]>([]);

<TreeView data={data} withCheckbox multiSelect onSelectionChange={setSelectedIds} />;
```

### Seleção Múltipla

```tsx
<TreeView data={data} multiSelect defaultSelectedIds={["1", "2"]} />
```

### Expandido por Padrão

```tsx
<TreeView data={data} defaultExpandedIds={["1", "1-1", "1-2"]} />
```

### Com Itens Desabilitados

```tsx
const data: TreeNode[] = [
	{
		id: "1",
		label: "Item Normal",
	},
	{
		id: "2",
		label: "Item Desabilitado",
		disabled: true,
	},
];
```

### Com Ações ao Clicar

```tsx
const data: TreeNode[] = [
	{
		id: "file1",
		label: "README.md",
		icon: <FileIcon size={18} />,
		onClick: (node) => {
			console.log("Clicou em:", node.label);
			openFile(node.id);
		},
		onDoubleClick: (node) => {
			console.log("Duplo clique:", node.label);
			editFile(node.id);
		},
	},
];

<TreeView data={data} />;
```

### Com Navegação (Links)

```tsx
const menuData: TreeNode[] = [
	{
		id: "home",
		label: "Home",
		href: "/",
	},
	{
		id: "products",
		label: "Produtos",
		children: [
			{ id: "electronics", label: "Eletrônicos", href: "/products/electronics" },
			{ id: "books", label: "Livros", href: "/products/books" },
		],
	},
];

<TreeView data={menuData} />;
```

### Explorador de Arquivos

```tsx
const [openedFile, setOpenedFile] = useState<string | null>(null);

const fileData: TreeNode[] = [
	{
		id: "src",
		label: "src",
		icon: <FolderIcon size={18} />,
		children: [
			{
				id: "app",
				label: "App.tsx",
				icon: <FileIcon size={18} />,
				onClick: (node) => setOpenedFile(node.label),
				onDoubleClick: (node) => editFile(node.id),
			},
		],
	},
];

<TreeView data={fileData} />;
```

## Navegação por Teclado

| Tecla             | Ação                         |
| ----------------- | ---------------------------- |
| `Enter` / `Space` | Seleciona/deseleciona item   |
| `Arrow Right →`   | Expande nó (se tiver filhos) |
| `Arrow Left ←`    | Recolhe nó (se expandido)    |
| `Tab`             | Navega entre itens           |

## Acessibilidade

- ✅ `role="tree"` no container principal
- ✅ `role="treeitem"` em cada item
- ✅ `aria-expanded` indica estado de expansão
- ✅ `tabIndex` apropriado para navegação
- ✅ Suporte completo a teclado
- ✅ Estados visuais de foco

## Estrutura de Componentes

```
TreeView/
├── TreeView.tsx          # Componente raiz
├── TreeViewItem.tsx      # Item individual
├── TreeViewContext.tsx   # Context API
├── TreeView.type.ts      # TypeScript types
├── TreeView.test.tsx     # Testes (25 testes)
└── index.ts             # Exports
```

## Design Tokens Utilizados

- **Cores**: `--ds-color-neutral-*`, `--ds-color-blue-*`
- **Tipografia**: `--ds-font-size-14`, `--ds-font-weight-medium`
- **Espaçamento**: Indentação de 24px por nível
- **Altura**: 44px por item (h-11)
- **Bordas**: `--ds-radius-md`

## Testes

O componente possui **25 testes unitários** cobrindo:

- Renderização básica
- Expansão/recolhimento
- Seleção simples e múltipla
- Checkboxes
- Itens desabilitados
- Navegação por teclado
- Acessibilidade
- Callbacks
- Ícones personalizados
- Múltiplos níveis de profundidade

Execute os testes:

```bash
npm test -- TreeView.test.tsx
```

## Storybook

Acesse as stories para exemplos interativos:

- Default
- FileSystem
- Organization
- WithCheckboxes
- MultiSelect
- DisabledItems
- FullyExpanded
- Interactive
- DeepNesting
- ResponsiveLayout

```bash
npm run storybook
```
