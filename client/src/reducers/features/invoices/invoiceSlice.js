import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import invoiceService from './invoiceService';

const initialState = {
  invoices: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: ''
}

export const createInvoice = createAsyncThunk('invoices/create', async (invoiceData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    return await invoiceService.createInvoice(invoiceData, token);
  } catch (error) {
    const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
  }
});

export const editInvoice = createAsyncThunk('invoices/create', async (invoiceData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    return await invoiceService.editInvoice(invoiceData, token);
  } catch (error) {
    const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
  }
});

export const getInvoices = createAsyncThunk('invoices/getAll', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    return await invoiceService.getInvoices(token);
  } catch (error) {
    const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
  }
});

export const deleteInvoice = createAsyncThunk('invoices/delete', async (id, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    return await invoiceService.deleteInvoice(id, token);
  } catch (error) {
    const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
  }
});

export const invoiceSlice = createSlice({
  name: 'invoice',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createInvoice.pending, (state) => {
        state.isLoading = true
      })
      .addCase(createInvoice.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.invoices.push(action.payload)
      })
      .addCase(createInvoice.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getInvoices.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getInvoices.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.invoices = action.payload
      })
      .addCase(getInvoices.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(deleteInvoice.pending, (state) => {
        state.isLoading = true
      })
      .addCase(deleteInvoice.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.invoices = state.invoices.filter(
          (invoice) => invoice._id !== action.payload.id
        )
      })
      .addCase(deleteInvoice.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
  },
})

export const { reset } = invoiceSlice.actions
export default invoiceSlice.reducer
