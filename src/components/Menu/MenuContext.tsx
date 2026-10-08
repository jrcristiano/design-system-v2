import { createContext, useContext } from "react";

interface MenuContextType {
	isCollapsed: boolean;
}

export const MenuContext = createContext<MenuContextType>({
	isCollapsed: false,
});

export const useMenuContext = () => useContext(MenuContext);
