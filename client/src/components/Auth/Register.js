import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/* Authenication */
import { register, reset } from "../../reducers/features/auth/authSlice";

/* UI Components */
import { useToast } from "../ui/use-toast.tsx";
import { Button } from "../ui/button.tsx";

function Register() {
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password_repeat: "",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();

  const { username, email, password, password_repeat } = formData;

  useEffect(() => {
    if (isError)
      toast({
        variant: "destructive",
        title: "Wystąpił błąd",
        description: message,
      });
    if (isSuccess || user) {
      navigate("/");
      toast({
        variant: "success",
        title: "Stworzono konto!",
        description: `Witamy ${username} w serwisie InvoiceApp.`,
      });
      console.log(user);
      console.log(localStorage.getItem('user'));
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (password !== password_repeat)
      toast({
        variant: "destructive",
        title: "Wystąpił błąd!",
        description: "Hasła do siebie nie pasują.",
      });
    else {
      const userData = {
        username,
        email,
        password,
        password_repeat,
      };

      dispatch(register(userData));
    }
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
    <form className="absolute top-1/4 right-0 left-0 w-[90%] xl:w-[20%] m-auto">
      <label
        htmlFor="email"
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        E-mail
      </label>
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
      <label
        htmlFor="username"
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        Nazwa użytkownika
      </label>
      <div className="flex mb-4">
        <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
          @
        </span>
        <input
          type="text"
          id="username"
          name="username"
          value={username}
          onChange={(e) => {
            onChange(e);
          }}
          className="rounded-none rounded-r-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="invoiceapp"
        />
      </div>
      <label
        htmlFor="password"
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        Hasło
      </label>
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
      <label
        htmlFor="password_repeat"
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        Powtórz hasło
      </label>
      <div className="flex mb-4">
        <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
          <FontAwesomeIcon icon="fa-solid fa-lock" />
        </span>
        <input
          type="password"
          id="password_repeat"
          name="password_repeat"
          value={password_repeat}
          onChange={(e) => {
            onChange(e);
          }}
          className="rounded-none rounded-r-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Powtórz hasło"
        />
      </div>
      <Button onClick={onSubmit}>{isLoading ? Spinner : "Stwórz konto"}</Button>
    </form>
  );
}

export default Register;
