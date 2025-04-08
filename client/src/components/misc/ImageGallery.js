import { useParams } from "react-router-dom";
import { useState } from "react";
import Lightbox from "react-18-image-lightbox";
import "react-18-image-lightbox/style.css"; 

export default function ImageGallery({ photos }) {
  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  const params = useParams();

  const photoUrls = photos.map((photo) => photo.src);

  return (
    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            photos.length === 1
              ? "1fr" 
              : "repeat(auto-fit, minmax(250px, 1fr))", 
          gap: "10px",
          padding: "10px",
          justifyItems: photos.length === 1 ? "center" : "stretch", 
          maxWidth: "1200px", 
          margin: "0 auto", 
        }}
      >
        {photos.map((photo, index) => (
          <div
            key={index}
            style={{
              cursor: "pointer",
              overflow: "hidden",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              width: photos.length === 1 ? "50%" : "100%", 
              maxWidth: "600px", 
            }}
            onClick={() => {
              setPhotoIndex(index);
              setIsOpen(true);
            }}
          >
            <img
              src={photo.src}
              alt={`Photo ${index}`}
              style={{
                width: "100%",
                height: "200px", 
                objectFit: "cover", 
                transition: "transform 0.3s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")} 
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")} 
            />
          </div>
        ))}
      </div>

      {isOpen && (
        <Lightbox
          mainSrc={photoUrls[photoIndex]}
          nextSrc={photoUrls[(photoIndex + 1) % photoUrls.length]}
          prevSrc={photoUrls[(photoIndex - 1 + photoUrls.length) % photoUrls.length]}
          onCloseRequest={() => setIsOpen(false)}
          onMovePrevRequest={() =>
            setPhotoIndex((photoIndex - 1 + photoUrls.length) % photoUrls.length)
          }
          onMoveNextRequest={() =>
            setPhotoIndex((photoIndex + 1) % photoUrls.length)
          }
          enableZoom={true} 
        />
      )}
    </>
  );
}