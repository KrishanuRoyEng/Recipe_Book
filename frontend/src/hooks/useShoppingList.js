import { useContext } from "react";
import ShoppingListContext from "../Context/ShoppingListContext";

export function useShoppingList() {
  return useContext(ShoppingListContext);
}
