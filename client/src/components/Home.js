import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSelector, useDispatch } from "react-redux";
import CountUp from "react-countup";
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

/* Utils */
import { calculateDiscount } from "../lib/utils";

/* UI Components */
import { Button } from "./ui/button.tsx";
import ChartComponent from "./ui/chart.js";
import Loader from "./ui/Loader";
import Start from "./ui/Start";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select.tsx";
import { Progress } from "flowbite-react";

function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const invoiceState = useSelector((state) => state.invoice);
  const clientState = useSelector((state) => state.client);
  const projectState = useSelector((state) => state.project);

  const {
    invoices,
    isLoading: invoiceIsLoading,
    isError: invoiceIsError,
    message: invoiceMessage,
  } = invoiceState;
  const {
    clients,
    isError: clientIsError,
    message: clientMessage,
  } = clientState;
  const {
    projects,
    isLoading: projectIsLoading,
    isError: projestIsError,
    message: projectMessage,
  } = projectState;

  useEffect(() => {
    if (!user) return navigate("/login");

    if (invoiceIsError) console.log(invoiceMessage);
    if (clientIsError) console.log(clientMessage);
    if (projestIsError) console.log(projectMessage);

    dispatch(getInvoices());
    dispatch(getClients());
    dispatch(getProjects());

    return () => {
      dispatch(resetInvoices());
      dispatch(resetClients());
      dispatch(resetProjects());
    };
  }, [
    user,
    invoiceIsError,
    invoiceMessage,
    clientIsError,
    clientMessage,
    projestIsError,
    projectMessage,
    navigate,
    dispatch,
  ]);

  const projectName = (id) => {
    for (let index = 0; index < projects.length; index++)
      if (projects[index]._id === id) return projects[index].name;
    return "";
  };

  const clientName = (id) => {
    for (let index = 0; index < clients.length; index++)
      if (clients[index]._id === id) return clients[index].name;
    return "";
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

  function nFormatter(num, digits) {
    const lookup = [
      { value: 1, symbol: "" },
      { value: 1e3, symbol: "k" },
      { value: 1e6, symbol: "M" },
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
      ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol
      : "0";
  }

  const activities = [
    {
      activityName: "CREATE_INVOICE",
      invoiceId: "643f0b04fd3056d0a014e1d1",
      toUser: "6439b3a5b7c2f0069cdf2491",
      timestamp: "2023-04-20T15:00:11.624Z",
    },
    {
      activityName: "CREATE_CLIENT",
      clientId: "643f0a4cfd3056d0a014e1af",
      toProject: "6439daec608dc84a3c21aa9b",
      timestamp: "2023-04-19T12:23:11.624Z",
    },
  ];

  function handleActivity(activity) {
    switch (activity.activityName) {
      case "CREATE_INVOICE":
        return "Stworzono fakturę";
      case "CREATE_CLIENT":
        return "Stworzono klienta";
      case "CREATE_PROJECT":
        return "Stworzono projekt";
      default:
        return activity.activityName;
    }
  }

  if (!invoices || !clients || !projects) return <Loader />;

  console.log(activities);
  return (
    <div className="grid grid-cols-3 grid-flow-row auto-rows-max gap-10 w-[90%] mt-4 m-auto justify-between">
      <div className="flex gap-8 col-span-3 justify-evenly rounded border border-opacity-50 border-gray-300 dark:border-gray-700 shadow-lg p-4">
        <div className="flex flex-col gap-1 items-center">
          <div className="flex items-center gap-3">
            <FontAwesomeIcon
              className="text-2xl p-2 rounded-full ring-2 ring-gray-300 text-purple-500 w-6"
              icon="fa-solid fa-file-invoice-dollar"
            />
            <span className="font-light text-lg">Wszystkie faktury</span>
          </div>
          <span className="font-bold text-3xl">
            ${nFormatter(allInvoices(), 1)}
          </span>
        </div>
        <div className="separator w-px my-5 bg-gray-200 dark:bg-gray-700" />
        <div className="flex flex-col gap-1 items-center">
          <div className="flex items-center gap-3">
            <FontAwesomeIcon
              className="text-2xl p-2 rounded-full ring-2 ring-gray-300 text-green-500"
              icon="fa-solid fa-circle-check"
            />
            <span className="font-light text-lg">Opłacone faktury</span>
          </div>
          <span className="font-bold text-3xl">
            ${nFormatter(paidInvoices(), 1)}
          </span>
        </div>
        <div className="separator w-px my-5 bg-gray-200 dark:bg-gray-700" />
        <div className="flex flex-col gap-1 items-center">
          <div className="flex items-center gap-3">
            <FontAwesomeIcon
              className="text-2xl p-2 rounded-full ring-2 ring-gray-300 text-red-500"
              icon="fa-solid fa-circle-xmark"
            />
            <span className="font-light text-lg">Nieopłacone faktury</span>
          </div>
          <span className="font-bold text-3xl">
            ${nFormatter(unpaidInvoices(), 1)}
          </span>
        </div>
        <div className="separator w-px my-5 bg-gray-200 dark:bg-gray-700" />
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
        <div className="separator w-px my-5 bg-gray-200 dark:bg-gray-700" />
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
        <div className="separator w-px my-5 bg-gray-200 dark:bg-gray-700" />
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
      <div className="flex flex-col col-span-2 rounded border border-opacity-50 border-gray-300 dark:border-gray-700 shadow-lg p-4 items-center">
        <span className="font-bold text-2xl">
          Podsumowanie wszystkich faktur
        </span>
        <ChartComponent invoices={invoices} />
      </div>
      <div className="flex flex-col gap-10 w-3/4 rounded border border-opacity-50 border-gray-300 dark:border-gray-700 shadow-lg p-4 justify-self-end items-center">
        <span className="font-bold text-2xl">Ostatnie aktywności</span>
        <ol class="relative mx-4 border-l border-gray-200 dark:border-gray-700">
          {activities.map((activity, index) => {
            const diffDays = moment().diff(activity.timestamp, "days");

            console.log(diffDays);
            if (diffDays >= 1) return null;

            return (
              <li key={index} class="mb-10 ml-6">
                <span class="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
                  <img
                    class="rounded-full shadow-lg"
                    src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                    alt="Bonnie image"
                  />
                </span>
                <div class="items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:flex dark:bg-gray-700 dark:border-gray-600">
                  <time class="mb-1 text-xs font-normal text-gray-400 sm:order-last sm:mb-0">
                    {moment(activity.timestamp).fromNow()}
                  </time>
                  <div class="text-sm font-normal text-gray-500 dark:text-gray-300">
                    {handleActivity(activity)}{" "}
                    {activity.invoiceId ? (
                      <span className="font-semibold">
                        #
                        <Link
                          to={"/"}
                          className="uppercase text-blue-500 hover:underline"
                        >
                          {activity.invoiceId.substring(
                            activity.invoiceId.length - 6
                          )}
                        </Link>
                      </span>
                    ) : (
                      ""
                    )}{" "}
                    {activity.clientId ? (
                      <span>
                        o nazwie{" "}
                        <Link
                          to={"/"}
                          className="font-semibold text-blue-500 hover:underline"
                        >
                          EXP.PL
                        </Link>
                      </span>
                    ) : (
                      ""
                    )}{" "}
                    {activity.invoiceId ? (
                      <span>
                        {" "}
                        na kwotę <span className="font-semibold">$5000</span>
                      </span>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

export default Home;
