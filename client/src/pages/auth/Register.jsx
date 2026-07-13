import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import { ROLES } from "../../utils/roles";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: ROLES.CUSTOMER,
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await register(formData);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>

        {error && (
          <p className="mb-4 text-sm text-red-600 bg-red-50 p-2 rounded-md">{error}</p>
        )}

        <form onSubmit={handleSubmit}>
          <Input
            id="name"
            name="name"
            type="text"
            label="Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <Input
            id="email"
            name="email"
            type="email"
            label="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <Input
            id="password"
            name="password"
            type="password"
            label="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <div className="mb-4">
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={ROLES.CUSTOMER}>Customer</option>
              <option value={ROLES.ORGANIZER}>Organizer</option>
              <option value={ROLES.ADMIN}>Admin</option>
            </select>
          </div>

          <Button type="submit" isLoading={isSubmitting} className="w-full mt-2">
            Register
          </Button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </Card>
    </div>
  );
};

export default Register;