import axios from "axios";

const API_KEY = "47359148-e6bdc7b546b5534c01c17ed5e";
const BASE_URL = "https://pixabay.com/api/";

/**
 
 * @param {string} query 
 * @param {number} page 
 * @param {number} perPage 
 * @returns {Promise<Object>} 
 */
export async function fetchImages(query, page = 1, perPage = 15) {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        key: API_KEY,
        q: query,
        image_type: "photo",
        orientation: "horizontal",
        safesearch: true,
        page,
        per_page: perPage,
      },
    });

    return response.data; 
  } catch (error) {
    console.error("Помилка при отриманні зображень:", error);
    throw error; 
  }
}