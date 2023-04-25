import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import clientService from './clientService';

const initialState = {
  clients: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: ''
}

export const createClient = createAsyncThunk('clients/create', async (clientData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    return await clientService.createClient(clientData, token);
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

export const getClients = createAsyncThunk('clients/getAll', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    return await clientService.getClients(token);
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

export const clientSlice = createSlice({
  name: 'client',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createClient.pending, (state) => {
        state.isLoading = true
      })
      .addCase(createClient.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.clients.push(action.payload)
      })
      .addCase(createClient.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getClients.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getClients.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.clients = action.payload
      })
      .addCase(getClients.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
  },
})

export const { reset } = clientSlice.actions
export default clientSlice.reducer
