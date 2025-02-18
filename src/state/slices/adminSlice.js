import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { axiosPrivate } from '../../service/api';

export const fetchUsers = createAsyncThunk(
    "admin/fetchUsers",
    async (thunkAPI) => {
        try {
            const response = await axiosPrivate.post("/user/admin/users");
            return response.data;
        } catch (error) {
            console.log(error);
            return thunkAPI.rejectWithValue({ error: error.message });
        }
    }
);

export const banUser = createAsyncThunk(
    "admin/banuser",
    async(ID,thunkAPI)=>{
        try{
            const response = await axiosPrivate.patch(`/user/admin/user/${ID}/ban`);
            return response.data;
        }catch(error){
            console.log(error);
            return thunkAPI.rejectWithValue({error:error.message});
        }
    }
)

export const unbanUser = createAsyncThunk(
    "admin/unbanuser",
    async(ID,thunkAPI)=>{
        try{
            const response = await axiosPrivate.patch(`/user/admin/user/${ID}/unban`);
            return response.data;
        }catch(error){
            console.log(error);
            return thunkAPI.rejectWithValue({error:error.message});
        }
    }
)

export const deleteUser = createAsyncThunk(
    "admin/deleteuser",
    async(ID,thunkAPI)=>{
        try{
            const response = await axiosPrivate.delete(`/user/admin/delete/${ID}`);
            thunkAPI.dispatch(fetchUsers());
            return response.data;
        }catch(error){
            console.log(error);
            return thunkAPI.rejectWithValue({error:error.message});
        }
    }
)

const adminSlice = createSlice({
    name: 'admin',
    initialState: {
        isLoggedIn: false,
        email: undefined,
        users: [],
        totalUsers:0,
        error: null,
        reqStatus: "idle"
    },
    reducers: {
        setAdmin: (state, action) => {
            state.isLoggedIn = true;
            state.email = action.payload.email;
        },
        clearAdmin: (state) => {
            state.isLoggedIn = false;
            state.email = undefined;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.reqStatus = "loading"
            })
            .addCase(fetchUsers.rejected,(state,action)=>{
                state.reqStatus = "failed";
                state.error = action.payload;
            })
            .addCase(fetchUsers.fulfilled,(state,action)=>{
                state.reqStatus = "success";
                state.totalUsers = action.payload.body.totalUsers;
                state.users = [...action.payload.body.users];
            })
            .addCase(banUser.rejected,(state,action)=>{
                state.error = action.payload;
            })
    }
});

export const { setAdmin, clearAdmin } = adminSlice.actions;
export default adminSlice.reducer;