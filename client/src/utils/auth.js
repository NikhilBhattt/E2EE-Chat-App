import axios from "axios";

const isAuthenticated = async () => {
  const currUserId =
    sessionStorage.getItem("currUser") || localStorage.getItem("currUser");
  const token =
    localStorage.getItem(`token_${currUserId}`) ||
    sessionStorage.getItem("token");

  if (!token) return false;

  const url = `${import.meta.env.VITE_API_URL}/user/validate`;

  try {
    const response = await axios.post(
      url,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data.status === "success";
  } catch (error) {
    return false;
  }
};

export default isAuthenticated;
