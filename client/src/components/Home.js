import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSelector } from "react-redux";
import CountUp from "react-countup";
import { Link } from "react-router-dom";
import moment from "moment";

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
  const invoices = useSelector((state) => state.invoices);
  const clients = useSelector((state) => state.clients);
  const projects = useSelector((state) => state.projects);

  const clientName = (id) => {
    for (let index = 0; index < clients.length; index++)
      if (clients[index]._id === id) return clients[index].name;
    return (
      <svg
        aria-hidden="true"
        className="w-4 h-4 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
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
  };

  const paidInvoices = () => {
    let total = 0;
    for (let index = 0; index < invoices.length; index++)
      if (invoices[index]["details"].status === 1)
        total += invoices[index]["details"].total;
    return total;
  };

  if (!invoices || !projects || !clients) return <Loader />;

  return (
    <div className="flex gap-8 flex-col mb-6">
      <div className="flex justify-between mt-4 w-11/12 m-auto">
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
        <div className="flex items-center flex-col p-8 gap-3 w-full xl:w-1/5 whitespace-nowrap border rounded border-gray-200 dark:border-slate-700 transition-shadow shadow-lg hover:shadow-2xl hover:border-gray-300">
          <div className="text-xl">
            <FontAwesomeIcon icon="fa-solid fa-layer-group" />
          </div>
          <div className="text-2xl">Klienci</div>
          <div className="text-3xl font-bold">
            <CountUp end={clients.length} duration={0.8} />
          </div>
        </div>
        <div className="flex items-center flex-col p-8 gap-3 w-full xl:w-1/5 whitespace-nowrap border rounded border-gray-200 dark:border-slate-700 transition-shadow shadow-lg hover:shadow-2xl hover:border-gray-300">
          <div className="text-xl">
            <FontAwesomeIcon icon="fa-solid fa-file-lines" />
          </div>
          <div className="text-2xl">Faktury</div>
          <div className="text-3xl font-bold">
            <CountUp end={invoices.length} duration={0.8} />
          </div>
        </div>
        <div className="flex items-center flex-col p-8 gap-3 w-full xl:w-1/5 whitespace-nowrap border rounded border-gray-200 dark:border-slate-700 transition-shadow shadow-lg hover:shadow-2xl hover:border-gray-300">
          <div className="text-xl">
            <FontAwesomeIcon icon="fa-solid fa-folder" />
          </div>
          <div className="text-2xl">Projekty</div>
          <div className="text-3xl font-bold">
            <CountUp end={projects.length} duration={0.8} />
          </div>
        </div>
        <div className="flex items-center flex-col p-8 gap-3 w-full xl:w-1/5 whitespace-nowrap border rounded border-gray-200 dark:border-slate-700 transition-shadow shadow-lg hover:shadow-2xl hover:border-gray-300">
          <div className="text-xl">
            <FontAwesomeIcon icon="fa-solid fa-hand-holding-dollar" />
          </div>
          <div className="text-2xl">Opłacone faktury</div>
          <div className="text-3xl font-bold">
            ${" "}
            <CountUp
              end={paidInvoices()}
              decimal="."
              decimals={2}
              duration={0.8}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row justify-center w-[90%] m-auto gap-10 items-start">
        <div className="flex flex-col whitespace-nowrap w-full xl:w-[40%] p-3 gap-8">
          <div className="text-xl font-bold">Ostatnie Transakcje</div>
          <div className="recent-body">
            <div className="flex flex-col h-[21rem] overflow-auto border rounded border-gray-200 dark:border-slate-700 shadow-lg">
              {!invoices.length ? (
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
                        {invoice["client"].name}
                      </div>
                      <small>{invoice["project"].name}</small>
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
                          invoice["details"].status === 1
                            ? "p-2 bg-green-100 dark:bg-green-200 rounded-3xl text-green-800 dark:text-green-900 font-semibold"
                            : "p-2 bg-orange-100 rounded-3xl text-orange-800 font-semibold animate-pulse"
                        }
                      >
                        {invoice["details"].status === 1
                          ? "Zapłacone"
                          : "Oczekuje"}
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
          <div className="text-xl font-bold">Ostatnie Projekty</div>
          <div className="recent-body">
            <div className="flex flex-col h-[21rem] overflow-auto border rounded border-gray-200 dark:border-slate-700 shadow-lg">
              {!projects.length ? (
                <Start
                  title={"Brak projektów"}
                  subtitle={"Rozpocznij swoją przygodę już teraz!"}
                  btn_text={"Utwórz projekt"}
                />
              ) : (
                projects.map((project, index) => (
                  <div
                    key={index}
                    className="flex transition-colors hover:bg-gray-200 dark:hover:bg-slate-800"
                  >
                    <div className="flex items-start flex-col w-[5%] p-8 whitespace-normal justify-center">
                      <div className="project-icon">
                        <FontAwesomeIcon icon="fa-solid fa-folder-closed" />
                      </div>
                    </div>
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
                    <div className="flex items-end flex-col p-3 w-[20%] justify-center">
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
