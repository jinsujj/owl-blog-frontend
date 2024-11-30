export type CommonState = {
    isDark: boolean;
    postState: "write" | "modify" | "read";
    toggle: boolean;
    search: string;
    category: string;
    subCategory: string;
  };