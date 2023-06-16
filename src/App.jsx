import {useEffect, useState} from 'react';
import Header from './components/Header';
import Error from './components/Error';
import Loader from './components/Loader';
import Main from './components/Main';
import {useReducer} from 'react';
import StartScreen from './components/StartScreen';
import Question from './components/Question';
import NextButton from './components/NextButton';
import Progress from './components/Progress';
import FinishScreen from './components/FinishScreen';
import Footer from './components/Footer';
import Timer from './components/Timer';

const initialState = {
	questions: [],
	status: 'loading', // loading, error, ready, active, finished
	index: 0,
	answer: null,
	points: 0,
	highScore: 0,
	secondsRemaining: 10
};

function reducer(state, action) {
	switch (action.type) {
		case 'dataReceived':
			return {
				...state,
				questions: action.payload,
				status: 'ready'
			};
		case 'dataFailed':
			return {
				...state,
				status: 'error'
			};
		case 'start':
			return {
				...state,
				status: 'active'
			};
		case 'newAnswer':
			const question = state.questions.at(state.index);

			return {
				...state,
				answer: action.payload,
				points:
					action.payload === question.correctOption
						? state.points + question.points
						: state.points
			};
		case 'nextQuestion':
			return {
				...state,
				index: state.index + 1,
				answer: null
			};
		case 'finish':
			return {
				...state,
				status: 'finished',
				highScore:
					state.points > state.highScore
						? state.points
						: state.highScore
			};
		case 'restart':
			return {
				...initialState,
				status: 'ready', // loading, error, ready, active, finished
				highScore: state.highScore,
				questions: state.questions
			};
		case 'tick':
			return {
				...state,
				secondsRemaining: state.secondsRemaining - 1,
			};

		default:
			throw new Error('Action unknown');
	}
}

function App() {
	const [{questions, status, index, answer, points, highScore, secondsRemaining}, dispatch] =
		useReducer(reducer, initialState);

	const numQuestions = questions.length;
	const maxPossiblePoints = questions.reduce(
		(prev, cur) => prev + cur.points,
		0
	);

	useEffect(() => {
		fetch('http://localhost:8000/questions/')
			.then((res) => res.json())
			.then((data) => dispatch({type: 'dataReceived', payload: data}))
			.catch((err) => dispatch({type: 'dataFailed'}));
	}, []);

	return (
		<>
			<div className='app'>
				<Header />
				<Main>
					{status == 'loading' && <Loader />}
					{status == 'error' && <Error />}
					{status == 'ready' && (
						<StartScreen
							numQuestions={numQuestions}
							dispatch={dispatch}
							answer={answer}
						/>
					)}
					{status == 'active' && (
						<>
							<Progress
								index={index}
								numQuestions={numQuestions}
								points={points}
								maxPossiblePoints={maxPossiblePoints}
								answer={answer}
							/>
							<Question
								question={questions[index]}
								dispatch={dispatch}
								answer={answer}
							/>
							<Footer>
								<NextButton
									dispatch={dispatch}
									answer={answer}
									numQuestions={numQuestions}
									index={index}
								/>
								<Timer dispatch={dispatch} secondsRemaining={secondsRemaining}/>
							</Footer>
						</>
					)}
					{status === 'finished' && (
						<FinishScreen
							points={points}
							maxPossiblePoints={maxPossiblePoints}
							highScore={highScore}
							dispatch={dispatch}
						/>
					)}
				</Main>
			</div>
		</>
	);
}

export default App;
