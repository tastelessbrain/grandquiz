import axios from 'axios'
import { useEffect, useState } from 'react'
import './App.css'
import { MyButton } from './MyButtons'



export const App = () => {
 //JS SCRIPT TEIL
  const [data,setData] =useState([])

  const getDataFromBackend = async () => {
    try{
      await axios.get("http://localhost:3000/QuestionsTable").then(
        (result) => {
          setData(result.data)
        }
      )
    }catch (error){
      console.log(error)
    }
  }
  
  useEffect(( ) => { 

  getDataFromBackend()
  
  }, [])
  
  //TODO: Baue ein Hauptfenster 
  //TODO: Baue eine Componente für die Button mit verschiedenen Props wie z.b. Frage, Antworten,
  //TODO  Gruppen anzeige Screen 
  //TODO: Gruppen Punkte Counter Componente (Punkte Stand Decrease Increase button machen Punkte Variable in dieser Componente)

  //HTML DOKUMENTE
  return (
<div>
  <div>Hello World</div>
  { 
    data.map((item) => {
      
      if(item.ID == 1){
        return <MyButton key={item.ID} color={"red"}/>
      }else{
        return <button onClick={( ) => console.log(item.Content) } key={item.ID} />
      }
      
    })
  }
</div>
  )
}