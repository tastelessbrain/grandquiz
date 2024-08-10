import axios from 'axios'
import { useEffect, useState } from 'react'
import './App.css'
import { MyButton } from './MyButtons'

export const App = () => {
  const [data, setData] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)
  const [clickedButtons, setClickedButtons] = useState([])

  const getDataFromBackend = async () => {
    try {
      await axios.get("http://localhost:3000/GetData").then(
        (result) => {
          setData(result.data)
        }
      )
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getDataFromBackend()
  }, [])

  const handleButtonClick = (item) => {
    setSelectedItem(item)
    setClickedButtons([...clickedButtons, item.ID])
  }

  const handleClose = () => {
    setSelectedItem(null)
  }

  const questions = ["SHORT-LIST", "Blue Marble", "Wer Wars?", "WDYM", "Riddle me this!"]

  return (
    <div>
      <div style={{ display: "flex", flexDirection: "row" }}>
        {questions.map((question) => {
          const questionTypeData = data.filter((item) => item.QuestionType === question);

          return (
            <div style={{ display: "flex", flexDirection: "column", width: "16.6%" }}>
              <div style={{ textAlign: "center", fontSize: "3em", fontWeight: "400" }}>{question}</div>
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
                return (
                  <MyButton
                    title={item.Points}
                    key={item.ID}
                    color="white"
                    backgroundColor={clickedButtons.includes(item.ID) ? `${color}aa` : color}
                    onClick={() => handleButtonClick(item)}
                    height="150px"
                    fontSize="2em"
                    borderRadius="5px"
                    borderColor="white"
                  />
                );
              })}
            </div>
          );
        })}
      </div>
      {selectedItem && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}>
          <div style={{
            backgroundColor: "grey",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)"
          }}>
            <h2>{selectedItem.Content}</h2>
            <button onClick={handleClose}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}