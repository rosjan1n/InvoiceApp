import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/* Authenication */
import { login, reset } from "../../reducers/features/auth/authSlice";
import { GoogleLogin } from "@react-oauth/google";
import jwt_decode from "jwt-decode";

/* UI Components */
import someImage from '../../assets/images/login_page.svg';
import { useToast } from "../ui/use-toast.tsx";
import { Button } from "../ui/button.tsx";

function Login() {
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    avatar: undefined
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();

  const { email, password } = formData;

  useEffect(() => {
    if (isError)
      toast({
        variant: "destructive",
        title: "Wystąpił błąd!",
        description: message,
      });
    if (isSuccess) {
      navigate("/");
      toast({
        variant: "success",
        title: "Zalogowano pomyślnie",
        description: `Pomyślnie zalogowano na konto ${user.username}`,
      });
    }

    if (user) navigate("/");

    return () => {
      dispatch(reset());
    };
  }, [user, isError, isSuccess, message, navigate, dispatch, toast]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const userData = {
      email,
      password,
    };

    dispatch(login(userData));
  };

  const Spinner = (
    <svg
      aria-hidden="true"
      className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
      viewBox="0 0 100 101"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
        fill="currentColor"
      />
      <path
        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
        fill="currentFill"
      />
    </svg>
  );

  return (
    <div className="flex xl:grid xl:grid-cols-2">
      <img className="w-[90%] m-auto hidden xl:block" src={someImage} />
      <div className="flex flex-col w-full gap-4 xl:gap-0 mt-4">
        <h1 className="text-center font-bold text-2xl mt-auto">Logowanie</h1>
        <form className="w-[90%] xl:w-1/3 xl:h-[70%] xl:my-12 mx-auto">
          <div className="flex mb-4">
            <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
              <FontAwesomeIcon icon="fa-solid fa-envelope" />
            </span>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => {
                onChange(e);
              }}
              className="rounded-none rounded-r-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="example@invoice.com"
            />
          </div>
          <div className="flex mb-4">
            <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
              <FontAwesomeIcon icon="fa-solid fa-lock" />
            </span>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => {
                onChange(e);
              }}
              className="rounded-none rounded-r-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Hasło"
            />
          </div>
          <p className="mb-3 text-sm text-end font-semibold text-blue-500 hover:underline hover:decoration-blue-500 transition-colors">
            Zapomniałeś hasła?
          </p>
          <Button className="w-full" onClick={onSubmit}>
            {isLoading ? Spinner : "Zaloguj się"}
          </Button>
          <p className="text-start text-sm mt-3">
            Nie masz jeszcze konta?{" "}
            <Link
              className="font-semibold text-blue-500 hover:underline hover:decoration-blue-500 transition-colors"
              to={"/signin"}
            >
              Zarejestruj się
            </Link>
          </p>
          <div className="flex items-center gap-3 my-4">
            <div className="border-b-[1px] w-1/2"/>
            <div className="font-light text-sm lg:text-base">Lub</div>
            <div className="border-b-[1px] w-1/2"/>
          </div>
          <div className="flex mb-4 justify-center">
            <GoogleLogin
              onSuccess={(res) => {
                const decoded = jwt_decode(res.credential);
                
              }}
              onError={() => {
                console.log("Login failed");
              }}
            />
            {/* <Button className="mb-4" size={'lg'} variant={'outline'} onClick={() => googleLogin()}><FontAwesomeIcon className="mr-1" icon="fa-brands fa-google fa-2xl" />Zaloguj się przez Google</Button> */}
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
