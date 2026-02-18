import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Search from './pages/Search';
import Sell from './pages/Sell';
import Saved from './pages/Saved';
import Profile from './pages/Profile';
import ProductDetail from './pages/ProductDetail';
import CategoryDetail from './pages/CategoryDetail';
import About from './pages/About';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProductList from './pages/admin/AdminProductList';
import AdminProductCreate from './pages/admin/AdminProductCreate';
import AdminBannerManage from './pages/admin/AdminBannerManage';
import AdminCategoryManage from './pages/admin/AdminCategoryManage';
import AdminOrderManage from './pages/admin/AdminOrderManage';
import AdminExchangeRate from './pages/admin/AdminExchangeRate';
import AdminLogin from './pages/admin/AdminLogin';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/sell" element={<Sell />} />
        <Route path="/saved" element={<Saved />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/about" element={<About />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/category/:id" element={<CategoryDetail />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProductList />} />
          <Route path="products/create" element={<AdminProductCreate />} />
          <Route path="products/edit/:id" element={<AdminProductCreate />} />
          <Route path="banners" element={<AdminBannerManage />} />
          <Route path="categories" element={<AdminCategoryManage />} />
          <Route path="orders" element={<AdminOrderManage />} />
          <Route path="exchange-rate" element={<AdminExchangeRate />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
