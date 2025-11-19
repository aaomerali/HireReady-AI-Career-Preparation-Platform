import { logout } from "../../firebase/auth";
import {
  setAuthLoading,
  setAuthError,
  setUser,
} from "../../redux/slices/authSlice";
import { useDispatch} from "react-redux";
import { useNavigate} from "react-router-dom";



function Dashboard() {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handlelogout = async (e: React.FormEvent) => {
    e.preventDefault();

    dispatch(setAuthLoading(true));
    dispatch(setAuthError(null));

    try {
      logout();
      dispatch(setUser(null));
      navigate("/login");
    } catch (err: any) {
      dispatch(setAuthError(err.message));
    } finally {
      dispatch(setAuthLoading(false));
    }
  };

  return (
    <div>
      <button onClick={handlelogout}>logout</button>
    </div>
  )
}

export default Dashboard