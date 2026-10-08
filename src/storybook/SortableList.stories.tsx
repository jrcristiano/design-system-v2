import type { Meta, StoryObj } from "@storybook/react-vite";
import React, { useState } from "react";
import { SortableList } from "../components/SortableList/SortableList";
import type { ISortableItem } from "../components/SortableList/SortableList.interface";
import { DotsSixVerticalIcon, ClockIcon, PlusIcon, TrashIcon } from "@phosphor-icons/react";
import { Button } from "../components/Button/Button";
import "./SortableList.stories.inline.css";

interface LessonData {
	number: number;
	title: string;
	description: string;
	duration: string;
	status: string;
	isActive?: boolean;
}

const meta: Meta<typeof SortableList> = {
	title: "Components/SortableList",
	parameters: {
		layout: "centered",
		controls: { disable: true },
		docs: {
			description: {
				component:
					"Componente de lista ordenável (Drag & Drop) usando @dnd-kit. Permite reordenar itens através de arrastar e soltar.",
			},
		},
	},
	component: SortableList,
};

export default meta;
type Story = StoryObj<typeof SortableList>;

const initialLessons: ISortableItem<LessonData>[] = [
	{
		id: "1",
		data: {
			number: 1,
			title: "Sem título",
			description: "Preencha a descrição da aula",
			duration: "45min",
			status: "Concluída",
		},
	},
	{
		id: "2",
		data: {
			number: 2,
			title: "Sem título",
			description: "Preencha a descrição da aula",
			duration: "60min",
			status: "Em edição",
			isActive: true,
		},
	},
	{
		id: "3",
		data: {
			number: 3,
			title: "Sem título",
			description: "Preencha a descrição da aula",
			duration: "90min",
			status: "Agendada",
		},
	},
];

const LessonCard: React.FC<{ item: ISortableItem<LessonData> }> = ({ item }) => {
	const { number, title, description, duration, status, isActive } = item.data;

	return (
		<div
			className={`
				flex items-start gap-3 p-4 
				bg-white rounded-xl 
				border-2 transition-colors
				${isActive ? "border-blue-500" : "border-gray-200"}
			`}
		>
			<div className="text-gray-400 cursor-grab active:cursor-grabbing mt-1">
				<DotsSixVerticalIcon size={20} weight="bold" />
			</div>

			<div className="flex items-center justify-center w-7 h-7 rounded-full text-white font-bold text-sm sortablelist-stories-inline-1">
				{number}
			</div>

			<div className="flex-grow">
				<div className="flex items-center gap-2 mb-1">
					<h3 className="text-base font-semibold text-gray-800">{title}</h3>
					<span
						className={`
							text-xs px-2.5 py-0.5 rounded-full border
							${
								status === "Em edição"
									? "bg-yellow-50 text-yellow-700 border-yellow-300"
									: status === "Concluída"
										? "bg-green-50 text-green-700 border-green-300"
										: "bg-blue-50 text-blue-700 border-blue-300"
							}
						`}
					>
						{status}
					</span>
				</div>
				<p className="text-sm text-gray-500 mb-2">{description}</p>
				<div className="flex items-center gap-1 text-xs text-gray-500">
					<ClockIcon size={14} weight="regular" />
					{duration}
				</div>
			</div>

			<button
				className="p-1 rounded text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
				onClick={(e) => {
					e.stopPropagation();
					console.log("Delete:", item.id);
				}}
			>
				<TrashIcon size={18} weight="regular" />
			</button>
		</div>
	);
};

const DefaultStory = () => {
	const [items, setItems] = useState(initialLessons);

	return (
		<div className="w-[450px] bg-gray-50 p-5 rounded-lg shadow-md">
			<div className="flex justify-between items-center mb-5">
				<h2 className="text-2xl font-bold text-gray-800">Aulas</h2>
				<Button variant="primary" iconLeft={PlusIcon}>
					Nova Aula
				</Button>
			</div>

			<SortableList
				items={items}
				onChange={(newItems) => {
					console.log("Nova ordem:", newItems);
					setItems(newItems);
				}}
				renderItem={(item) => <LessonCard item={item} />}
			/>
		</div>
	);
};

export const Default: Story = {
	render: () => <DefaultStory />,
};
