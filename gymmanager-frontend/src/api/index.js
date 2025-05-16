import axios from "axios";

const API_URL = "http://localhost:8000/api/";

// USER & AUTH
export const loginUser = async (username, password) => {
  const res = await axios.get(`${API_URL}users/`, {
    params: { username, password },
  });
  if (res.data && res.data.length > 0) return res.data[0];
  throw new Error("Invalid credentials");
};

export const signupUser = (userData) =>
  axios.post(`${API_URL}users/`, userData);

export const fetchUsers = () => axios.get(`${API_URL}users/`);

// USER DETAILS
export const fetchUserDetails = (userId) => {
  return axios.get(`${API_URL}user-details/${userId}/`);
};

export const createUserDetails = (detailsData) => {
  return axios.post(`${API_URL}user-details/`, detailsData);
};

export const updateUserDetails = (userId, detailsData) => {
  return axios.put(`${API_URL}user-details/${userId}/`, detailsData);
};

// EXERCISES (Global list)
export const fetchExercises = () => axios.get(`${API_URL}exercises/`);

export const createExercise = (exerciseData) =>
  axios.post(`${API_URL}exercises/`, exerciseData);

export const updateExercise = (exerciseId, exerciseData) =>
  axios.put(`${API_URL}exercises/${exerciseId}/`, exerciseData);

export const deleteExercise = (exerciseId) =>
  axios.delete(`${API_URL}exercises/${exerciseId}/`);

// USER EXERCISES (Exercises specific to a user)
export const fetchUserExercisesForUser = (userId) =>
  axios.get(`${API_URL}user-exercises/?user=${userId}`);

export const addUserExercise = (data) => {
  return axios.post(`${API_URL}user-exercises/`, data);
};

export const removeUserExercise = (userExerciseId) =>
  axios.delete(`${API_URL}user-exercises/${userExerciseId}/`);

// SETS
export const fetchSets = (userId) =>
  axios.get(`${API_URL}sets/?user_exercise__user=${userId}`);

export const createSet = (setData) => axios.post(`${API_URL}sets/`, setData);

export const updateSet = (setId, setData) =>
  axios.put(`${API_URL}sets/${setId}/`, setData);

export const deleteSet = (setId) => axios.delete(`${API_URL}sets/${setId}/`);

export const fetchSetsForUserExerciseOnDay = (userExerciseId, day) => {
  if (!userExerciseId || !day) {
    return Promise.reject(new Error("UserExercise ID and day are required"));
  }
  return axios.get(
    `${API_URL}sets/?user_exercise_id=${userExerciseId}&day=${day}`
  );
};

// DAYS OF EXERCISE
export const fetchDaysOfExercise = (userId) => {
  if (!userId) return Promise.resolve({ data: [] });
  return axios.get(`${API_URL}dayOfExercise/?user_exercise__user=${userId}`);
};
