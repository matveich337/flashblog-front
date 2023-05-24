import Footer from "../Footer/footer";
import Header from "../Header/header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div>
      <Header />
      <Outlet />
      <Footer />
      <ToastContainer />
    </div>
  );
};

export default Layout;
