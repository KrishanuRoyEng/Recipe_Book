import { useContext } from "react";
import ShoppingListContext from "../context/ShoppingListContext";

export function useShoppingList() {
  return useContext(ShoppingListContext);
}
