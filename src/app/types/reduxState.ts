export type CommonState = {
		isLogged: boolean;
    isDark: boolean;
    postState: "write" | "modify" | "read";
    toggle: boolean;
    search: string;
  };