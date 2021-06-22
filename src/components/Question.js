import React from 'react';
import './Question.css';

function AnswerList(props)
{
    // if there are only 2 answers
    // we make radio inputs
    if(props.answers.length === 2)
    {
        return props.answers.map((item, index) => {
            return (<div key={index}>
                        <input type="radio" name="rb" value={item}></input>
                        <label>{ item }</label>
                    </div>);
        });
    }
    else
    {
        return props.answers.map((item, index) => {
            return (<div key={index}>
                        <input type="checkbox" value={item}></input>
                        <label>{ item }</label>
                    </div>);
        });
    }
}

class Question extends React.Component {
    constructor(props)
    {
        super(props);

        let answers = [props.quest.correct_answer, ...props.quest.incorrect_answers];
        answers = this.shuffle(answers);

        this.state = {
            correctAnswer: this.props.quest.correct_answer,
            answers: answers,
        }
    }

    shuffle(array) {
        return array.sort(() => Math.random() - 0.5);
    }

    componentDidUpdate(prevProps) {
        if (this.props.quest.correct_answer !== prevProps.quest.correct_answer)
        {
          let answers = [this.props.quest.correct_answer, ...this.props.quest.incorrect_answers];
          answers = this.shuffle(answers);
          this.setState({ correctAnswer: this.props.quest.correct_answer, answers: answers });
        }
    }

    render()
    {
        let question = this.props.quest.question;
        let difficulty = this.props.quest.difficulty;
        return (
            <div className="question">
                <div>{ question }</div>
                <div>Difficulty: {difficulty}</div>
                <form onSubmit={(e) => this.props.onQuestAnswer(e, question, this.state.answers, this.state.correctAnswer, difficulty)}>
                    <AnswerList answers={this.state.answers}/>
                    <button type="submit">Answer</button>
                </form>
            </div>
        );
    }
}

export default Question;