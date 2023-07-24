import './App.css';
import { Route, Routes } from 'react-router-dom';
import DeliveryPersonOrders from './Components/DeliveryPersonOrders';
import AddProductForm from './Components/Addnewproduct';
import Signup from './Components/Signup';
import Login from './Components/login';
import Deliverypersons from './Components/Deliverypersons';
import Addpa from './Components/Addpa';
import Orders from './Components/Orders';
import Customers from './Components/Customers';
import Logout from './Components/Logout';
function App() {
  return (
   <div>
 <Routes>
        <Route path="/" element={<Login/>}  ></Route>
       <Route path="/signup" element={<Signup/>} ></Route>
        <Route path="/products" element={<AddProductForm/>} ></Route>
        <Route path="/Deliverypersons" element={<Deliverypersons/>} ></Route>
        <Route path="/Add" element={<Addpa/>} ></Route>
        <Route path="/o" element={<Orders/>} ></Route>
        <Route path="/customers" element={<Customers/>} ></Route>
        <Route path="/logout" element={<Logout/>} ></Route>


        <Route path="/DeliveryPersonOrders" element={<DeliveryPersonOrders/>} ></Route>


     </Routes>
    </div>
  );
}

export default App;
