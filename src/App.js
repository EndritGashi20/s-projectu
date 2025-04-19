import React, { useState, useCallback, useEffect, Suspense } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom';

//import Users from './user/pages/Users';
//import NewPlace from './places/pages/NewPlace';
//import UserPlaces from './places/pages/UserPlaces';
//import UpdatePlace from './places/pages/UpdatePlace';
//import Auth from './user/pages/Auth';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import { AuthContext } from './shared/context/auth-context';
import SearchPlaces from './places/components/SearchPlaces';
import SearchResults from './places/components/SearchResults';
import FavoritePlaces from './places/pages/FavoritePlaces';
import SinglePlace from './places/components/SinglePage';
import Footer from './shared/components/UIElements/Footer';
import LoadingSpinner from './shared/components/UIElements/LoadingSpinner';

const Users = React.lazy(()=>import('./user/pages/Users'));
const NewPlace = React.lazy(() => import('./places/pages/NewPlace'));
const UserPlaces = React.lazy(()=>import('./places/pages/UserPlaces'));
const UpdatePlace = React.lazy(()=>import('./places/pages/UpdatePlace'));
const Auth = React.lazy(()=>import('./user/pages/Auth'));




let logoutTimer;

const App = () => {
  const [token, setToken] = useState(false);
  const [tokenExpirationDate, setTokenExpirationDate] = useState();
  const [userId, setUserId] = useState(false);

  const login = useCallback((uid, token, expirationDate) => {
    setToken(token);
    setUserId(uid);
    const tokenExpirationDate =
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
    setTokenExpirationDate(tokenExpirationDate);
    localStorage.setItem(
      'userData',
      JSON.stringify({
        userId: uid,
        token: token,
        expiration: tokenExpirationDate.toISOString()
      })
    );
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setTokenExpirationDate(null);
    setUserId(null);
    localStorage.removeItem('userData');
  }, []);

  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userData'));
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      login(storedData.userId, storedData.token, new Date(storedData.expiration));
    }
  }, [login]);

  let routes;


  if (token) {
    routes = (
      <Switch>
        <Route path="/" exact>
        <SearchPlaces />
        </Route>
        <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>
        <Route path="/places/new" exact>
          <NewPlace />
        </Route>
        <Route path="/places/:placeId">
          <UpdatePlace />
        </Route>
        <Route path="/profiles">
          <Users />
        </Route>
        <Route path="/SinglePlace/:placeId" exact>
          <SinglePlace />
        </Route>
        <Route path="/search">
          <SearchResults />
        </Route>
        <Route path="/favorites/:userId">
          <FavoritePlaces />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact>
          <SearchPlaces />
        </Route>
        <Route path="/SinglePlace/:placeId" exact>
          <SinglePlace />
        </Route>
        <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>
        <Route path="/auth">
          <Auth />
        </Route>
        <Route path="/profiles">
          <Users />
        </Route>
        <Route path="/search">
          <SearchResults />
        </Route>
        <Route path="/favorites/:userId">
          <FavoritePlaces />
        </Route>
        <Redirect to="/auth" />
      </Switch>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        login: login,
        logout: logout
      }}
    >
      <Router>
        <MainNavigation />
        <main><Suspense fallback={
          <div className='center'><LoadingSpinner/></div>
        }>{routes}</Suspense></main>
        <Footer />
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
