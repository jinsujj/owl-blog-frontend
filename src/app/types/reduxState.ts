export type CommonState = {
		isLogged: boolean;
    isDark: boolean;
    postState: "created" | "modify" | "published";
    postId: number;
    toggle: boolean;
    search: string;
  };