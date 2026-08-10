import { useState } from 'react';

function ImageUpload() {
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImageChange = e => {
    setImage(e.target.files[0]);
  };

  const uploadImage = async () => {
    if (!image) {
      alert('Please select an image');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append('file', image);
      formData.append('upload_preset', 'ToDoProfileImages');

      const response = await fetch(
        'https://api.cloudinary.com/v1_1/ToDoProfileImages/image/upload',
        {
          method: 'POST',
          body: formData,
        },
      );

      const data = await response.json();

      if (data.secure_url) {
        setImageUrl(data.secure_url);
        console.log('Uploaded Image URL:', data.secure_url);
      } else {
        console.error(data);
        alert('Image upload failed');
      }
    } catch (error) {
      console.error(error);
      alert('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-4">Upload Image</h2>

      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="mb-4"
      />

      <br />

      <button
        onClick={uploadImage}
        disabled={loading}
        className="bg-blue-600 text-white px-5 py-2 rounded"
      >
        {loading ? 'Uploading...' : 'Upload Image'}
      </button>

      {imageUrl && (
        <div className="mt-5">
          <p className="mb-2">Uploaded Image:</p>

          <img
            src={imageUrl}
            alt="Uploaded"
            className="w-64 h-64 object-cover rounded"
          />

          <p className="mt-3 break-all">{imageUrl}</p>
        </div>
      )}
    </div>
  );
}

export default ImageUpload;
