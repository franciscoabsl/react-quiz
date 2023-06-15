import {useState} from 'react';
import Header from './components/Header';
import Main from './components/Main';

function App() {
	const [count, setCount] = useState(0);

	return (
		<>
			<div className="app">
				<Header />
				
				<Main>
					<p>1/15</p>
					<p>Questions?</p>
				</Main>
			</div>
		</>
	);
}

export default App;
