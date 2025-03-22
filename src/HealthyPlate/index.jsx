import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  Button,
  Box,
  Typography,
  LinearProgress,
  Card,
  CardMedia,
  CardContent,
  CircularProgress,
} from "@mui/material";
import api from "../api";
import "./index.css";

export default function HealthyPlate() {
  const { userId } = useContext(AuthContext);
  const [imageUrl, setImageUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [healthyScore, setHealthyScore] = useState(null);
  const [checkingScore, setCheckingScore] = useState(false);

  const pollForScore = async (imageKey) => {
    setCheckingScore(true);
    let attempts = 0;
    const maxAttempts = 5;

    while (attempts < maxAttempts) {
      try {
        const res = await api.post("/getAnalysis", {
          user_id: userId,
          image_key: imageKey,
        });

        if (res.data.healthy_score !== undefined) {
          setHealthyScore(res.data.healthy_score);
          setCheckingScore(false);
          return;
        }
      } catch (err) {
        console.log("Polling attempt", attempts + 1, "failed.");
      }

      await new Promise((resolve) => setTimeout(resolve, 3000));
      attempts++;
    }

    setCheckingScore(false);
    setHealthyScore("Not available");
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileExtension = file.name.split(".").pop().toLowerCase();
    const contentType = file.type || `image/${fileExtension}`;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Data = reader.result.split(",")[1];

      try {
        setUploading(true);
        setUploadProgress(0);
        setHealthyScore(null);
        setImageUrl(null);

        const response = await api.post(
          "/upload",
          {
            user_id: userId,
            file_extension: fileExtension,
            content_type: contentType,
            file_base64: base64Data,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
            onUploadProgress: (progressEvent) => {
              const percent = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress(percent);
            },
          }
        );

        const { image_url, image_key } = response.data;
        setImageUrl(image_url);
        pollForScore(image_key);
      } catch (error) {
        console.error("Upload failed:", error);
      } finally {
        setUploading(false);
      }
    };

    reader.readAsDataURL(file);
  };

  return (
    <Box className="healthy-container">
      <Typography variant="h4" className="healthy-title">
        Welcome to Healthy Plate
      </Typography>
      <Typography variant="body1" className="healthy-description">
        Discover a balanced and nutritious lifestyle. We help you make informed
        food choices to support your health goals.
      </Typography>

      <Box style={{ marginTop: "2rem" }}>
        <Button
          variant="contained"
          component="label"
          color="primary"
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Upload Image"}
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={handleImageUpload}
          />
        </Button>

        {uploading && (
          <Box className="upload-progress">
            <LinearProgress variant="determinate" value={uploadProgress} />
            <Typography variant="body2" style={{ marginTop: "0.5rem" }}>
              {uploadProgress}%
            </Typography>
          </Box>
        )}
      </Box>

      {imageUrl && (
        <Card className="upload-card">
          <CardMedia
            component="img"
            image={imageUrl}
            alt="Uploaded Image"
            className="upload-image"
          />
          <CardContent>
            <Typography variant="h6">Upload Complete</Typography>
            <Typography variant="body2" color="text.secondary">
              Your image has been successfully uploaded!
            </Typography>

            {checkingScore && (
              <Box mt={2} display="flex" alignItems="center" justifyContent="center">
                <CircularProgress size={20} sx={{ mr: 1 }} />
                <Typography variant="body2">Analyzing your food...</Typography>
              </Box>
            )}

            {!checkingScore && healthyScore !== null && (
              <Typography variant="h6" sx={{ mt: 2 }}>
                Healthy Score:{" "}
                <span
                  style={{
                    color:
                      healthyScore >= 70
                        ? "green"
                        : healthyScore >= 40
                        ? "orange"
                        : "red",
                  }}
                >
                  {healthyScore}
                </span>
              </Typography>
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
