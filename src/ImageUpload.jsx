import React, { useState } from "react";
import axios from "axios";

const ImageUpload = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [uploading, setUploading] = useState(false);

    // Handles file selection
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedImage(file);
        setPreview(URL.createObjectURL(file)); // Preview the selected image
    };

    // Handles the upload process
    const handleUpload = async () => {
        if (!selectedImage) {
            alert("Please select an image first.");
            return;
        }

        setUploading(true);

        try {
            const data = {
                user_id: "1a2b3c4d5e6f7g8h9i0j", 
                image: selectedImage,
                file_extension: selectedImage.name.split(".").pop(),
            }

            const response = await axios.post("https://sq9mg70ri1.execute-api.us-east-2.amazonaws.com/prod/upload", data, {
                headers: { "Content-Type": "application/json" }
            });

            alert("Image uploaded successfully!");
            // console.log("Uploaded image key:", image_key);
        } catch (error) {
            console.error("Upload failed:", error);
            alert("Upload failed. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h2>Upload an Image</h2>
            
            <input type="file" accept="image/*" onChange={handleFileChange} />

            {preview && (
                <div>
                    <h3>Preview:</h3>
                    <img src={preview} alt="Preview" style={{ width: "200px", marginTop: "10px" }} />
                </div>
            )}

            <button onClick={handleUpload} disabled={uploading} style={{ marginTop: "10px" }}>
                {uploading ? "Uploading..." : "Upload Image"}
            </button>
        </div>
    );
};

export default ImageUpload;
