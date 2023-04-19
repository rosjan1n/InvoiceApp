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
import Loader from "./ui/Loader";
import Start from "./ui/Start";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select.tsx";

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

  const paidInvoices = () => {
    let total = 0;
    for (let index = 0; index < invoices.length; index++)
      if (invoices[index]["details"].paid)
        total += invoices[index]["details"].total;
    return total;
  };

  function nFormatter(num, digits) {
    const lookup = [
      { value: 1, symbol: "" },
      { value: 1e3, symbol: "K" },
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

  if (!invoices || !clients) return <Loader />;

  return (
    <div className="flex gap-8 flex-col mb-6">
      <div className="flex justify-between mt-4 w-[90%] m-auto">
        <header className="container-header">
          <h2 className="text-2xl font-bold">Podsumowanie</h2>
          <small className="text-sm font-medium leading-none">
            Znajdziesz tutaj swoje statystki
          </small>
        </header>
        <div className="flex flex-col whitespace-nowrap items-end xl:flex-row xl:items-start gap-2">
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Wybierz sortowanie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30">Ostatnie 30 dni</SelectItem>
            </SelectContent>
          </Select>
          <Link to={"/invoices"}>
            <Button className="bg-indigo-500 hover:bg-indigo-700">
              <FontAwesomeIcon className="mr-1" icon="fa-solid fa-plus" />
              Nowa faktura
            </Button>
          </Link>
        </div>
      </div>
      <div className="flex flex-col gap-10 xl:flex-row justify-between w-[90%] m-auto">
        <div className="flex flex-col flex-wrap content-around p-8 gap-3 w-full xl:w-1/5 whitespace-nowrap border rounded-3xl border-gray-200 dark:border-slate-700 transition-shadow shadow-lg hover:shadow-2xl hover:border-gray-300">
          <div className="flex gap-40">
            <div className="text-3xl font-bold">
              <CountUp end={clients.length} duration={0.8} />
            </div>
            <div className="text-3xl">
              <FontAwesomeIcon
                className="text-orange-500"
                icon="fa-solid fa-user"
              />
            </div>
          </div>
          <div className="text-2xl font-light">Klienci</div>
        </div>
        <div className="flex flex-col flex-wrap content-around p-8 gap-3 w-full xl:w-1/5 whitespace-nowrap border rounded-3xl border-gray-200 dark:border-slate-700 transition-shadow shadow-lg hover:shadow-2xl hover:border-gray-300">
          <div className="flex items-center gap-40">
            <div className="text-3xl font-bold">
              <CountUp end={invoices.length} duration={0.8} />
            </div>
            <div className="text-3xl">
              <FontAwesomeIcon
                className="text-purple-500"
                icon="fa-solid fa-file-invoice"
              />
            </div>
          </div>
          <div className="text-2xl font-light">Faktury</div>
        </div>
        <div className="flex flex-col flex-wrap content-around p-8 gap-3 w-full xl:w-1/5 whitespace-nowrap border rounded-3xl border-gray-200 dark:border-slate-700 transition-shadow shadow-lg hover:shadow-2xl hover:border-gray-300">
          <div className="flex items-center gap-40">
            <div className="text-3xl font-bold">
              <CountUp end={projects.length} duration={0.8} />
            </div>
            <div className="text-3xl">
              <FontAwesomeIcon
                className="text-blue-500"
                icon="fa-solid fa-folder"
              />
            </div>
          </div>
          <div className="text-2xl font-light">Projekty</div>
        </div>
        <div className="flex flex-col flex-wrap content-around p-8 gap-3 w-full xl:w-1/5 whitespace-nowrap border rounded-3xl border-gray-200 dark:border-slate-700 transition-shadow shadow-lg hover:shadow-2xl hover:border-gray-300">
          <div className="flex items-center gap-40">
            <div className="text-3xl font-bold">
              ${nFormatter(paidInvoices())}
            </div>
            <div className="text-3xl">
              <FontAwesomeIcon
                className="text-green-500"
                icon="fa-solid fa-dollar-sign"
              />
            </div>
          </div>
          <div className="text-2xl font-light">Opłacone faktury</div>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row justify-center w-[90%] m-auto gap-10 items-start">
        <div className="flex flex-col whitespace-nowrap w-full xl:w-[40%] p-3 gap-8">
          <div className="text-xl font-bold">Ostatnie wystawione faktury</div>
          <div className="recent-body">
            <div className="flex flex-col h-[21rem] overflow-auto border rounded-3xl border-gray-200 dark:border-slate-700 shadow-lg">
              {invoiceIsLoading || invoiceIsError || !invoices.length ? (
                <Start
                  title={"Brak transakcji"}
                  subtitle={"Rozpocznij swoją przygodę już teraz!"}
                  btn_text={"Utwórz transakcję"}
                />
              ) : (
                invoices.map((invoice, index) => (
                  <div
                    key={index}
                    className="flex flex-col xl:flex-row transition-colors border-b border-opacity-40 border-slate-300 last:border-b-0 xl:border-b-0 hover:bg-gray-200 dark:hover:bg-slate-800"
                  >
                    <div className="flex items-center xl:items-start flex-col w-full xl:w-[35%] p-8 whitespace-normal justify-center">
                      <div className="font-semibold">
                        {clientName(invoice.details.client_id)}
                      </div>
                      <small>{projectName(invoice.details.project_id)}</small>
                    </div>
                    <div className="flex items-center flex-col p-3 w-full xl:w-1/4 justify-center">
                      <Link
                        className="text-sky-500 hover:text-sky-600 hover:underline"
                        to={"/invoices/" + invoice._id}
                      >
                        Zobacz fakturę
                      </Link>
                      <small className="text-sm uppercase font-semibold select-all">
                        <span className="font-bold">#</span>
                        {invoice._id.substring(invoice._id.length - 6)}
                      </small>
                    </div>
                    <div className="flex items-center flex-col p-3 w-full xl:w-[20%] justify-center">
                      <div
                        className={
                          invoice["details"].paid
                            ? "p-2 bg-green-100 dark:bg-green-200 rounded-3xl text-green-800 dark:text-green-900 font-semibold"
                            : "p-2 bg-orange-100 rounded-3xl text-orange-800 font-semibold animate-pulse"
                        }
                      >
                        {invoice["details"].paid ? "Zapłacone" : "Oczekuje"}
                      </div>
                    </div>
                    <div className="flex items-center xl:items-end flex-col p-3 w-full xl:w-[20%] justify-center">
                      <div className="font-semibold">
                        $
                        <CountUp
                          end={calculateDiscount(invoice).toFixed(2)}
                          decimal="."
                          decimals={2}
                          duration={0.8}
                        />
                      </div>
                      <small className="leading-none">
                        {moment(invoice["details"].date_issue).format("L")}
                      </small>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col whitespace-nowrap w-full xl:w-[40%] p-3 gap-8">
          <div className="text-xl font-bold">Ostatnie projekty</div>
          <div className="recent-body">
            <div className="flex flex-col h-[21rem] overflow-auto border rounded-3xl border-gray-200 dark:border-slate-700 shadow-lg">
              {projectIsLoading || projestIsError || !projects.length ? (
                <Start
                  title={"Brak projektów"}
                  subtitle={"Rozpocznij swoją przygodę już teraz!"}
                  btn_text={"Utwórz projekt"}
                />
              ) : (
                projects.map((project, index) => (
                  <div
                    key={index}
                    className="flex flex-col xl:flex-row items-center xl:items-start transition-colors border-b border-opacity-40 border-slate-300 last:border-b-0 xl:border-b-0 hover:bg-gray-200 dark:hover:bg-slate-800"
                  >
                    <div className="flex items-center flex-col p-3 w-1/4 justify-center">
                      <div className="font-semibold">{project.name}</div>
                      <small className="recent-subtitle">
                        {clientName(project.client_id)}
                      </small>
                    </div>
                    <div className="flex items-center flex-col p-3 w-[50%] justify-center">
                      <div
                        className={
                          project.status === 1
                            ? "p-2 bg-green-100 dark:bg-green-200 rounded-3xl text-green-800 dark:text-green-900 font-semibold"
                            : "p-2 bg-orange-100 rounded-3xl text-orange-800 font-semibold animate-pulse"
                        }
                      >
                        {project.status === 1 ? "Ukończone" : "W trakcie"}
                      </div>
                    </div>
                    <div className="flex items-center xl:items-end flex-col p-3 w-[20%] justify-center">
                      <div className="text-sky-500 hover:text-sky-600 hover:underline">
                        <Link to={"/projects/" + project._id}>
                          Zobacz szczegóły
                        </Link>
                      </div>
                      <small>{project.category}</small>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
