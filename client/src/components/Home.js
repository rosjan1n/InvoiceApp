import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment";

/* Actions */
import {
  getInvoices,
  reset as resetInvoices,
} from "../reducers/features/invoices/invoiceSlice";
import {
  getClients,
  reset as resetClients,
} from "../reducers/features/clients/clientSlice";
import {
  getProjects,
  reset as resetProjects,
} from "../reducers/features/projects/projectSlice";
import {
  getActivities,
  reset as resetActivities,
} from "../reducers/features/activities/activitySlice";

/* UI Components */
import { Button } from "./ui/button.tsx";
import ChartComponent from "./ui/chart.js";
import Loader from "./ui/Loader";

function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const { user } = useSelector((state) => state.auth);
  const invoiceState = useSelector((state) => state.invoice);
  const clientState = useSelector((state) => state.client);
  const projectState = useSelector((state) => state.project);
  const activityState = useSelector((state) => state.activity);

  const {
    invoices,
    isLoading: invoiceIsLoading,
    isError: invoiceIsError,
    message: invoiceMessage,
  } = invoiceState;
  const {
    clients,
    isLoading: clientIsLoading,
    isError: clientIsError,
    message: clientMessage,
  } = clientState;
  const {
    projects,
    isLoading: projectIsLoading,
    isError: projectIsError,
    message: projectMessage,
  } = projectState;
  const {
    activities,
    isLoading: activityIsLoading,
    isError: activityIsError,
    message: activityMessage,
  } = activityState;

  useEffect(() => {
    if (!user) return navigate("/login");

    if (invoiceIsError) console.log(invoiceMessage);
    if (clientIsError) console.log(clientMessage);
    if (projectIsError) console.log(projectMessage);
    if (activityIsError) console.log(activityMessage);

    dispatch(getInvoices());
    dispatch(getClients());
    dispatch(getProjects());
    dispatch(getActivities());

    return () => {
      dispatch(resetInvoices());
      dispatch(resetClients());
      dispatch(resetProjects());
      dispatch(resetActivities());
    };
  }, [
    user,
    invoiceIsError,
    invoiceMessage,
    clientIsError,
    clientMessage,
    projectIsError,
    activityIsError,
    activityMessage,
    projectMessage,
    navigate,
    dispatch,
  ]);

  const clientName = (id) => {
    var name = "";
    clients.forEach((client) => {
      if (client._id === id) name = client.name;
    });
    return name;
  };

  const projectName = (id) => {
    var name = "";
    projects.forEach((project) => {
      if (project._id === id) name = project.name;
    });
    return name;
  };

  const getTotal = (id) => {
    let total = 0;
    const invoice = invoices.find((i) => i._id === id);
    total = invoice.details.total;
    return total;
  };

  const allInvoices = () => {
    let total = 0;
    invoices.forEach((invoice) => {
      total += invoice["details"].total;
    });
    return total;
  };

  const paidInvoices = () => {
    let total = 0;
    for (let index = 0; index < invoices.length; index++)
      if (invoices[index]["details"].paid)
        total += invoices[index]["details"].total;
    return total;
  };

  const unpaidInvoices = () => {
    let total = 0;
    invoices.forEach((invoice) => {
      if (!invoice["details"].paid) total += invoice["details"].total;
    });
    return total;
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const searchData = {
    invoices: invoices?.filter((invoice) =>
      invoice._id.substring(invoice._id - 6).includes(search)
    ),
  };

  function nFormatter(num, digits) {
    const lookup = [
      { value: 1, symbol: "" },
      { value: 1e3, symbol: "tys." },
      { value: 1e6, symbol: "mln" },
      { value: 1e9, symbol: "G" },
      { value: 1e12, symbol: "T" },
      { value: 1e15, symbol: "P" },
      { value: 1e18, symbol: "E" },
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var item = lookup
      .slice()
      .reverse()
      .find(function (item) {
        return num >= item.value;
      });
    return item
      ? (num / item.value).toFixed(digits).replace(rx, "$1").replace(".", ",") +
          " " +
          item.symbol
      : "0";
  }

  function handleActivity(activity) {
    const {
      activity_name,
      project_id,
      client_id,
      invoice_id,
      toClient,
      toProject,
    } = activity;
    let message = "";

    if (
      activity_name === "CREATE_CLIENT" ||
      activity_name === "CREATE_PROJECT"
    ) {
      return (message = (
        <span>
          Stworzono {activity_name === "CREATE_CLIENT" ? "klienta" : "projekt"}{" "}
          o nazwie{" "}
          <Link
            to={
              activity_name === "CREATE_CLIENT"
                ? `/clients/${client_id}`
                : `/projects/${project_id}`
            }
            className="text-blue-500 font-bold hover:underline"
          >
            {activity_name === "CREATE_CLIENT"
              ? clientName(client_id)
              : projectName(project_id)}
          </Link>
          .
        </span>
      ));
    } else if (activity_name === "CREATE_INVOICE") {
      return (message = (
        <span>
          Stworzono fakturę dla klienta{" "}
          <Link
            to={`/invoices/${invoice_id}`}
            className="text-blue-500 font-bold hover:underline"
          >
            {clientName(toClient)}
          </Link>{" "}
          na kwotę <span className="font-bold">{getTotal(invoice_id)}</span>{" "}
          PLN.
        </span>
      ));
    }
    return message;
  }

  function isNoActitivites() {
    if (!activities) return true;
    return activities.every(
      (activity) => moment().diff(activity.timestamp, "days") > 5
    );
  }

  if (
    invoiceIsLoading ||
    clientIsLoading ||
    projectIsLoading ||
    activityIsLoading
  )
    return <Loader />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-10 w-[90%] mt-4 m-auto justify-between items-start">
      <div className="flex col-span-1 md:col-span-2 lg:col-span-3 2xl:col-span-4 text-center justify-between md:text-left">
        <h1 className="font-bold text-3xl text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-800">
          Strona główna
        </h1>
        <Link to={"/invoices"} onClick={resetInvoices()}>
          <Button variant={"outline"}>
            <FontAwesomeIcon className="mr-2" icon="fa-solid fa-plus" />
            Nowa faktura
          </Button>
        </Link>
      </div>
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 col-span-1 md:col-span-2 lg:col-span-3 2xl:col-span-2 justify-evenly rounded border border-opacity-50 border-gray-300 dark:border-gray-700 shadow-lg p-4">
        <div className="flex flex-col gap-1 items-center">
          <div className="flex items-center gap-3">
            <FontAwesomeIcon
              className="text-2xl p-2 rounded-full ring-2 ring-gray-300 text-purple-500 w-6"
              icon="fa-solid fa-file-invoice-dollar"
            />
            <span className="font-light text-lg">Wszystkie faktury</span>
          </div>
          <span className="font-bold text-3xl">
            {nFormatter(allInvoices(), 2)} PLN
          </span>
        </div>
        <div className="separator h-px mx-24 lg:w-px lg:h-auto lg:my-5 lg:mx-0 bg-gray-200 dark:bg-gray-700" />
        <div className="flex flex-col gap-1 items-center">
          <div className="flex items-center gap-3">
            <FontAwesomeIcon
              className="text-2xl p-2 rounded-full ring-2 ring-gray-300 text-green-500"
              icon="fa-solid fa-circle-check"
            />
            <span className="font-light text-lg">Opłacone faktury</span>
          </div>
          <span className="font-bold text-3xl">
            {nFormatter(paidInvoices(), 2)} PLN
          </span>
        </div>
        <div className="separator h-px mx-24 lg:w-px lg:h-auto lg:my-5 lg:mx-0 bg-gray-200 dark:bg-gray-700" />
        <div className="flex flex-col gap-1 items-center">
          <div className="flex items-center gap-3">
            <FontAwesomeIcon
              className="text-2xl p-2 rounded-full ring-2 ring-gray-300 text-red-500"
              icon="fa-solid fa-circle-xmark"
            />
            <span className="font-light text-lg">Nieopłacone faktury</span>
          </div>
          <span className="font-bold text-3xl">
            {nFormatter(unpaidInvoices(), 2)} PLN
          </span>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 col-span-1 md:col-span-2 lg:col-span-3 2xl:col-span-2 justify-evenly rounded border border-opacity-50 border-gray-300 dark:border-gray-700 shadow-lg p-4">
        <div className="flex flex-col gap-1 items-center">
          <div className="flex items-center gap-3">
            <FontAwesomeIcon
              className="text-2xl p-2 rounded-full ring-2 ring-gray-300 text-orange-500 w-6"
              icon="fa-solid fa-file-invoice"
            />
            <span className="font-light text-lg">Wystawione faktury</span>
          </div>
          <span className="font-bold text-3xl">{invoices.length}</span>
        </div>
        <div className="separator h-px mx-24 lg:w-px lg:h-auto lg:my-5 lg:mx-0 bg-gray-200 dark:bg-gray-700" />
        <div className="flex flex-col gap-1 items-center">
          <div className="flex items-center gap-3">
            <FontAwesomeIcon
              className="text-2xl p-2 rounded-full ring-2 ring-gray-300 text-blue-500"
              icon="fa-solid fa-user"
            />
            <span className="font-light text-lg">Wszyscy klienci</span>
          </div>
          <span className="font-bold text-3xl">{clients.length}</span>
        </div>
        <div className="separator h-px mx-24 lg:w-px lg:h-auto lg:my-5 lg:mx-0 bg-gray-200 dark:bg-gray-700" />
        <div className="flex flex-col gap-1 items-center">
          <div className="flex items-center gap-3">
            <FontAwesomeIcon
              className="text-2xl p-2 rounded-full ring-2 ring-gray-300 text-green-500"
              icon="fa-solid fa-folder"
            />
            <span className="font-light text-lg">Wszystkie projekty</span>
          </div>
          <span className="font-bold text-3xl">{projects.length}</span>
        </div>
      </div>
      <div className="overflow-x-auto col-span-1 md:col-span-2 lg:col-span-2 2xl:col-span-3 rounded border border-opacity-50 border-gray-300 dark:border-gray-700 shadow-lg p-4 items-start">
        <div className="flex flex-col gap-4 sm:flex-row sm:gap-0 items-center justify-between pb-4">
          <label htmlFor="table-search" className="sr-only">
            Wyszukaj
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
            <input
              type="text"
              id="table-search"
              onChange={handleSearch}
              className="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Wyszukaj fakturę"
            />
          </div>
        </div>
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="p-4">
                <div className="flex items-center">
                  <input
                    id="checkbox-all-search"
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label htmlFor="checkbox-all-search" className="sr-only">
                    checkbox
                  </label>
                </div>
              </th>
              <th scope="col" className="px-6 py-3">
                Numer faktury
              </th>
              <th scope="col" className="px-6 py-3">
                Nazwa klienta
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                Łączna kwota
              </th>
              <th scope="col" className="px-6 py-3">
                Akcja
              </th>
            </tr>
          </thead>
          <tbody>
            {searchData.invoices.map((invoice, index) => (
              <tr
                key={index}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <td className="w-4 p-4">
                  <div className="flex items-center">
                    <input
                      id="checkbox-table-search-1"
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label
                      htmlFor="checkbox-table-search-1"
                      className="sr-only"
                    >
                      checkbox
                    </label>
                  </div>
                </td>
                <th scope="row" className="px-6 py-4">
                  #
                  <span className="uppercase">
                    {invoice?._id.substring(invoice._id.length - 6)}
                  </span>
                </th>
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {clientName(invoice?.details.client_id)}
                </td>
                <td className="px-6 py-4">
                  {invoice?.details.paid ? (
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-2 rounded dark:bg-green-900 dark:text-green-300">
                      Zapłacone
                    </span>
                  ) : (
                    <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-2 rounded dark:bg-red-900 dark:text-red-300 animate-pulse">
                      Niezapłacone
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {invoice?.details.total.toFixed(2)} PLN
                </td>
                <td className="px-6 py-4">
                  <Link
                    to={`/invoices/${invoice._id}`}
                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                  >
                    Edytuj
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col w-full col-span-1 md:col-span-2 lg:col-span-1 gap-10 rounded border border-opacity-50 border-gray-300 dark:border-gray-700 shadow-lg p-4 justify-self-end items-center">
        <span className="font-bold text-2xl">Ostatnie aktywności</span>
        {isNoActitivites() ? (
          <small className="font-semibold text-md text-gray-500 dark:text-gray-400">
            Brak ostatnich aktywności
          </small>
        ) : (
          []
        )}
        <ol className="relative mx-4 border-l border-gray-200 dark:border-gray-700">
          {activities?.map((activity, index) => {
            const diffDays = moment().diff(activity.timestamp, "days");

            if (diffDays > 5) return null;

            return (
              <li key={index} className="mb-10 ml-6">
                <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
                  <img
                    className="rounded-full shadow-lg"
                    src={user?.avatar}
                    alt="Bonnie image"
                  />
                </span>
                <div className="items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:flex dark:bg-gray-700 dark:border-gray-600">
                  <time className="mb-1 text-xs font-normal text-gray-400 sm:order-last sm:mb-0">
                    {moment(activity.timestamp).fromNow()}
                  </time>
                  <div className="text-sm font-normal text-gray-500 dark:text-gray-300">
                    {handleActivity(activity)}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
      <hr className="col-span-1 md:col-span-2 lg:col-span-3 2xl:col-span-4 h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
      <div className="flex flex-col col-span-1 md:col-span-2 lg:col-span-3 2xl:col-span-4 w-full md:w-2/3 mx-auto rounded border border-opacity-50 border-gray-300 dark:border-gray-700 shadow-lg p-4 items-center">
        <span className="font-bold text-2xl">
          Podsumowanie wszystkich faktur
        </span>
        <ChartComponent invoices={invoices} />
      </div>
    </div>
  );
}

export default Home;
