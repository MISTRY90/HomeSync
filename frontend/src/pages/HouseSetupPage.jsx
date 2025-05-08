// src/pages/HouseSetupPage.jsx
import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  Container,
  Box,
  TextField,
  CircularProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { createHouse, fetchHouses } from "../store/slices/houseSlice";
import { useNavigate } from "react-router-dom";

const timezones = [
  { value: "UTC", label: "UTC" },
  { value: "GMT", label: "GMT" },
  { value: "EST", label: "Eastern Standard Time (EST)", offset: "-05:00" },
  { value: "CST", label: "Central Standard Time (CST)", offset: "-06:00" },
  { value: "MST", label: "Mountain Standard Time (MST)", offset: "-07:00" },
  { value: "PST", label: "Pacific Standard Time (PST)", offset: "-08:00" },
];

const HouseSetupPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, houses } = useSelector((state) => state.houses);
  const { isAuthenticated , user:userId } = useSelector((state) => state.auth);
  const [houseName, setHouseName] = useState("");
  const [description, setDescription] = useState("");
  const [timezone, setTimezone] = useState("");

  
  useEffect(() => {
    if (!loading && houses.length > 0) {
      navigate('/dashboard');
    }
  }, [houses, loading, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      createHouse({
        name: houseName,
        description,
        timezone: timezone || "UTC",
      })
    )
      .unwrap()
      .then(() => {
        navigate("/dashboard");
      });
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Setup Your House
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="House Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={houseName}
            onChange={(e) => setHouseName(e.target.value)}
            required
          />
          <TextField
            label="Description"
            variant="outlined"
            fullWidth
            margin="normal"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Timezone</InputLabel>
            <Select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              label="Timezone"
            >
              {timezones.map((tz) => (
                <MenuItem key={tz.value} value={tz.value}>
                  {tz.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {error && <Typography color="error">{error}</Typography>}
          <Button 
            type="submit" 
            variant="contained" 
            fullWidth 
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Create House"}
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default HouseSetupPage;