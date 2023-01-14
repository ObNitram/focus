import { createContext } from "react";

export const SelectedFilesContext = createContext<null|[string[], (param:string[]) => void]>(null);