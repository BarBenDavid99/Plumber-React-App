import { Route, Routes } from 'react-router-dom';
import Login from './user/Login';
import Signup from './user/Signup';
import Account from './user/Account';
import Cards from './cards/Cards';
import FavCards from './cards/FavCards';
import MyCards from './cards/MyCards';
import About from './pages/About';
import UsersManagement from './admin/UsersManagement';
import AddCard from './cards/AddCard';
import CardSite from './cards/CardSite';
import EditCard from './cards/EditCard';


export default function Router() {
    return (
        <Routes>
            <Route path='/' element={<Cards />}></Route>
            <Route path='/favorite' element={<FavCards />}></Route>
            <Route path='/my-cards' element={<MyCards />}></Route>
            <Route path='/login' element={<Login />}></Route>
            <Route path='/signup' element={<Signup />}></Route>
            <Route path='/account' element={<Account />}></Route>
            <Route path='/about' element={<About />}></Route>
            <Route path='/admin' element={<UsersManagement />}></Route>
            <Route path='/add-card' element={<AddCard />}></Route>
            <Route path='/card-page/:cardID' element={<CardSite />}></Route>
            <Route path='/edit-card/:cardID' element={<EditCard />}></Route>
        </Routes>
    )
}