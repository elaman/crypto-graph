import './App.css';
import Graphic from './components/Graphic/Graphic';
import Input from './components/Input/Input';
import List from './components/List/List';
import { url } from './url';
import axios from 'axios'; 
import { useState } from 'react';



function App() {
  
const [inpValue, setInpValue] = useState("");

function logReasult(){
  console.log(url(inpValue));
  axios.get(url(inpValue))
  .then(
    (res)=>{
      console.log(res.data);
    }
  )
}

  
  return (
    <div className="App">
      <Input set = {setInpValue} log = {logReasult}/>
      <List/>
      <Graphic/>
    </div>
  );
}

export default App;
