import Resizer from "react-image-file-resizer";
import axios from "axios";
import { Avatar } from "antd";
import { useAuth } from "../../context/auth";

export default function ProfileUpload({ photo, setPhoto, uploading, setUploading }) {
  // Context
  const [auth, setAuth] = useAuth();

  const handleUpload = async (e) => {
    try {
      const file = e.target.files[0]; // Get the first file

      if (file) {
        setUploading(true);

        Resizer.imageFileResizer(
          file,
          1080,
          720,
          "JPEG",
          100,
          0,
          async (uri) => {
            try {
              const { data } = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/upload-image`, { image: uri });
              console.log("Upload response:", data); // Debugging response
              setPhoto(data.location); // Update photo state with the image URL
              setUploading(false);
            } catch (err) {
              console.error("Error uploading image:", err);
              setUploading(false);
            }
          },
          "base64"
        );
      }
    } catch (err) {
      console.error("Error handling file upload:", err);
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    const answer = window.confirm("Желаете ли да изтриете снимката?");
    if (!answer) return;
  
    setUploading(true);
  
    try {
      // Extract the S3 key from the photo URL
      const key = photo.split("https://havenly-bucket.s3.amazonaws.com/")[1];
      const bucket = "havenly-bucket";
  
      const { data } = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/remove-image`, { Key: key, Bucket: bucket });
  
      if (data?.ok) {
        setPhoto(null);
        setUploading(false);
      }
    } catch (err) {
      console.error("Error deleting image:", err);
      setUploading(false);
    }
  };
  

  return (
    <>
      <label className="btn btn-secondary mb-4 mt-4">
        {uploading ? "Зареждане..." : "Снимка"}
        <input
          onChange={handleUpload}
          type="file"
          accept="image/*"
          hidden
        />
      </label>
      {photo ? (
        <Avatar
          src={photo} // Use the photo URL directly
          shape="square"
          size="46"
          className="ml-2 mb-4 mt-4"
          onClick={handleDelete}
        />
      ) : null}
    </>
  );
}
