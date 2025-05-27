import './App.css';
import Header from './components/header/Header.tsx';
import Footer from './components/footer/Footer.tsx';
import { Route, Switch } from 'wouter';
import Home from './pages/Home.tsx';
import Authors from './pages/Authors.tsx';
const Blog = () => {
  return <div>Blog Works</div>;
};

function App() {
  return (
    <>
      <Header />
      <div className={'mt-8'}>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="authors" component={Authors} />
          <Route path="blog" component={Blog} />
        </Switch>
      </div>
      <Footer />
    </>
  );
}

export default App;
