import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CatalogItem } from '../lib/types';

interface CatalogsState {
  items: CatalogItem[];
}

const initialState: CatalogsState = {
  items: [],
};

const catalogsSlice = createSlice({
  name: 'catalogs',
  initialState,
  reducers: {
    setCatalogs(state, action: PayloadAction<CatalogItem[]>) {
      state.items = action.payload;
    },
  },
});

export const { setCatalogs } = catalogsSlice.actions;
export default catalogsSlice.reducer;
