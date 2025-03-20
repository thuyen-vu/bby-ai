import { useEffect, useState } from "react";
import { importAllImages } from "../utils/importImages";
import "../styles/Gallery.css";

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [monthIndices, setMonthIndices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load images when component mounts
    const loadImages = async () => {
      try {
        const { images, monthIndices } = importAllImages();
        setImages(images);
        setMonthIndices(monthIndices);
      } catch (error) {
        console.error("Error loading images:", error);
      } finally {
        setLoading(false);
      }
    };

    loadImages();
  }, []);

  // Current center image index - default to 0, only set if we have images
  const [currentIndex, setCurrentIndex] = useState(0);

  // Calculate which images to display based on current index
  const getVisibleImages = () => {
    if (images.length === 0) return [];

    // For first image, we need special handling
    if (currentIndex === 0) {
      return [
        { ...images[images.length - 1], position: "left" },
        { ...images[currentIndex], position: "center" },
        { ...images[currentIndex + 1], position: "right" },
      ];
    }
    // For last image, we need special handling
    else if (currentIndex === images.length - 1) {
      return [
        { ...images[currentIndex - 1], position: "left" },
        { ...images[currentIndex], position: "center" },
        { ...images[0], position: "right" },
      ];
    }
    // Standard case
    else {
      return [
        { ...images[currentIndex - 1], position: "left" },
        { ...images[currentIndex], position: "center" },
        { ...images[currentIndex + 1], position: "right" },
      ];
    }
  };

  // Handle navigation
  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Handle month button click
  const handleMonthClick = (index) => {
    setCurrentIndex(index);
  };

  // If loading or no images, show loading state
  if (loading) {
    return <div className="loading-message">Loading images...</div>;
  }

  if (images.length === 0) {
    return <div className="empty-message">No images found</div>;
  }

  const visibleImages = getVisibleImages();

  const currentMonthYear = images[currentIndex]?.monthYear;

  return (
    <div className="gallery-container">
      {/* Gallery Container */}
      <div className="gallery-slider">
        {/* Navigation Arrows */}
        <button
          onClick={handlePrev}
          className="nav-button prev-button"
          aria-label="Previous image"
        >
          ←
        </button>

        {/* Images Container */}
        <div className="images-container">
          {visibleImages.map((image) => (
            <div
              key={`${image.monthYear}-${image.position}`}
              className={`image-wrapper ${image.position}`}
            >
              <img
                src={image.src}
                alt={`Month ${image.month}, Year ${image.year}`}
                className="gallery-image"
              />
            </div>
          ))}
        </div>

        <button
          onClick={handleNext}
          className="nav-button next-button"
          aria-label="Next image"
        >
          →
        </button>
      </div>

      {/* Month Navigation Buttons */}
      <div className="month-navigation">
        {monthIndices.map((firstImageMonth) => (
          <button
            key={`${firstImageMonth.key}`}
            onClick={() => handleMonthClick(firstImageMonth.index)}
            className={`month-button ${
              firstImageMonth.key === currentMonthYear ? "active" : ""
            }`}
          >
            {`${firstImageMonth.month}/${firstImageMonth.year}`}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
