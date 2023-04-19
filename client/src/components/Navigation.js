import { useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout, reset } from "../reducers/features/auth/authSlice";
import { Navbar, Dropdown, Avatar } from "flowbite-react";

/* UI Components */
import { Button } from "./ui/button.tsx";

function Navigation() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [theme, setTheme] = useState(false);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate("/signin");
  };

  return (
    <div>
      <header>
        <Navbar className="dark:bg-black" fluid rounded>
          <Navbar.Brand href="/">
            <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
              Generator faktur
            </span>
          </Navbar.Brand>
          <div className="flex md:order-2 gap-2">
            {user ? (
              <Dropdown
                className="dark:bg-slate-800"
                arrowIcon={false}
                inline={true}
                label={
                  <Avatar
                    alt="User settings"
                    img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                    rounded={true}
                    bordered
                  />
                }
              >
                <Dropdown.Header>
                  <span className="block text-sm">{user?.username}</span>
                  <span className="block truncate text-sm font-medium">
                    {user?.email}
                  </span>
                </Dropdown.Header>
                <Dropdown.Item>Podsumowanie</Dropdown.Item>
                <Link to={'/settings'}><Dropdown.Item>Ustawienia</Dropdown.Item></Link>
                <Dropdown.Divider />
                <Dropdown.Item
                  className="text-red-500 hover:text-red-400 dark:text-red-500 hover:dark:text-red-400"
                  onClick={onLogout}
                >
                  Wyloguj się
                </Dropdown.Item>
              </Dropdown>
            ) : (
              <Link to={"signin"}>
                <Button
                  variant={"ghost"}
                  className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
                >
                  Utwórz konto
                </Button>
              </Link>
            )}
            <Navbar.Toggle />
          </div>
          <Navbar.Collapse>
            <Navbar.Link
              href="/home"
              active={window.location.pathname.match("/home") ? true : false}
            >
              Strona główna
            </Navbar.Link>
            <Navbar.Link
              href="/invoices"
              active={
                window.location.pathname.match("/invoices") ? true : false
              }
            >
              Faktury
            </Navbar.Link>
            <Navbar.Link
              href="/clients"
              active={window.location.pathname.match("/clients") ? true : false}
            >
              Klienci
            </Navbar.Link>
            <Navbar.Link
              href="/projects"
              active={
                window.location.pathname.match("/projects") ? true : false
              }
            >
              Projekty
            </Navbar.Link>
          </Navbar.Collapse>
        </Navbar>
      </header>
      <hr className="h-px bg-gray-200 border-0 dark:bg-gray-700"/>
      <Outlet />
    </div>
  );
}

export default Navigation;
