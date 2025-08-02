// src/store/dischargeSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { DischargeEntry } from "@/components/types"; // Adjust path to your types

interface DischargeState {
  discharges: DischargeEntry[];
  page: number;
  pageSize: number;
  totalRows: number;
  totalPages: number;
  filters: {
    shift: string;
    employeeName: string;
    dateFrom: string;
    dateTo: string;
    furnaceSize: string;
    sowId: string;
  };
  loading: boolean;
  error: string | null;
}

const initialState: DischargeState = {
  discharges: [],
  page: 1,
  pageSize: 25,
  totalRows: 0,
  totalPages: 0,
  filters: {
    shift: "all",
    employeeName: "",
    dateFrom: "",
    dateTo: "",
    furnaceSize: "all",
    sowId: "",
  },
  loading: false,
  error: null,
};

export const fetchDischarges = createAsyncThunk(
  "discharges/fetchDischarges",
  async (
    { page, filters }: { page: number; filters: DischargeState["filters"] },
    { rejectWithValue }
  ) => {
    const token = localStorage.getItem("adminToken");
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    try {
      const cacheKey = `discharges_page_${page}_${JSON.stringify(filters)}`;
      const cachedData = sessionStorage.getItem(cacheKey);
      if (cachedData) {
        return JSON.parse(cachedData);
      }

      const endpoint =
        filters.shift !== "all" ||
        filters.employeeName ||
        filters.dateFrom ||
        filters.dateTo ||
        filters.furnaceSize !== "all" ||
        filters.sowId
          ? `${backendUrl}/api/admin/filter-discharges`
          : `${backendUrl}/api/admin/discharges?page=${page}`;

      const res = await fetch(endpoint, {
        method:
          filters.shift !== "all" ||
          filters.employeeName ||
          filters.dateFrom ||
          filters.dateTo ||
          filters.furnaceSize !== "all" ||
          filters.sowId
            ? "POST"
            : "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body:
          filters.shift !== "all" ||
          filters.employeeName ||
          filters.dateFrom ||
          filters.dateTo ||
          filters.furnaceSize !== "all" ||
          filters.sowId
            ? JSON.stringify({ ...filters, page })
            : undefined,
      });

      if (!res.ok) throw new Error("Failed to fetch discharges");
      const data = await res.json();
      console.log("fetchDischarges response:", data);

      sessionStorage.setItem(cacheKey, JSON.stringify(data));
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const dischargeSlice = createSlice({
  name: "discharges",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = action.payload;
      state.page = 1; // Reset to page 1 on filter change
      Object.keys(sessionStorage)
        .filter((key) => key.startsWith("discharges_page_"))
        .forEach((key) => sessionStorage.removeItem(key));
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDischarges.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDischarges.fulfilled, (state, action) => {
        state.discharges = action.payload.data;
        state.page = action.payload.page;
        state.pageSize = action.payload.pageSize;
        state.totalRows = action.payload.totalRows;
        state.totalPages = action.payload.totalPages;
        state.loading = false;
      })
      .addCase(fetchDischarges.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setFilters, setPage } = dischargeSlice.actions;
export default dischargeSlice.reducer;