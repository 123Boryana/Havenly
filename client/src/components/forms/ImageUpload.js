import Resizer from "react-image-file-resizer";
import axios from "axios";
import { Avatar } from "antd";

export default function ImageUpload({ ad, setAd }) {
  const handleUpload = async (e) => {
    try {
      let files = e.target.files;
      files = [...files];
      if (files?.length) {
        // console.log(files);
        setAd({ ...ad, uploading: true });

        files.map((file) => {
          new Promise(() => {
            Resizer.imageFileResizer(
              file,
              1080,
              720,
              "JPEG",
              100,
              0,
              async (uri) => {
                try {
                  // console.log("UPLOAD URI => ", uri);
                  const { data } = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/upload-image`, {
                    image: uri,
                  });
                  setAd((prev) => ({
                    ...prev,
                    photos: [data.location, ...prev.photos],
                    uploading: false,
                  }));
                } catch (err) {
                  console.log(err);
                  setAd({ ...ad, uploading: false });
                }
              },
              "base64"
            );
          });
        });
      }
    } catch (err) {
      console.log(err);
      setAd({ ...ad, uploading: false });
    }
  };

  const handleDelete = async (file) => {
    const answer = window.confirm("Желаете ли да изтриете снимката?");
    if (!answer) return;
    setAd({ ...ad, uploading: true });
    try {
      // const { data } = await axios.post("/remove-image", { location: file });
      // if (data?.ok) {
        setAd((prev) => ({
          ...prev,
          photos: prev.photos.filter((p) => p !== file),
          uploading: false,
        }));
      // }
    } catch (err) {
      console.log(err);
      setAd({ ...ad, uploading: false });
    }
  };

  return (
    <>
      <label className="btn btn-secondary mb-4">
        {ad.uploading ? "Зареждане..." : "Снимки"}
        <input
          onChange={handleUpload}
          type="file"
          accecp="image/*"
          multiple
          hidden
        />
      </label>
      {ad.photos?.map((file, index) => (
        <Avatar
          key={index}
          src={file}
          shape="square"
          size="46"
          className="ml-2 mb-4"
          onClick={() => handleDelete(file)}
        />
      ))}
    </>
  );
}