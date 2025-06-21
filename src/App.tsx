import Header from './components/header/Header.tsx';
import Footer from './components/footer/Footer.tsx';
import { Route, Router, Switch } from 'wouter';
import Home from './pages/Home.tsx';
import Authors from './pages/Authors.tsx';
import Actu from './pages/Actu.tsx';
import PostDetail from './features/Post/PostDetail.tsx';

function App() {
  return (
    <>
      <Router base="/aaah">
        <Header />
        <div className={'max-w-7xl mt-8 mx-auto'}>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/members" component={Authors} />
            <Route path="/actus" nest>
              <Route path="/" component={Actu} />
              <Route path="/:slug">{(params) => <PostDetail slug={params.slug} />}</Route>
            </Route>
          </Switch>
        </div>
        <Footer />
      </Router>
    </>
  );
}

export default App;
