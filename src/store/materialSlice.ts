// src/store/materialSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { MaterialEntry } from "../components/types"; // Adjust path to your types

interface MaterialState {
  materials: MaterialEntry[];
  page: number;
  pageSize: number;
  totalRows: number;
  totalPages: number;
  filters: {
    shift: string;
    employeeName: string;
    dateFrom: string;
    dateTo: string;
    outputStatus: string;
    furnaceSize: string;
  };
  loading: boolean;
  error: string | null;
}

const initialState: MaterialState = {
  materials: [],
  page: 1,
  pageSize: 25,
  totalRows: 0,
  totalPages: 0,
  filters: {
    shift: "all",
    employeeName: "",
    dateFrom: "",
    dateTo: "",
    outputStatus: "all",
    furnaceSize: "all",
  },
  loading: false,
  error: null,
};

export const fetchMaterials = createAsyncThunk(
  "materials/fetchMaterials",
  async ({ page, filters }: { page: number; filters: MaterialState["filters"] }, { rejectWithValue }) => {
    const token = localStorage.getItem("adminToken");
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    try {
      // Check sessionStorage first
      const cacheKey = `materials_page_${page}_${JSON.stringify(filters)}`;
      const cachedData = sessionStorage.getItem(cacheKey);
      if (cachedData) {
        return JSON.parse(cachedData);
      }
      console.log(filters, page);
      // If filters are applied, use filterMaterials endpoint
      const endpoint = filters.shift !== "all" ||
                      filters.employeeName ||
                      filters.dateFrom ||
                      filters.dateTo ||
                      filters.outputStatus !== "all" ||
                      filters.furnaceSize !== "all"
        ? `${backendUrl}/api/admin/filter-materials`
        : `${backendUrl}/api/admin/allmaterials?page=${page}`;

      const res = await fetch(endpoint, {
        method: filters.shift !== "all" ||
                filters.employeeName ||
                filters.dateFrom ||
                filters.dateTo ||
                filters.outputStatus !== "all" ||
                filters.furnaceSize !== "all" ? "POST" : "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: filters.shift !== "all" ||
              filters.employeeName ||
              filters.dateFrom ||
              filters.dateTo ||
              filters.outputStatus !== "all" ||
              filters.furnaceSize !== "all"
          ? JSON.stringify({ ...filters, page })
          : undefined,
      });

      if (!res.ok) throw new Error("Failed to fetch materials");
      const data = await res.json();
      console.log(data);

      // Cache to sessionStorage
      sessionStorage.setItem(cacheKey, JSON.stringify(data));
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const materialSlice = createSlice({
  name: "materials",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = action.payload;
      state.page = 1; // Reset to page 1 on filter change
      // Clear sessionStorage when filters change
      Object.keys(sessionStorage)
        .filter((key) => key.startsWith("materials_page_"))
        .forEach((key) => sessionStorage.removeItem(key));
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMaterials.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMaterials.fulfilled, (state, action) => {
        state.materials = action.payload.data;
        state.page = action.payload.page;
        state.pageSize = action.payload.pageSize;
        state.totalRows = action.payload.totalRows;
        state.totalPages = action.payload.totalPages;
        state.loading = false;
      })
      .addCase(fetchMaterials.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setFilters, setPage } = materialSlice.actions;
export default materialSlice.reducer;