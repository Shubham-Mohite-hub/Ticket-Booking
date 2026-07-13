import { useAuth } from "../../context/AuthContext";

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-800">Welcome, {user?.name}!</h1>
      <p className="text-gray-500 mt-2">Role: {user?.role}</p>
    </div>
  );
};

export default Home;