import './App.css';
import { Route, Routes } from 'react-router-dom';

import AddProductForm from './Components/Addnewproduct';
import Login from './Components/login';
import Signup from './Components/Signup';
import Packges from'./Components/Packges';
import Deliverypersonlist from './Components/Deliverypersonlist';
function App() {
  return (
   <div>
 <Routes>
        <Route path="/" element={<Login/>}  ></Route>
       <Route path="/signup" element={<Signup/>} ></Route>
        <Route path="/products" element={<AddProductForm/>} ></Route>
        <Route path="/Packges" element={<Packges/>} ></Route>
        <Route path="/Deliverypersonlist" element={<Deliverypersonlist/>} ></Route>

     </Routes>
    </div>
  );
}

export default App;
