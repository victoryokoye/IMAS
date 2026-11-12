import AppRoutes from "./routes/AppRoutes";
import { useAuthBootstrap } from "./hooks/useAuth";

export default function App() {
  useAuthBootstrap();
  return <AppRoutes />;
}
