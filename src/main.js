import { fetchImages } from "./js/pixabay-api.js";
import {
  clearGallery,
  toggleLoader,
  toggleLoadMoreButton,
  showMessage,
  renderGallery,
} from "./js/render-functions.js";

const searchForm = document.getElementById("search-form");
const loadMoreBtn = document.getElementById("load-more");

let currentPage = 1;
let searchQuery = "";
const IMAGES_PER_PAGE = 15;


searchForm.addEventListener("submit", onSearch);
loadMoreBtn.addEventListener("click", onLoadMore);

/**
 
 * @param {Event} event 
 */
async function onSearch(event) {
  event.preventDefault();

  searchQuery = searchForm.elements.query.value.trim();
  if (!searchQuery) {
    showMessage("warning", "Warning", "Please enter a search term.");
    return;
  }

  currentPage = 1;
  clearGallery();
  toggleLoader(true);
  toggleLoadMoreButton(false);

  try {
    const response = await fetchImages(searchQuery, currentPage, IMAGES_PER_PAGE);

    
    if (!response || !Array.isArray(response.hits)) {
      showMessage("error", "Error", "Invalid API response. Please try again.");
      return;
    }

    const images = response.hits;

    if (images.length === 0) {
      showMessage("info", "Info", "Sorry, no images found.");
      return;
    }

    renderGallery(images);
    showMessage("success", "Success", `Found ${response.totalHits} images.`);

    if (response.totalHits > IMAGES_PER_PAGE) {
      toggleLoadMoreButton(true);
    }
  } catch (error) {
    showMessage("error", "Error", "Failed to load images. Try again later.");
  } finally {
    toggleLoader(false);
  }
}


async function onLoadMore() {
  currentPage += 1;
  toggleLoader(true);

  try {
    const response = await fetchImages(searchQuery, currentPage, IMAGES_PER_PAGE);

    
    if (!response || !Array.isArray(response.hits)) {
      showMessage("error", "Error", "Invalid API response. Please try again.");
      return;
    }

    const images = response.hits;
    renderGallery(images);

    const totalPages = Math.ceil(response.totalHits / IMAGES_PER_PAGE);
    if (currentPage >= totalPages) {
      toggleLoadMoreButton(false);
      showMessage("info", "Info", "We're sorry, but you've reached the end of search results.");
    }

    smoothScroll();
  } catch (error) {
    showMessage("error", "Error", "Failed to load images. Try again later.");
  } finally {
    toggleLoader(false);
  }
}

function smoothScroll() {
  const { height: cardHeight } = document.querySelector(".gallery-item").getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: "smooth",
  });
}