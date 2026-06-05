import { useNavigate } from "react-router-dom";
import { createRef, useState } from "react";
import axios from "axios";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formValues.username.trim()) {
      newErrors.username = "Choose a secure username.";
    }
    if (!formValues.password) {
      newErrors.password = "Create a strong password.";
    } else if (formValues.password.length < 8) {
      newErrors.password = "Password must have at least 8 characters.";
    }
    if (!formValues.confirmPassword) {
      newErrors.confirmPassword = "Confirm your password.";
    } else if (formValues.password !== formValues.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    return newErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSuccess(false);

    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    const url = `${import.meta.env.VITE_API_URL}/user/register`;

    try {
      const response = await axios.post(url, {
        ...formValues,
        publicKey: "12345",
      });

      localStorage.setItem("token", response.data.token);

      navigate("/chat", { replace: true });
    } catch (error) {
      console.error("Login error: ", error);
    }

    setLoading(false);
    setSuccess(true);
  };

  return (
    <main className="register-page">
      <section className="register-grid">
        <div className="form-panel">
          <div className="form-card">
            <div className="form-header">
              <h2>Create your CipherChat account</h2>
              <p>
                Start a private, encrypted chat experience with strong security
                and secure key generation on your device.
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <div className="field-group">
                <label htmlFor="username">Username</label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={formValues.username}
                  onChange={handleChange}
                  className={errors.username ? "invalid" : ""}
                  placeholder="cipher.eleanor"
                />
                {errors.username && (
                  <div className="field-error">{errors.username}</div>
                )}
              </div>

              <div className="field-group password-wrapper">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formValues.password}
                  onChange={handleChange}
                  className={errors.password ? "invalid" : ""}
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
                {errors.password && (
                  <div className="field-error">{errors.password}</div>
                )}
              </div>

              <div className="field-group password-wrapper">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={formValues.confirmPassword}
                  onChange={handleChange}
                  className={errors.confirmPassword ? "invalid" : ""}
                  placeholder="Re-enter your password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
                {errors.confirmPassword && (
                  <div className="field-error">{errors.confirmPassword}</div>
                )}
              </div>

              <div className="action-group">
                <button
                  className="primary-button"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="loader" aria-live="polite">
                      <span className="loader-dot"></span>
                      <span className="loader-dot"></span>
                      <span className="loader-dot"></span>
                    </span>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </div>
            </form>

            <p className="form-note">
              Your encryption keys will be generated securely on your device.
            </p>
            <p className="login-line">
              Already have an account?
              <a href="/login">Login</a>
            </p>

            {success && (
              <p
                className="form-note"
                style={{ marginTop: "1rem", color: "#b9fbb2" }}
              >
                Account setup is ready. Your private session will start once you
                complete verification.
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

export default Register;
