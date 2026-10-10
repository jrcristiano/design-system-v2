import type { Meta, StoryObj } from "@storybook/react-vite";
import { Icon } from "../components/Icon/Icon";
import { LogFileIcon } from "../components/Icon/LogFileIcon";
import { LogFileFormatIcon } from "../components/Icon/LogFileFormatIcon";

const meta: Meta<typeof Icon> = {
	title: "Examples/Icons",
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"Biblioteca de ícones baseada em Phosphor Icons, organizada por categorias funcionais.",
			},
		},
	},
	component: Icon,
	argTypes: {
		name: {
			control: "text",
			description: "Nome do ícone",
		},
		size: {
			control: { type: "number", min: 12, max: 96, step: 4 },
			description: "Tamanho do ícone em pixels",
		},
		color: {
			control: "color",
			description: "Cor do ícone",
		},
		weight: {
			control: "select",
			options: ["thin", "light", "regular", "bold", "fill", "duotone"],
			description: "Peso/estilo do ícone",
		},
	},
};

export default meta;
type Story = StoryObj<typeof Icon>;

// Galeria completa
export const AllIcons: Story = {
	parameters: { controls: { disable: true } },
	render: () => (
		<div className="flex flex-col gap-12 p-8">
			<div>
				<h2 className="text-2xl font-bold mb-6 text-gray-900">Navegação</h2>

				<div className="mb-8">
					<h3 className="text-xl font-semibold mb-4 text-gray-800">Arrows Basic</h3>
					<div className="flex flex-wrap gap-4 p-6 border border-dashed border-purple-500 [border-spacing:8px] rounded-lg">
						<Icon name="ArrowDown" size={24} />
						<Icon name="ArrowUp" size={24} />
						<Icon name="ArrowLeft" size={24} />
						<Icon name="ArrowRight" size={24} />
						<Icon name="ArrowUpLeft" size={24} />
						<Icon name="ArrowDownLeft" size={24} />
						<Icon name="ArrowUpRight" size={24} />
						<Icon name="ArrowElbowDownRight" size={24} />
						<Icon name="ArrowElbowLeftDown" size={24} />
						<Icon name="ArrowElbowLeftUp" size={24} />
						<Icon name="ArrowElbowRightDown" size={24} />
						<Icon name="ArrowElbowRight" size={24} />
						<Icon name="ArrowElbowRightUp" size={24} />
						<Icon name="ArrowElbowUpLeft" size={24} />
						<Icon name="ArrowElbowUpRight" size={24} />
					</div>
				</div>

				<div className="mb-8">
					<h3 className="text-xl font-semibold mb-4 text-gray-800">Arrow Circle</h3>
					<div className="flex flex-wrap gap-4 p-6 border border-dashed border-purple-500 [border-spacing:8px] rounded-lg">
						<Icon name="ArrowCircleDown" size={24} />
						<Icon name="ArrowCircleDownLeft" size={24} />
						<Icon name="ArrowCircleDownRight" size={24} />
						<Icon name="ArrowCircleLeft" size={24} />
						<Icon name="ArrowCircleRight" size={24} />
						<Icon name="ArrowCircleUp" size={24} />
						<Icon name="ArrowCircleUpLeft" size={24} />
						<Icon name="ArrowCircleUpRight" size={24} />
					</div>
				</div>

				<div className="mb-8">
					<h3 className="text-xl font-semibold mb-4 text-gray-800">Arrow Counter</h3>
					<div className="flex flex-wrap gap-4 p-6 border border-dashed border-purple-500 [border-spacing:8px] rounded-lg">
						<Icon name="ArrowCounterClockwise" size={24} />
						<Icon name="CloudArrowUp" size={24} />
						<Icon name="ArrowsCounterClockwise" size={24} />
					</div>
				</div>

				<div className="mb-8">
					<h3 className="text-xl font-semibold mb-4 text-gray-800">Arrows Square</h3>
					<div className="flex flex-wrap gap-4 p-6 border border-dashed border-purple-500 [border-spacing:8px] rounded-lg">
						<Icon name="ArrowSquareDown" size={24} />
						<Icon name="ArrowSquareDownLeft" size={24} />
						<Icon name="ArrowSquareDownRight" size={24} />
						<Icon name="ArrowSquareIn" size={24} />
						<Icon name="ArrowSquareLeft" size={24} />
						<Icon name="ArrowSquareOut" size={24} />
						<Icon name="ArrowSquareRight" size={24} />
						<Icon name="ArrowSquareUp" size={24} />
						<Icon name="ArrowSquareUpLeft" size={24} />
						<Icon name="ArrowSquareUpRight" size={24} />
					</div>
				</div>

				<div className="mb-8">
					<h3 className="text-xl font-semibold mb-4 text-gray-800">Pesquisa</h3>
					<div className="flex flex-wrap gap-4 p-6 border border-dashed border-purple-500 [border-spacing:8px] rounded-lg">
						<Icon name="MagnifyingGlass" size={24} />
						<Icon name="MagnifyingGlassPlus" size={24} />
						<Icon name="MagnifyingGlassMinus" size={24} />
						<Icon name="GridFour" size={24} />
						<Icon name="SquaresFour" size={24} />
						<Icon name="DotsNine" size={24} />
					</div>
				</div>
			</div>

			<div>
				<h2 className="text-2xl font-bold mb-6 text-gray-900">Direcionais e Indicadores</h2>

				<div className="mb-8">
					<h3 className="text-xl font-semibold mb-4 text-gray-800">Chevron Basic</h3>
					<div className="flex flex-wrap gap-4 p-6 border border-dashed border-purple-500 [border-spacing:8px] rounded-lg">
						<Icon name="CaretDoubleDown" size={24} />
						<Icon name="CaretDoubleLeft" size={24} />
						<Icon name="CaretDoubleRight" size={24} />
						<Icon name="CaretDown" size={24} />
						<Icon name="CaretLeft" size={24} />
						<Icon name="CaretLineDown" size={24} />
						<Icon name="CaretLineLeft" size={24} />
						<Icon name="CaretLineRight" size={24} />
						<Icon name="CaretLineUp" size={24} />
						<Icon name="CaretRight" size={24} />
						<Icon name="CaretUp" size={24} />
						<Icon name="CaretUpDown" size={24} />
					</div>
				</div>

				<div className="mb-8">
					<h3 className="text-xl font-semibold mb-4 text-gray-800">Chevron Circle</h3>
					<div className="flex flex-wrap gap-4 p-6 border border-dashed border-purple-500 [border-spacing:8px] rounded-lg">
						<Icon name="CaretCircleDoubleDown" size={24} />
						<Icon name="CaretCircleDoubleLeft" size={24} />
						<Icon name="CaretCircleDoubleRight" size={24} />
						<Icon name="CaretCircleDoubleUp" size={24} />
						<Icon name="CaretCircleDown" size={24} />
						<Icon name="CaretCircleLeft" size={24} />
						<Icon name="CaretCircleRight" size={24} />
						<Icon name="CaretCircleUp" size={24} />
						<Icon name="CaretCircleUpDown" size={24} />
					</div>
				</div>
			</div>

			<div>
				<h2 className="text-2xl font-bold mb-6 text-gray-900">Paginação e Overflow</h2>

				<div className="mb-8">
					<h3 className="text-xl font-semibold mb-4 text-gray-800">Dots</h3>
					<div className="flex flex-wrap gap-4 p-6 border border-dashed border-purple-500 [border-spacing:8px] rounded-lg">
						<Icon name="Dot" size={24} />
						<Icon name="DotOutline" size={24} />
						<Icon name="DotsThree" size={24} />
						<Icon name="DotsThreeVertical" size={24} />
						<Icon name="DotsThreeOutlineVertical" size={24} />
						<Icon name="DotsSix" size={24} />
						<Icon name="DotsSixVertical" size={24} />
						<Icon name="DotsThreeOutline" size={24} />
						<Icon name="DotsThreeCircle" size={24} />
						<Icon name="DotsThreeCircleVertical" size={24} />
						<Icon name="ChatCircleDots" size={24} />
						<Icon name="ChatDots" size={24} />
					</div>
				</div>
			</div>

			<div>
				<h2 className="text-2xl font-bold mb-6 text-gray-900">Listas & Menu</h2>

				<div className="mb-8">
					<h3 className="text-xl font-semibold mb-4 text-gray-800">List</h3>
					<div className="flex flex-wrap gap-4 p-6 border border-dashed border-purple-500 [border-spacing:8px] rounded-lg">
						<Icon name="List" size={24} />
						<Icon name="ListBullets" size={24} />
						<Icon name="ListNumbers" size={24} />
						<Icon name="ListMagnifyingGlass" size={24} />
						<Icon name="ListPlus" size={24} />
						<Icon name="ListChecks" size={24} />
					</div>
				</div>
			</div>

			<div>
				<h2 className="text-2xl font-bold mb-6 text-gray-900">Ações Básicas</h2>

				<div className="mb-8">
					<h3 className="text-xl font-semibold mb-4 text-gray-800">Ações</h3>
					<div className="flex flex-wrap gap-4 p-6 border border-dashed border-purple-500 [border-spacing:8px] rounded-lg">
						<Icon name="Plus" size={24} />
						<Icon name="PlusCircle" size={24} />
						<Icon name="PlusSquare" size={24} />
						<Icon name="Minus" size={24} />
						<Icon name="MinusCircle" size={24} />
						<Icon name="MinusSquare" size={24} />
						<Icon name="Check" size={24} />
						<Icon name="CheckSquare" size={24} />
						<Icon name="CheckFat" size={24} />
						<Icon name="X" size={24} />
						<Icon name="XCircle" size={24} />
						<Icon name="XSquare" size={24} />
						<Icon name="Pen" size={24} />
						<Icon name="PencilLine" size={24} />
						<Icon name="PencilSimple" size={24} />
						<Icon name="Clock" size={24} />
						<Icon name="PencilSlash" size={24} />
						<Icon name="PencilSimpleSlash" size={24} />
						<Icon name="Star" size={24} />
						<Icon name="PencilCircle" size={24} />
						<Icon name="PencilRuler" size={24} />
						<Icon name="Trash" size={24} />
						<Icon name="Recycle" size={24} />
						<Icon name="CopySimple" size={24} />
						<Icon name="Clipboard" size={24} />
						<Icon name="ClipboardText" size={24} />
						<Icon name="ShareNetwork" size={24} />
						<Icon name="Share" size={24} />
						<Icon name="Export" size={24} />
						<Icon name="Paperclip" size={24} />
						<Icon name="PaperPlaneTilt" size={24} />
						<Icon name="DownloadSimple" size={24} />
						<Icon name="Package" size={24} />
						<Icon name="CloudArrowDown" size={24} />
						<Icon name="UploadSimple" size={24} />
						<Icon name="Upload" size={24} />
						<Icon name="CloudArrowUp" size={24} />
						<Icon name="TextItalic" size={24} />
						<Icon name="TextB" size={24} />
						<Icon name="Power" size={24} />
						<Icon name="SignOut" size={24} />
						<Icon name="Lightbulb" size={24} />
						<Icon name="ChartLineUp" size={24} />
						<Icon name="ChartLineDown" size={24} />
						<Icon name="Question" size={24} />
					</div>
				</div>
			</div>

			<div>
				<h2 className="text-2xl font-bold mb-6 text-gray-900">Filtro, Data e Ordenação</h2>

				<div className="mb-8">
					<h3 className="text-xl font-semibold mb-4 text-gray-800">Filtro e Data</h3>
					<div className="flex flex-wrap gap-4 p-6 border border-dashed border-purple-500 [border-spacing:8px] rounded-lg">
						<Icon name="Funnel" size={24} />
						<Icon name="FunnelSimple" size={24} />
						<Icon name="FunnelSimpleX" size={24} />
						<Icon name="FunnelX" size={24} />
						<Icon name="CalendarBlank" size={24} />
						<Icon name="CalendarDots" size={24} />
						<Icon name="Calendar" size={24} />
					</div>
				</div>

				<div className="mb-8">
					<h3 className="text-xl font-semibold mb-4 text-gray-800">Ordenação</h3>
					<div className="flex flex-wrap gap-4 p-6 border border-dashed border-purple-500 [border-spacing:8px] rounded-lg">
						<Icon name="ArrowsDownUp" size={24} />
						<Icon name="LineVertical" size={24} />
					</div>
				</div>
			</div>

			<div>
				<h2 className="text-2xl font-bold mb-6 text-gray-900">Estado e Feedback</h2>

				<div className="mb-8">
					<h3 className="text-xl font-semibold mb-4 text-gray-800">Estados e Feedback</h3>
					<div className="flex flex-wrap gap-4 p-6 border border-dashed border-purple-500 [border-spacing:8px] rounded-lg">
						<Icon name="Star" size={24} />
						<Icon name="Tag" size={24} />
						<Icon name="Info" size={24} />
						<Icon name="Question" size={24} />
						<Icon name="CheckCircle" size={24} />
						<Icon name="QuestionMark" size={24} />
						<Icon name="Warning" size={24} />
						<Icon name="WarningCircle" size={24} />
						<Icon name="WarningOctagon" size={24} />
						<Icon name="SealCheck" size={24} />
						<Icon name="SealPercent" size={24} />
						<Icon name="SealQuestion" size={24} />
						<Icon name="WarningDiamond" size={24} weight="fill" />
						<Icon name="WarningOctagon" size={24} weight="fill" />
						<Icon name="Warning" size={24} weight="fill" />
						<Icon name="WarningCircle" size={24} weight="fill" />
						<Icon name="SealWarning" size={24} weight="fill" />
					</div>
				</div>
			</div>

			<div>
				<h2 className="text-2xl font-bold mb-6 text-gray-900">Home, Estrutura e Educacional</h2>

				<div className="mb-8">
					<h3 className="text-xl font-semibold mb-4 text-gray-800">Home</h3>
					<div className="flex flex-wrap gap-4 p-6 border border-dashed border-purple-500 [border-spacing:8px] rounded-lg">
						<Icon name="House" size={24} />
						<Icon name="HouseLine" size={24} />
						<Icon name="Gear" size={24} />
						<Icon name="GearSix" size={24} />
						<Icon name="GearFine" size={24} />
						<Icon name="Globe" size={24} />
						<Icon name="Translate" size={24} />
					</div>
				</div>

				<div className="mb-8">
					<h3 className="text-xl font-semibold mb-4 text-gray-800">Educational Menu</h3>
					<div className="flex flex-wrap gap-4 p-6 border border-dashed border-purple-500 [border-spacing:8px] rounded-lg">
						<Icon name="Exam" size={24} />
						<Icon name="ChalkboardTeacher" size={24} />
						<Icon name="Student" size={24} />
						<Icon name="GraduationCap" size={24} />
						<Icon name="Buildings" size={24} />
						<Icon name="BuildingOffice" size={24} />
						<Icon name="Prohibit" size={24} />
					</div>
				</div>
			</div>

			<div>
				<h2 className="text-2xl font-bold mb-6 text-gray-900">User, Security e Loading</h2>

				<div className="mb-8">
					<h3 className="text-xl font-semibold mb-4 text-gray-800">User & Security</h3>
					<div className="flex flex-wrap gap-4 p-6 border border-dashed border-purple-500 [border-spacing:8px] rounded-lg">
						<Icon name="User" size={24} />
						<Icon name="Users" size={24} />
						<Icon name="UserCircle" size={24} />
						<Icon name="IdentificationCard" size={24} />
						<Icon name="Lock" size={24} />
						<Icon name="LockSimple" size={24} />
						<Icon name="LockSimpleOpen" size={24} />
						<Icon name="LockOpen" size={24} />
						<Icon name="Shield" size={24} />
						<Icon name="ShieldCheck" size={24} />
					</div>
				</div>

				<div className="mb-8">
					<h3 className="text-xl font-semibold mb-4 text-gray-800">Loading</h3>
					<div className="flex flex-wrap gap-4 p-6 border border-dashed border-purple-500 [border-spacing:8px] rounded-lg">
						<Icon name="CircleNotch" size={24} />
						<Icon name="Spinner" size={24} />
						<Icon name="SpinnerGap" size={24} />
					</div>
				</div>
			</div>

			<div>
				<h2 className="text-2xl font-bold mb-6 text-gray-900">Files & Communication</h2>

				<div className="mb-8">
					<h3 className="text-xl font-semibold mb-4 text-gray-800">Files & Cloud</h3>
					<div className="flex flex-wrap gap-4 p-6 border border-dashed border-purple-500 [border-spacing:8px] rounded-lg">
						<Icon name="Folder" size={24} />
						<Icon name="FolderOpen" size={24} />
						<Icon name="FileJpg" size={24} />
						<Icon name="FilePng" size={24} />
						<Icon name="FilePdf" size={24} />
						<Icon name="Files" size={24} />
						<Icon name="Cloud" size={24} />
						<Icon name="CloudCheck" size={24} />
						<Icon name="CloudArrowUp" size={24} />
						<Icon name="Image" size={24} />
						<Icon name="FileSvg" size={24} />
						<Icon name="ImageSquare" size={24} />
						<Icon name="Images" size={24} />
						<Icon name="VideoCamera" size={24} />
						<Icon name="Video" size={24} />
					</div>
				</div>

				<div className="mb-8">
					<h3 className="text-xl font-semibold mb-4 text-gray-800">Communication</h3>
					<div className="flex flex-wrap gap-4 p-6 border border-dashed border-purple-500 [border-spacing:8px] rounded-lg">
						<Icon name="ChatCircle" size={24} />
						<Icon name="Chat" size={24} />
						<Icon name="Headset" size={24} />
						<Icon name="ChatCircleText" size={24} />
						<Icon name="Chats" size={24} />
						<Icon name="ChatsCircle" size={24} />
						<Icon name="Bell" size={24} />
						<Icon name="BellRinging" size={24} />
						<Icon name="BellSimpleSlash" size={24} />
						<Icon name="Phone" size={24} />
						<Icon name="PhoneCall" size={24} />
						<Icon name="EnvelopeSimple" size={24} />
						<Icon name="Envelope" size={24} />
						<Icon name="EnvelopeSimpleOpen" size={24} />
						<Icon name="EnvelopeOpen" size={24} />
					</div>
				</div>
			</div>

			<div>
				<h2 className="text-2xl font-bold mb-6 text-gray-900">Location, Edit e Log</h2>

				<div className="mb-8">
					<h3 className="text-xl font-semibold mb-4 text-gray-800">Location</h3>
					<div className="flex flex-wrap gap-4 p-6 border border-dashed border-purple-500 [border-spacing:8px] rounded-lg">
						<Icon name="MapPin" size={24} />
					</div>
				</div>

				<div className="mb-8">
					<h3 className="text-xl font-semibold mb-4 text-gray-800">Edit</h3>
					<div className="flex flex-wrap gap-4 p-6 border border-dashed border-purple-500 [border-spacing:8px] rounded-lg">
						<Icon name="PlayPause" size={24} />
						<Icon name="Play" size={24} />
						<Icon name="Pause" size={24} />
						<Icon name="PauseCircle" size={24} />
						<Icon name="PlayCircle" size={24} />
					</div>
				</div>

				<div className="mb-8">
					<h3 className="text-xl font-semibold mb-4 text-gray-800">Log</h3>
					<div className="flex flex-wrap gap-4 p-6 border border-dashed border-purple-500 [border-spacing:8px] rounded-lg">
						<LogFileIcon size={24} color="#17191C" />
						<LogFileFormatIcon size={24} color="#17191C" />
						<Icon name="Scroll" size={24} />
						<Icon name="ClockClockwise" size={24} />
						<Icon name="ClockCounterClockwise" size={24} />
						<Icon name="ListChecks" size={24} />
						<Icon name="Note" size={24} />
						<Icon name="NoteBlank" size={24} />
						<Icon name="NotePencil" size={24} />
						<Icon name="File" size={24} />
						<Icon name="FilePlus" size={24} />
						<Icon name="FileLock" size={24} />
						<Icon name="FileVideo" size={24} />
						<Icon name="ReadCvLogo" size={24} />
						<Icon name="Article" size={24} />
					</div>
				</div>
			</div>
		</div>
	),
};
