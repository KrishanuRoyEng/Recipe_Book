import { useState } from 'react';
import ShoppingListContext from './ShoppingListContext';
import { generateShoppingList } from '../api/mealService';

export function ShoppingListProvider({ children }) {
  const [showSidebar, setShowSidebar] = useState(false);
  const [shoppingList, setShoppingList] = useState([]);

  const openShoppingSidebar = async () => {
    const list = await generateShoppingList();
    setShoppingList(list);
    setShowSidebar(true);
  };

  const closeShoppingSidebar = () => setShowSidebar(false);

  const refreshShoppingList = async () => {
    const list = await generateShoppingList();
    setShoppingList(list);
  };

  return (
    <ShoppingListContext.Provider value={{
      showSidebar,
      shoppingList,
      openShoppingSidebar,
      closeShoppingSidebar,
      refreshShoppingList
    }}>
      {children}
    </ShoppingListContext.Provider>
  );
}

