import type { Meta, StoryObj } from "@storybook/react-vite";
import { FolderIcon, FileIcon, FileTextIcon, FileCssIcon } from "@phosphor-icons/react";
import { useState } from "react";

import { TreeView } from "../components/TreeView/TreeView";
import type { TreeNode } from "../components/TreeView/TreeView.type";

interface TreeViewStoryArgs {
	multiSelect: boolean;
	withCheckbox: boolean;
}

const meta: Meta<TreeViewStoryArgs> = {
	title: "Components/TreeView",
	tags: ["autodocs"],
	argTypes: {
		multiSelect: { control: "boolean" },
		withCheckbox: { control: "boolean" },
	},
	args: {
		multiSelect: false,
		withCheckbox: false,
	},
};

export default meta;
type Story = StoryObj<TreeViewStoryArgs>;

/* -------------------------------------------------------------------------- */
/*                                    DATA                                    */
/* -------------------------------------------------------------------------- */

const fileSystemData: TreeNode[] = [
	{
		id: "1",
		label: "src",
		icon: <FolderIcon size={18} />,
		children: [
			{
				id: "1-1",
				label: "components",
				icon: <FolderIcon size={18} />,
				children: [
					{ id: "1-1-1", label: "Button.tsx", icon: <FileTextIcon size={18} /> },
					{ id: "1-1-2", label: "Input.tsx", icon: <FileTextIcon size={18} /> },
					{ id: "1-1-3", label: "Modal.tsx", icon: <FileTextIcon size={18} /> },
				],
			},
			{
				id: "1-2",
				label: "styles",
				icon: <FolderIcon size={18} />,
				children: [
					{ id: "1-2-1", label: "globals.css", icon: <FileCssIcon size={18} /> },
					{ id: "1-2-2", label: "variables.css", icon: <FileCssIcon size={18} /> },
				],
			},
		],
	},
	{ id: "3", label: "package.json", icon: <FileIcon size={18} /> },
	{ id: "4", label: "README.md", icon: <FileTextIcon size={18} /> },
];

const simpleData: TreeNode[] = [
	{
		id: "1",
		label: "Item 1",
		children: [{ id: "1-1", label: "Item 1.1" }],
	},
	{ id: "2", label: "Item 2" },
];

/* -------------------------------------------------------------------------- */
/*                              HELPER COMPONENTS                             */
/* -------------------------------------------------------------------------- */

function InteractiveTreeView(args: TreeViewStoryArgs) {
	const [selectedIds, setSelectedIds] = useState<string[]>([]);
	const [expandedIds, setExpandedIds] = useState<string[]>(["1"]);

	return (
		<TreeView
			data={fileSystemData}
			defaultExpandedIds={expandedIds}
			defaultSelectedIds={selectedIds}
			onSelectionChange={setSelectedIds}
			onExpandChange={setExpandedIds}
			{...args}
		/>
	);
}

function CheckboxTreeView() {
	const [selectedIds, setSelectedIds] = useState<string[]>([]);

	return (
		<TreeView
			data={fileSystemData}
			withCheckbox
			multiSelect
			defaultExpandedIds={["1"]}
			defaultSelectedIds={selectedIds}
			onSelectionChange={setSelectedIds}
		/>
	);
}

function DeepNestingTreeView(args: TreeViewStoryArgs) {
	const deepData: TreeNode[] = [
		{
			id: "level1",
			label: "Nível 1",
			children: [
				{
					id: "level2",
					label: "Nível 2",
					children: [
						{
							id: "level3",
							label: "Nível 3",
							children: [{ id: "level4", label: "Nível 4" }],
						},
					],
				},
			],
		},
	];

	return <TreeView data={deepData} defaultExpandedIds={["level1"]} {...args} />;
}

function ClickActionsTreeView() {
	const [lastAction, setLastAction] = useState("");

	const data: TreeNode[] = [
		{
			id: "docs",
			label: "Docs",
			icon: <FolderIcon size={18} />,
			children: [
				{
					id: "readme",
					label: "README.md",
					onClick: (n) => setLastAction(`Abrindo ${n.label}`),
				},
			],
		},
	];

	return (
		<>
			<TreeView data={data} defaultExpandedIds={["docs"]} />
			{lastAction && <p>{lastAction}</p>}
		</>
	);
}

function FileExplorerTreeView() {
	const [openedFile, setOpenedFile] = useState<string | null>(null);

	const data: TreeNode[] = [
		{
			id: "src",
			label: "src",
			children: [
				{
					id: "app",
					label: "App.tsx",
					onClick: (n) => setOpenedFile(n.label),
				},
			],
		},
	];

	return (
		<>
			<TreeView data={data} defaultExpandedIds={["src"]} />
			{openedFile && <strong>{openedFile}</strong>}
		</>
	);
}

/* -------------------------------------------------------------------------- */
/*                                   STORIES                                  */
/* -------------------------------------------------------------------------- */

export const Default: Story = {
	render: (args) => <TreeView data={simpleData} {...args} />,
};

export const FileSystem: Story = {
	render: (args) => <TreeView data={fileSystemData} defaultExpandedIds={["1"]} {...args} />,
};

export const WithCheckboxes: Story = {
	render: () => <CheckboxTreeView />,
};

export const MultiSelect: Story = {
	render: (args) => <TreeView data={simpleData} multiSelect {...args} />,
};

export const Interactive: Story = {
	render: (args) => <InteractiveTreeView {...args} />,
};

export const DeepNesting: Story = {
	render: (args) => <DeepNestingTreeView {...args} />,
};

export const WithClickActions: Story = {
	render: () => <ClickActionsTreeView />,
};

export const FileExplorer: Story = {
	render: () => <FileExplorerTreeView />,
};
