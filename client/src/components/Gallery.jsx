import { useEffect, useState } from "react";
import { importAllImages } from "../utils/importImages";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "../styles/Gallery.css";

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [monthIndices, setMonthIndices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [swiper, setSwiper] = useState(null);
  const [activeMonthYear, setActiveMonthYear] = useState("");
  const [imageOrientations, setImageOrientations] = useState({});

  useEffect(() => {
    // Load images when component mounts
    const loadImages = async () => {
      try {
        const { images, monthIndices } = importAllImages();
        setImages(images);
        setMonthIndices(monthIndices);

        // Set initial active month/year
        if (images.length > 0) {
          setActiveMonthYear(images[0].monthYear);
        }

        // Preload images to determine orientation
        const orientations = {};
        const promises = images.map((image) => {
          return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
              orientations[image.src] =
                img.width >= img.height ? "horizontal" : "vertical";
              resolve();
            };
            img.onerror = () => {
              orientations[image.src] = "horizontal"; // Default to horizontal on error
              resolve();
            };
            img.src = image.src;
          });
        });

        await Promise.all(promises);
        setImageOrientations(orientations);
      } catch (error) {
        console.error("Error loading images:", error);
      } finally {
        setLoading(false);
      }
    };

    loadImages();
  }, []);

  // Handle month button click
  const handleMonthClick = (index, monthYear) => {
    if (swiper) {
      // No need for adjustment since we removed the loop mode
      swiper.slideTo(index);
      setActiveMonthYear(monthYear);
    }
  };

  // If loading or no images, show loading state
  if (loading) {
    return <div className="loading-message">Loading images...</div>;
  }

  if (images.length === 0) {
    return <div className="empty-message">No images found</div>;
  }

  return (
    <div className="gallery-container">
      {/* Gallery Container */}
      <div className="gallery-slider">
        <Swiper
          onSwiper={setSwiper}
          slidesPerView={3}
          spaceBetween={30}
          centeredSlides={true}
          loop={false}
          navigation={true}
          modules={[FreeMode, Navigation]}
          className="mySwiper"
          initialSlide={0}
          onSlideChange={(swiper) => {
            // Since loop is disabled, we can directly use the active index
            const activeIndex = swiper.activeIndex;
            if (images[activeIndex]) {
              setActiveMonthYear(images[activeIndex].monthYear);
            }
          }}
        >
          {images.map((image, index) => (
            <SwiperSlide key={`${image.monthYear}-${index}`}>
              {({ isActive, isNext, isPrev }) => (
                <div
                  className={`image-wrapper ${
                    isActive ? "active" : isNext || isPrev ? "adjacent" : ""
                  } ${imageOrientations[image.src] || ""}`}
                >
                  <img
                    src={image.src}
                    alt={`Month ${image.month}, Year ${image.year}`}
                    className={`gallery-image ${
                      imageOrientations[image.src] || ""
                    }`}
                  />
                </div>
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Month Navigation Buttons */}
      <div className="month-navigation">
        {monthIndices.map((firstImageMonth) => (
          <button
            key={`${firstImageMonth.key}`}
            onClick={() =>
              handleMonthClick(firstImageMonth.index, firstImageMonth.key)
            }
            className={`month-button ${
              activeMonthYear === firstImageMonth.key ? "active" : ""
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
