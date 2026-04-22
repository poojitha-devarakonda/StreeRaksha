import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import StartTrip from '../src/Pages/StartTrip';
import NightMode from './Pages/NightMode';
import Guardians from './Pages/Guardians';
import AddGuardian from './Pages/AddGuardian';
import Wellness from './Pages/Wellness';
import Journal from './Pages/Journal';
import NewJournalEntry from './Pages/NewJournalEntry';
import AiCompanion from './Pages/AiCompanion';
import"./App.css"
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/start-trip" element={<StartTrip />} />
        <Route path="/night-mode" element={<NightMode />} />
        <Route path="/guardians" element={<Guardians />} />
        <Route path="/guardians-add" element={<AddGuardian />} />
         <Route path="/wellness" element={<Wellness />} />
         <Route path="/journal" element={<Journal />} />
         <Route path="/journal-new" element={<NewJournalEntry />} />
         <Route path="/ai-companion" element={<AiCompanion />} />
        
         
      </Routes>
    </BrowserRouter>
  );
}

export default App;
