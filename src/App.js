import './App.css';
import React from 'react';
import Question from './components/Question';

// form to enter Number of Questions
function NumOfQuestionsInput(props)
{
  return (<div>
          <label>Enter number of Questions: </label>
          <input id="numOfQuestions" type="number" min='1' max='50'/>
          <button onClick={props.onClick}>Submit</button>
        </div>);
}

// List of results
function QuestionareResults(props)
{
  let difficultyColor = (difficulty) => {
    if(difficulty === 'easy')
    {
      return {backgroundColor: 'green'};
    }
    if(difficulty === 'medium')
    {
      return {backgroundColor: 'yellow'};
    } 
    return {backgroundColor: 'red'};
  };
  
  return props.results.map((item, index) => 
    {
    return (<div key={index} style={difficultyColor(item.difficulty)} className="result-item">
        <div className="question result"> {item.question}</div>
        <div className="difficulty"><label>Difficulty:</label> {item.difficulty}</div>
        <div className="correct-answer"><label>Correct Answer:</label> {item.correctAnswer}</div> 
        <div className="user-answer"><label>Your Answer:</label>  
          {item.checkedAnswers.map((item, index) => <span key={index}>{item}</span>)}</div> 
      </div>);
  });
}

class App extends React.Component {
  constructor(props)
  {
    super(props);

    // currentQuestion - number of question in questions array
    // results - array in which question results are written
    // results - array of objects
    /* results[i] = ({{
      question: question,
      checkedAnswers: checkedAnswers,
      correctAnswer: correctAnswer,
      difficulty: difficulty,
    }})*/
    this.state = {
      questions: [],
      currentQuestion: Number,
      results: [],
    }

    this.fetchQuestions = this.fetchQuestions.bind(this);
    this.onQuestAnswer = this.onQuestAnswer.bind(this);
  }

  render()
  {
    return (
      <div className="App">
        {/* before questions are fetched (questions.length === 0) form which asks 
        how many questions you want to have in questionare */}
        { this.state.questions.length === 0 ? <NumOfQuestionsInput onClick={this.fetchQuestions}/> : null }

        {/* when questions are fetched questions are shown one by one */}
        { this.state.questions.length !== 0 && this.state.questions.length !== this.state.results.length ?
          <Question
          quest={this.state.questions[this.state.currentQuestion]}
          onQuestAnswer={this.onQuestAnswer}/>
          : null }

        {/* after all questions are answered we show results */}
        { this.state.questions.length === this.state.results.length ?
          <QuestionareResults results={this.state.results}/>
          : null }
      </div>
    );
  }

  onQuestAnswer(e, question, answers, correctAnswer, difficulty)
  {
    e.preventDefault();
    
    let checkedAnswers = [];
    for(let i = 0; i < 4; i++)
    {
      if(typeof e.target[i] !== 'undefined' && e.target[i].checked)
      {
        checkedAnswers = [...checkedAnswers, answers[i]];
      }
    }

    let result = {
      question: question,
      checkedAnswers: checkedAnswers,
      correctAnswer: correctAnswer,
      difficulty: difficulty,
    }

    this.setState({
      currentQuestion: (this.state.currentQuestion + 1) % this.state.questions.length,
      results: [...this.state.results, result].sort((a, b) => {
        let difLvl = {'easy': 1, 'medium': 2, 'hard': 3};
        return difLvl[a.difficulty] > difLvl[b.difficulty];
      })
    });

    e.target[0].checked = false;
    e.target[1].checked = false;
    if(typeof e.target[2] !== 'undefined') e.target[2].checked = false;
    if(typeof e.target[3] !== 'undefined') e.target[3].checked = false;
  }

  fetchQuestions()
  {
    let QuestNum = document.getElementById('numOfQuestions').value;
    fetch('https://opentdb.com/api.php?amount=' + QuestNum)
    .then((res) => res.json())
    .then((data) => {
      let results = data.results.map(element => {
        let parser = new DOMParser();
        element.question = parser.parseFromString(element.question, 'text/html').body.innerHTML;
        element.correct_answer = parser.parseFromString(element.correct_answer, 'text/html').body.innerHTML;
        element.incorrect_answers = element.incorrect_answers.map(answer => {
          answer = parser.parseFromString(answer, 'text/html').body.innerHTML;
          return answer;
        });
        return element;
      });
      this.setState({ questions: results, currentQuestion: 0 });
    })
  }
}

export default App;
