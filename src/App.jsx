import axios from 'axios'
import { useEffect, useState } from 'react'
import './App.css'
import { MyButton } from './MyButtons'



export const App = () => {
 //JS SCRIPT TEIL
  const [data,setData] =useState([])

  const getDataFromBackend = async () => {
    try{
      await axios.get("http://localhost:3000/GetData").then(
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
  //TODO: Kategorien (Questiontypes durch veränderbare Variablen ersetzen)

  //HTML DOKUMENTE
const questions = ["SHORT-LIST","Blue Marble","Wer Wars?","WDYM","Riddle me this!"]

return (
  <div>
    <div style={{ display: "flex", flexDirection: "row",}}>
      {questions.map((question) => {
        const questionTypeData = data.filter((item) => item.QuestionType === question);

        return (
          <div style={{ display: "flex", flexDirection: "column",width: "16.6%"}}>
            <div style={{ textAlign: "center", fontSize:"3em",fontWeight: "400" }}>{question}</div>
            {questionTypeData.map((item) => {
              let color;
              switch (item.QuestionType) {
                case "SHORT-LIST":
                  color = "red";
                  break;
                case "Blue Marble":
                  color = "blue";
                  break;
                case "Wer Wars?":
                  color = "green";
                  break;
                case "WDYM":
                  color = "orange";
                  break;
                case "Riddle me this!":
                  color = "black";
                  break;
                default:
                  color = "gray"; // default color
              }
              return <MyButton title={item.Points} key={item.ID} color="white" backgroundColor={color} height="150px" fontSize="2em" borderRadius="5px" borderColor="white" />;
            })}
          </div>
        );
      })}
    </div>
  </div>
);
}