import "./App.css";
import Layout from "./components/Layout/Layout.jsx";
import HomePage from "./pages/HomePage/HomePage.jsx";
import AboutUsPage from "./pages/AboutUsPage/AboutUsPage.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./pages/Auth/LoginPage.jsx";
import SignUpPage from "./pages/Auth/SignUpPage.jsx";

import ProductDetails from "./components/ProductDetails/ProductDetails.jsx";
import ComparePage from "./components/ComparePage/ComparePage.jsx";
import CartPage from "./components/CartPage/CartPage.jsx";
import CheckoutPage from "./components/CheckoutPage/CheckoutPage.jsx";
import AccountPage from "./components/AccountPage/AccountPage.jsx";
import SuccessPage from "./components/SuccessPage/SuccessPage.jsx";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "", element: <HomePage /> },
      { path: "about", element: <AboutUsPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "signup", element: <SignUpPage /> },
      { path: "product/:slug", element: <ProductDetails /> },
      { path: "compare", element: <ComparePage /> },
      { path: "cart", element: <CartPage /> },
      { path: "checkout", element: <CheckoutPage /> },
      { path: "account", element: <AccountPage /> },
      { path: "success", element: <SuccessPage /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
