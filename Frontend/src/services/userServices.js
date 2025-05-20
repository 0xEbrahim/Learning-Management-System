import api from "../axiosInstance";

//get all users
export const getUsers=async(setUsers)=>{
    const res=await api.get(`/users`);
    setUsers(res.data.data.users);
}

// get user by id

export const getUserById=async(userId , setUserData)=>{
    const res = await api.get(`/users/${userId}`)
    setUserData(res.data.data.user)
}