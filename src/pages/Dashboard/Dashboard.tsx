
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";




function Dashboard() {


  const user = useSelector((state: RootState) => state.auth.user);


  const handlelogout = async (e: React.FormEvent) => {
    e.preventDefault();

   

    try {
      console.log(user)
    } catch (err: any) {
      console.log(err)
    }
  };

  return (
    <div>
      <button onClick={handlelogout}>logout</button>
    </div>
  )
}

export default Dashboard