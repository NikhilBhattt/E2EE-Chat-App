import axios from "axios";

const isAuthenticated = async () => {
  const token = localStorage.getItem("token");

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
