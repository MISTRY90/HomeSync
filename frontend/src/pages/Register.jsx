import React, { useState } from "react";
import {
  Typography,
  Button,
  Container,
  Box,
  TextField,
  CircularProgress,
  Alert,
  AlertTitle,
  LinearProgress,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../store/slices/authSlice";
import { Link, useNavigate } from "react-router-dom";
import {
  registerSchema,
  calculatePasswordStrength,
  getPasswordStrengthLabel,
} from "../utils/validation";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user types
    if (errors[name]) {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }
  };

  const validateForm = () => {
    const { error } = registerSchema.validate(formData, { abortEarly: false });

    if (error) {
      const newErrors = {};
      error.details.forEach((detail) => {
        newErrors[detail.path[0]] = detail.message;
      });
      setErrors(newErrors);
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    dispatch(
      registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      })
    )
      .unwrap()
      .then(() => {
        navigate("/login");
      });
  };

  const passwordStrength = calculatePasswordStrength(formData.password);
  const strengthColor =
    passwordStrength < 40
      ? "error"
      : passwordStrength < 70
      ? "warning"
      : "success";

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Register
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            <AlertTitle>{error.message}</AlertTitle>
            {Array.isArray(error.details) ? (
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                {error.details.map((msg, i) => (
                  <li key={i}>{msg}</li>
                ))}
              </ul>
            ) : (
              error.message || "Registration failed"
            )}
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Name"
            name="name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={formData.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
            required
          />

          <TextField
            label="Email"
            name="email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            required
          />

          <TextField
            label="Password"
            name="password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={formData.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
            required
          />

          {formData.password && (
            <Box sx={{ width: "100%", mb: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={passwordStrength}
                  color={strengthColor}
                  sx={{ height: 6, flexGrow: 1 }}
                />
                <Typography variant="caption" color={`${strengthColor}.main`}>
                  {getPasswordStrengthLabel(passwordStrength)}
                </Typography>
              </Box>
            </Box>
          )}

          <TextField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
            required
          />
          <Box sx={{ mt: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Password must contain:
            </Typography>
            <ul style={{ marginTop: 4, paddingLeft: 20 }}>
              <li>At least 8 characters</li>
              <li>One uppercase letter</li>
              <li>One lowercase letter</li>
              <li>One number</li>
              <li>No special characters</li>
            </ul>
          </Box>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Register"}
          </Button>
        </form>

        <Typography variant="body2" sx={{ mt: 2 }}>
          Already have an account?{" "}
          <Link to="/login" style={{ textDecoration: "none", color: "blue" }}>
            Login here
          </Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default Register;
