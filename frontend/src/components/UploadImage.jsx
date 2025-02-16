// src/components/UploadImage.jsx
import { useState } from "react";

const UploadImage = ({ onUpload, maxImages = 5 }) => {
  const [images, setImages] = useState([]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > maxImages) {
      alert(`You can upload a maximum of ${maxImages} images.`);
      return;
    }

    const newImages = files.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...newImages]);
    onUpload([...images, ...newImages]);
  };

  return (
    <div className="border-2 border-dashed p-6 text-center rounded-lg">
      <label className="cursor-pointer">
        <input
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
        <div className="flex flex-col items-center">
          <span className="material-icons text-gray-400 text-5xl">image</span>
          <p className="text-gray-600 mt-2">Upload Images</p>
          <p className="text-sm text-gray-500">
            Drop / browse / open camera to upload up to{" "}
            <span className="text-green-600">{maxImages} images</span>.
          </p>
        </div>
      </label>

      <div className="flex mt-4 space-x-2">
        {images.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Uploaded ${index}`}
            className="w-16 h-16 object-cover rounded-md"
          />
        ))}
      </div>
    </div>
  );
};

export default UploadImage;
