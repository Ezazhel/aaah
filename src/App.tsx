import './App.css';
import Header from './components/header/Header.tsx';
import Footer from './components/footer/Footer.tsx';
import { Route, Switch } from 'wouter';
import Home from './pages/Home.tsx';
import Authors from './pages/Authors.tsx';
import Actu from './pages/Actu.tsx';

function App() {
  return (
    <>
      <Header />
      <div className={'mt-8'}>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="members" component={Authors} />
          <Route path="actus" component={Actu} />
        </Switch>
      </div>
      <Footer />
    </>
  );
}

export default App;
