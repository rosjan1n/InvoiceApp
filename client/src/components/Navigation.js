import { Outlet, Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSelector, useDispatch } from "react-redux";
import { logout, reset } from "../reducers/features/auth/authSlice";

/* UI Components */
import { Button } from "./ui/button.tsx";

function Navigation() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate("/signin");
  };

  const refreshPage = () => {
    navigate(window.location.pathname);
  };
  return (
    <div>
      <header>
        <nav className=" w-11/12 m-auto mt-4 mb-4 whitespace-nowrap sticky">
          <div className="flex flex-col xl:flex-row justify-between">
            <div className="p-2 m-auto text-center xl:text-left xl:w-1/5">
              <h2 className="text-xl font-bold">Generator faktur</h2>
            </div>
            <div className="m-auto w-3/6">
              <ul className="flex pb-3 xl:pb-0 items-center justify-around list-none">
                <li>
                  <Link
                    className={
                      window.location.pathname.match("/home")
                        ? "rounded p-3 font-medium"
                        : "rounded p-3 transition-all hover:bg-gray-100 dark:hover:text-slate-900 hover:border hover:border-slate-300 hover:shadow-lg"
                    }
                    to="/home"
                    onClick={refreshPage}
                  >
                    <span
                      className={
                        window.location.pathname.match("/home")
                          ? "border-b-4 rounded pb-1 border-indigo-400 dark:border-white"
                          : ""
                      }
                    >
                      Strona główna
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    className={
                      window.location.pathname.match("/invoices")
                        ? "rounded p-3 font-medium"
                        : "rounded p-3 transition-all hover:bg-gray-100 dark:hover:text-slate-900 hover:border hover:border-slate-300 hover:shadow-lg"
                    }
                    to="/invoices"
                    onClick={refreshPage}
                  >
                    <span
                      className={
                        window.location.pathname.match("/invoices")
                          ? "border-b-4 rounded pb-1 border-indigo-400 dark:border-white"
                          : ""
                      }
                    >
                      Faktury
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    className={
                      window.location.pathname.match("/projects")
                        ? "rounded p-3 font-medium"
                        : "rounded p-3 transition-all hover:bg-gray-100 dark:hover:text-slate-900 hover:border hover:border-slate-300 hover:shadow-lg"
                    }
                    to="/projects"
                    onClick={refreshPage}
                  >
                    <span
                      className={
                        window.location.pathname.match("/projects")
                          ? "border-b-4 rounded pb-1 border-indigo-400 dark:border-white"
                          : ""
                      }
                    >
                      Projekty
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    className={
                      window.location.pathname.match("/clients")
                        ? "rounded p-3 font-medium"
                        : "rounded p-3 transition-all hover:bg-gray-100 dark:hover:text-slate-900 hover:border hover:border-slate-300 hover:shadow-lg"
                    }
                    to="/clients"
                    onClick={refreshPage}
                  >
                    <span
                      className={
                        window.location.pathname.match("/clients")
                          ? "border-b-4 rounded pb-1 border-indigo-400 dark:border-white"
                          : ""
                      }
                    >
                      Klienci
                    </span>
                  </Link>
                </li>
              </ul>
            </div>
            <div className="m-auto w-1/5">
              <div className="flex items-center justify-center xl:justify-end gap-10">
                <FontAwesomeIcon icon="fa-solid fa-magnifying-glass"></FontAwesomeIcon>
                <FontAwesomeIcon icon="fa-regular fa-bell" />
                {user ? (
                  <Button variant={"destructive"} onClick={onLogout}>
                    Wyloguj się
                  </Button>
                ) : (
                  <Link to={'/login'}><Button variant={"default"}>Zaloguj się</Button></Link>
                )}
              </div>
            </div>
          </div>
        </nav>
        <hr className="dark:border-slate-700" />
      </header>
      <Outlet />
    </div>
  );
}

export default Navigation;
