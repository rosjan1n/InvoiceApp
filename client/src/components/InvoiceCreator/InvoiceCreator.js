import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/* Actions */
import { addInvoice } from "../../actions/invoices";

/* Utils */
import { useToast } from '../ui/use-toast.tsx';
import { Button } from "../ui/button.tsx";
import Step from "./Step";

function InvoiceCreator() {
  const clients = useSelector((state) => state.clients);
  const projects = useSelector((state) => state.projects);
  const [index, setIndex] = useState(1);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();

  function prevStep() {
    if (index > 1)
      setIndex((prevIndex) => prevIndex - 1);
  }

  function nextStep(data) {
    if (index - 4)
    {
      if(validation())
        setIndex((prevIndex) => prevIndex + 1);
      else
      {
        return toast({
          variant: "destructive",
          title: 'Wystąpił błąd!',
          description: 'Aby przejść do kolejnego kroku musisz uzupełnić wszystkie pola.'
        });
      }
    }
    else {
      dispatch(addInvoice(data.data))
      .then(() => {
        toast({
          variant: "success",
          title: "Wystawiono fakturę!",
          description: `Faktura została dodana do ostatnich transakcji.`,
        })
        navigate('/home');
      })
      .catch(() => {
        return toast({
          variant: "destructive",
          title: 'Wystąpił błąd!',
          description: `Wystąpił błąd podczas wystawiania faktury. Upewnij się czy wszystkie pola są uzupełnione.`,
        })
      });
    }
  }

  function validation() {
    if(index === 1)
    {
      var client = document.getElementsByClassName('select-client');
      var project = document.getElementsByClassName('select-project');
      var CLIENT_VALUE = client[0].childNodes[0].textContent;
      var PROJECT_VALUE = project[0].childNodes[0].textContent;
      if(client && project && CLIENT_VALUE !== 'Wybierz klienta' && CLIENT_VALUE !== undefined && PROJECT_VALUE !== 'Wybierz projekt' && PROJECT_VALUE !== undefined)
        return true;
      return false;
    }
    if(index === 2)
    {
      var payment_method = document.getElementsByClassName('select-payment');
      var PAYMENT_VALUE = payment_method[0].childNodes[0].textContent;
      if(payment_method && PAYMENT_VALUE !== 'Wybierz metodę płatności' && PAYMENT_VALUE !== undefined)
        return true;
      return false;
    }
    return true;
  }

  return (
    <div className="flex gap-8 xl:gap-20 flex-col mb-8">
      <div className="flex justify-between w-[90%] mt-4 m-auto">
        <div className="w-[100%]">
          <h2 className="text-2xl font-bold">
            <FontAwesomeIcon
              className="cursor-pointer"
              onClick={() => navigate(-1)}
              icon="fa-solid fa-arrow-left"
            />{" "}
            Nowa faktura
          </h2>
          <small className="font-semibold">
            Stworzysz tutaj fakturę dla swojego klienta
          </small>
        </div>
      </div>
      <div className="xl:flex items-start xl:w-[90%] xl:m-auto">
        <div className="progress-desktop hidden xl:block xl:w-[30%]">
          <ol className="relative text-gray-500 border-l border-gray-200 dark:border-gray-700 dark:text-gray-400">
            <li className="mb-10 ml-6">
              <span
                className={
                  index >= 1
                    ? "absolute flex items-center justify-center w-8 h-8 bg-green-200 rounded-full -left-4 ring-4 ring-white dark:ring-gray-900 dark:bg-green-900"
                    : "absolute flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full -left-4 ring-4 ring-white dark:ring-gray-900 dark:bg-gray-700"
                }
              >
                <svg
                  aria-hidden="true"
                  className={
                    index >= 1
                      ? "w-5 h-5 text-green-500 dark:text-green-400"
                      : "w-5 h-5 text-gray-500 dark:text-gray-400"
                  }
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d={
                      index >= 1
                        ? "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        : "M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a3 3 0 006 0h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm2.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2.45 4a2.5 2.5 0 10-4.9 0h4.9zM12 9a1 1 0 100 2h3a1 1 0 100-2h-3zm-1 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z"
                    }
                    clipRule="evenodd"
                  ></path>
                </svg>
              </span>
              <h3 className="font-medium leading-tight">Dane personalne</h3>
              <p className="text-sm">Dane szczegółowe faktury</p>
            </li>
            <li className="mb-10 ml-6">
              <span
                className={
                  index >= 2
                    ? "absolute flex items-center justify-center w-8 h-8 bg-green-200 rounded-full -left-4 ring-4 ring-white dark:ring-gray-900 dark:bg-green-900"
                    : "absolute flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full -left-4 ring-4 ring-white dark:ring-gray-900 dark:bg-gray-700"
                }
              >
                <svg
                  aria-hidden="true"
                  className={
                    index >= 2
                      ? "w-5 h-5 text-green-500 dark:text-green-400"
                      : "w-5 h-5 text-gray-500 dark:text-gray-400"
                  }
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d={
                      index >= 2
                        ? ""
                        : "M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"
                    }
                  ></path>
                  <path
                    fillRule="evenodd"
                    d={
                      index >= 2
                        ? "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        : "M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                    }
                    clipRule="evenodd"
                  ></path>
                </svg>
              </span>
              <h3 className="font-medium leading-tight">Płatność</h3>
              <p className="text-sm">Szczegóły płatności</p>
            </li>
            <li className="ml-6">
              <span
                className={
                  index === 3
                    ? "absolute flex items-center justify-center w-8 h-8 bg-green-200 rounded-full -left-4 ring-4 ring-white dark:ring-gray-900 dark:bg-green-900"
                    : "absolute flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full -left-4 ring-4 ring-white dark:ring-gray-900 dark:bg-gray-700"
                }
              >
                <svg
                  aria-hidden="true"
                  className={
                    index === 3
                      ? "w-5 h-5 text-green-500 dark:text-green-400"
                      : "w-5 h-5 text-gray-500 dark:text-gray-400"
                  }
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d={index === 3 ? "" : "M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"}
                  ></path>
                  <path
                    fillRule="evenodd"
                    d={
                      index === 3
                        ? "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        : "M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    }
                    clipRule="evenodd"
                  ></path>
                </svg>
              </span>
              <h3 className="font-medium leading-tight">Podsumowanie</h3>
              <p className="text-sm">Podgląd faktury</p>
            </li>
          </ol>
        </div>
        <div className="progress-mobile xl:hidden w-[90%] m-auto">
          <ol className="flex items-center w-full mb-4 sm:mb-5">
            <li className="flex w-full items-center text-blue-600 dark:text-blue-500 after:content-[''] after:w-full after:h-1 after:border-b after:border-blue-100 after:border-4 after:inline-block dark:after:border-blue-800">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full lg:h-12 lg:w-12 dark:bg-blue-800 shrink-0">
                <svg
                  aria-hidden="true"
                  className="w-5 h-5 text-blue-600 lg:w-6 lg:h-6 dark:text-blue-300"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a3 3 0 006 0h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm2.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2.45 4a2.5 2.5 0 10-4.9 0h4.9zM12 9a1 1 0 100 2h3a1 1 0 100-2h-3zm-1 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </div>
            </li>
            <li className="flex w-full items-center after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-4 after:inline-block dark:after:border-gray-700">
              <div className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full lg:h-12 lg:w-12 dark:bg-gray-700 shrink-0">
                <svg
                  aria-hidden="true"
                  className="w-5 h-5 text-gray-500 lg:w-6 lg:h-6 dark:text-gray-100"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"></path>
                  <path
                    fillRule="evenodd"
                    d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </div>
            </li>
            <li className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full lg:h-12 lg:w-12 dark:bg-gray-700 shrink-0">
                <svg
                  aria-hidden="true"
                  className="w-5 h-5 text-gray-500 lg:w-6 lg:h-6 dark:text-gray-100"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
                  <path
                    fillRule="evenodd"
                    d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </div>
            </li>
          </ol>
        </div>
        <Step currentStep={index} clients={clients} projects={projects} onSubmit={index === 4 ? nextStep : {}} />
      </div>
      <div className="flex gap-3 justify-end w-[90%] m-auto">
        <Button
          className="bg-indigo-500 hover:bg-indigo-700"
          onClick={() => prevStep()}
          disabled={index === 1}
        >
          Cofnij
        </Button>
        <Button
          className="bg-indigo-500 hover:bg-indigo-700"
          onClick={() => nextStep()}
        >
          {index === 3 ? "Wystaw fakturę" : "Dalej"}
        </Button>
      </div>
    </div>
  );
}

export default InvoiceCreator;
