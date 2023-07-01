import { useAppSelector } from "app/store";

export const selectorAppIsLoggedIn = useAppSelector<boolean>((state) => state.auth.isLoggedIn);
