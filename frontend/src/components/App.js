import { useEffect, useState } from "react";
import { Route, Switch, withRouter, Redirect } from "react-router-dom";
import api from "../utils/api";
import * as auth from "../utils/auth";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import Login from "./Login";
import Register from "./Register";
import ProtectedRoute from "./ProtectedRoute";
import ImagePopup from "./ImagePopup";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import ConfirmationPopup from "./ConfirmationPopup";
import AddPlacePopup from "./AddPlacePopup";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import InfoToolTip from "./InfoToolTips";

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isConfirmationPopupOpen, setIsConfirmationPopupOpen] = useState(false);
  const [infoToolTipPopup, setInfoToolTipPopup] = useState({
    type: "",
    message: "",
    isOpen: false,
    onClose: () => {}
  });

  const [selectedCard, setSelectedCard] = useState({});
  const [selectedCardDelete, setSelectedCardDelete] = useState({});
  const [cards, setCards] = useState([]);

  const [currentUser, setCurrentUser] = useState({});
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentToken, setCurrentToken] = useState("");

  useEffect(() => {
    function handleCheckToken() {
      const { token } = auth.getUserData();
      if (!token) {
        handleLogout();
        setCurrentToken("");
        return;
      }

      setCurrentToken(token);

      auth
        .checkToken(token)
        .then((res) => res.json())
        .then(({ data }) => {
          if (!data) {
            handleLogout();
            return;
          }
          handleLogin();
        });
    }

    handleCheckToken();
  }, []);

  useEffect(() => {
    if (!loggedIn) {
      setCurrentToken("");
      return;
    }

    const { token, userId } = auth.getUserData();
    setCurrentToken(token);

    api(token)
      .getUserInfo(userId)
      .then(({ data }) => {
        if (!data) {
          return;
        }
        console.log(data);
        setCurrentUser(data);
      });

    api(token)
      .getInitialCards()
      .then(({ data }) => {
        if (!data) {
          return;
        }
        setCards(data);
      });
  }, [loggedIn]);

  function handleCardLike(card, isLiked) {

    api(currentToken)
      .changeLikeCardStatus(card._id, !isLiked)
      .then(({ card: newCard }) => {
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch(console.log);
  }
  function handleCardDelete(card) {
    return api(currentToken)
      .deleteCardById(card._id)
      .then(() => {
        setCards((state) => state.filter((c) => c._id !== card._id));
      })
      .catch(console.log);
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }
  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }
  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }
  function handleCardClick(card) {
    setSelectedCard(card);
  }
  function handleConfirmationClick(card) {
    setIsConfirmationPopupOpen(true);
    setSelectedCardDelete(card);
  }
  function handleInfoToolTipPopup({ type, message }, onClose) {
    const infos = {
      type,
      message,
      isOpen: true,
      onClose: () => {}
    };

    if (onClose) {
      infos.onClose = onClose;
    }

    setInfoToolTipPopup(infos);
  }
  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsConfirmationPopupOpen(false);
    setInfoToolTipPopup({
      type: "",
      message: "",
      isOpen: false,
      onClose: () => {}
    });
    setSelectedCard({});
    setSelectedCardDelete({});
  }

  function handleUpdateUser(user) {
    return api(currentToken)
      .editUser(user)
      .then(({ data }) => {
        setCurrentUser(data);
        closeAllPopups();
      })
      .catch(console.log);
  }
  function handleUpdateAvatar(avatar) {
    return api(currentToken)
      .editAvatar({ avatar })
      .then(({ data }) => {
        setCurrentUser({
          ...currentUser,
          avatar: data.avatar
        });
        closeAllPopups();
      })
      .catch(console.log);
  }
  function handleAddPlaceSubmit(post, form) {
    return api(currentToken)
      .postCard(post)
      .then(({ data }) => {
        setCards([data, ...cards]);
        closeAllPopups();
        form.reset();
      })
      .catch(console.log);
  }
  function handleConfirmationSumit() {
    return handleCardDelete(selectedCardDelete).then(() => {
      setSelectedCardDelete({});
      closeAllPopups();
    });
  }

  function handleLogout() {
    localStorage.removeItem("jwt");
    setLoggedIn(false);
  }

  function handleLogin() {
    setLoggedIn(true);
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header loggedIn={loggedIn} handleLogout={handleLogout} />
        <main className="main container">
          <Switch>
            <Route path="/login">
              <Login
                handleLogin={handleLogin}
                loggedIn={loggedIn}
                handleInfoToolTip={handleInfoToolTipPopup}
              />
            </Route>
            <Route path="/register">
              <Register
                loggedIn={loggedIn}
                handleInfoToolTip={handleInfoToolTipPopup}
              />
            </Route>
            <ProtectedRoute exact path="/" loggedIn={loggedIn}>
              <Main
                onAddPlaceClick={handleAddPlaceClick}
                onEditAvatarClick={handleEditAvatarClick}
                onEditProfileClick={handleEditProfileClick}
                onCardClick={handleCardClick}
                onCardDelete={handleConfirmationClick}
                onCardLike={handleCardLike}
                cards={cards}
              />
            </ProtectedRoute>
            <Route path="*">
              <Redirect to="/login" />
            </Route>
          </Switch>
        </main>

        <Footer />
      </div>

      <EditProfilePopup
        isOpen={isEditProfilePopupOpen}
        onClose={closeAllPopups}
        onUpdateUser={handleUpdateUser}
      />

      <EditAvatarPopup
        isOpen={isEditAvatarPopupOpen}
        onClose={closeAllPopups}
        onUpdateAvatar={handleUpdateAvatar}
      />

      <AddPlacePopup
        isOpen={isAddPlacePopupOpen}
        onClose={closeAllPopups}
        onAddPlaceSubmit={handleAddPlaceSubmit}
      />

      <ImagePopup card={selectedCard} onClose={closeAllPopups} />

      <ConfirmationPopup
        isOpen={isConfirmationPopupOpen}
        onClose={closeAllPopups}
        onConfirmationSubmit={handleConfirmationSumit}
      />

      <InfoToolTip
        type={infoToolTipPopup.type}
        message={infoToolTipPopup.message}
        isOpen={infoToolTipPopup.isOpen}
        onClose={() => {
          infoToolTipPopup.onClose();
          closeAllPopups();
        }}
      />
    </CurrentUserContext.Provider>
  );
}

export default withRouter(App);