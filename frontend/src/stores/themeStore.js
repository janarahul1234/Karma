import { create } from "zustand";
import { persist } from "zustand/middleware";

import { Theme } from "@/constants";

const useThemeStore = create()(
  persist(
    (set) => ({
      theme: Theme.LIGHT,

      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT,
        })),
    }),
    { name: "karma-theme" }
  )
);

export default useThemeStore;
