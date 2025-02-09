export type CommonState = {
    isDark: boolean;
    postState: "created" | "modify" | "published";
    postId: number;
    toggle: boolean;
    search: string;
  };