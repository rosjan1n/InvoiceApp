import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/* Actions */
import { addProject } from "../../actions/projects";

/* Utils */
import { invoice_form } from "../../lib/utils";

/* Components */
import { useToast } from "../ui/use-toast.tsx";
import { Button } from "../ui/button.tsx";
import { useState } from "react";

function ProjectCreator() {
  const [project, setProject] = useState(invoice_form.project);
  const clients = useSelector((state) => state.clients);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    const id = e.target.selectedOptions[0].getAttribute("_id");
    const updatedThings = { ...project, [name]: value };
    if (id) updatedThings.client_id = id;
    setProject((prevProject) => ({
      ...prevProject,
      name: updatedThings.name,
      category: updatedThings.category,
      client_id: updatedThings.client_id,
    }));
  };

  const createProject = (data) => {
    dispatch(addProject(data))
      .then(() => {
        toast({
          variant: "success",
          title: "Pomyślnie stworzono projekt!",
          description: `Projekt został dodany do listy projektów.`,
        });
        navigate("/home");
      })
      .catch(() => {
        return toast({
          variant: "destructive",
          title: "Wystąpił błąd!",
          description: `Wystąpił błąd podczas tworzenia projektu. Upewnij się czy wszystkie pola są uzupełnione.`,
        });
      });
  };
  return (
    <div className="flex gap-8 xl:gap-20 flex-col mb-6">
      <div className="flex justify-between w-[90%] mt-4 m-auto">
        <div className="w-[100%]">
          <h2 className="text-2xl font-bold">
            <FontAwesomeIcon
              className="cursor-pointer"
              onClick={() => navigate(-1)}
              icon="fa-solid fa-arrow-left"
            />{" "}
            Nowy projekt
          </h2>
          <small className="font-semibold">
            Stworzysz tutaj nowy projekt nad którym będziesz pracować
          </small>
        </div>
      </div>
      <div className="flex flex-col xl:flex-row gap-5 w-[90%] m-auto">
        <div className="flex flex-col gap-2">
          <label>Nazwa projektu:</label>
          <input
            id="name"
            type="text"
            name="name"
            placeholder="Nazwa projektu"
            value={project["name"]}
            onChange={(e) => handleChange(e)}
            className="rounded-lg justify-center w-full xl:w-[168px] bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 h-11 text-sm border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label>Kategoria projektu:</label>
          <select
            id="category"
            name="category"
            value={project["category"]}
            onChange={(e) => handleChange(e)}
            className="rounded-lg px-2 bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block min-w-0 w-full h-[43px] text-sm border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option value={"default"} hidden>
              Wybierz kategorie projektu...
            </option>
            <option value={"Design & Creative"}>Design & Creative</option>
            <option value={"Performance Marketing"}>
              Performance Marketing
            </option>
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label>Dane klienta:</label>
          <div className="flex">
            <span className="inline-flex items-center justify-center px-3 w-[125px] h-[43px] text-sm whitespace-nowrap text-blue-500 hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-700 cursor-pointer bg-gray-200 border border-r-0 border-gray-300 rounded-l-md dark:bg-gray-600 dark:border-gray-600">
              <FontAwesomeIcon className="pr-1" icon="fa-solid fa-plus" />
              Nowy klient
            </span>
            <select
              id="select-client"
              name="client_id"
              onChange={(e) => handleChange(e)}
              className="rounded-none rounded-r-lg px-2 bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full h-[43px] text-sm border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option value={"default"} hidden>
                Wybierz klienta...
              </option>
              {clients.map((client, i) => (
                <option key={i} value={client.name} _id={client._id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="buttons w-[90%] m-auto flex justify-end">
        <Button
          className="dark:text-white bg-green-500 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-700"
          onClick={() => createProject(project)}
        >
          Utwórz projekt
        </Button>
      </div>
    </div>
  );
}

export default ProjectCreator;
