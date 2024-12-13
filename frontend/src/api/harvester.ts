import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/harvester`;

export async function getHarvesters() {
    try {
        const response = await axios.get(`${API_URL}/list`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Ошибка при выполнении запроса:', error.response?.data);
        } else {
            console.error('Неизвестная ошибка:', error);
        }
        throw error;
    }
}