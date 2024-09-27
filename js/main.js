        document.addEventListener('DOMContentLoaded', function() {
            // Add event listeners to all buttons
            for (let i = 1; i <= 25; i++) {
                document.getElementById(`btn${i}`).addEventListener('click', () => handleButtonClick(i));
            }
        });

        function handleButtonClick(buttonId) {
            fetchQuestionData(buttonId)
                .then(data => displayQuestion(data))
                .catch(error => console.error('Error fetching question data:', error));
        }

        function fetchQuestionData(buttonId) {
            return fetch('http://192.168.4.1:3000/query', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ query: `
                    SELECT Fragen.FRAGE, Fragen.ANTWORT, Fragen.FRAGE_TYP, Medien.Media, Medien.Type AS MediaType
                    FROM Fragen
                    LEFT JOIN Medien ON Fragen.MEDIA = Medien.ID
                    WHERE Fragen.ID = ${buttonId}
                ` })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            });
        }

        function displayQuestion(data) {
            console.log('Empfangene Daten:', data);
            const questionContainer = document.querySelector('.quest');
            questionContainer.innerHTML = '';
        
            if (data[0].FRAGE) {
                const questionEl = document.createElement('h1');
                questionEl.className = 'questionEl';
                questionEl.innerHTML = data[0].FRAGE;
                questionEl.dataset.question = data[0].FRAGE;
                questionContainer.appendChild(questionEl);
            }
        
            if (data[0].MediaType === 'Bild' && data[0].Media) {
                const imgEl = document.createElement('img');
                imgEl.className = 'qimg';
                imgEl.src = data[0].Media;
                questionContainer.appendChild(imgEl);
            }
        
            if (data[0].MediaType === 'Audio' && data[0].Media) {
                const audioEl = document.createElement('audio');
                audioEl.className = 'qaudio';
                audioEl.controls = true;
                const sourceEl = document.createElement('source');
                sourceEl.src = data[0].Media;
                sourceEl.type = 'audio/mpeg';
                audioEl.appendChild(sourceEl);
                questionContainer.appendChild(audioEl);
            }
        
            // Button-Container erstellen
            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'button-container';
        
            const backBtn = document.createElement('input');
            backBtn.type = 'button';
            backBtn.className = 'backBtn';
            backBtn.value = 'Back';
            backBtn.addEventListener('click', handleBackButtonClick);
            buttonContainer.appendChild(backBtn);
        
            const showBtn = document.createElement('input');
            showBtn.type = 'button';
            showBtn.className = 'show';
            showBtn.value = 'Show Answer';
            showBtn.addEventListener('click', () => handleShowButtonClick(data[0].ANTWORT));
            buttonContainer.appendChild(showBtn);
        
            questionContainer.appendChild(buttonContainer);
        
            const rows = document.querySelectorAll('.board .row');
            rows.forEach(row => row.style.display = 'none');
            document.querySelector('.round-info').style.display = 'none';
            questionContainer.style.display = 'block';
        }
        

        function handleBackButtonClick() {
            const rows = document.querySelectorAll('.board .row');
            rows.forEach(row => row.style.display = 'block');
            document.querySelector('.round-info').style.display = 'block';
            document.querySelector('.quest').style.display = 'none';
        }

        function handleShowButtonClick(answer) {
            const showBtn = document.querySelector('.show');
            const questionEl = document.querySelector('.questionEl');

            if (showBtn.classList.contains('showned')) {
                showBtn.classList.remove('showned');
                showBtn.value = 'Show Answer';
                questionEl.innerHTML = questionEl.dataset.question;
            } else {
                showBtn.classList.add('showned');
                showBtn.value = 'Show Question';
                questionEl.innerHTML = answer;
            }
        }
