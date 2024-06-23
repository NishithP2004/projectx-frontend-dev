import "./Layout.css";
import Header from "./Header";
import Sidebar from "./Sidebar";

function Layout(props) {
  return (
    <div className="layout">
      <div className="row">
        <Header user={props.user} />
      </div>
      <Sidebar />
      {props.children}
    </div>
  );
}

export default Layout;
