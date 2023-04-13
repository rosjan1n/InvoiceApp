import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/* Actions */
import { addProject } from "../../actions/projects";

/* Utils */
import { invoice_form } from "../../lib/utils";

/* Components */
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectSeparator,
  SelectValue,
} from "../ui/select.tsx";
import { useToast } from "../ui/use-toast.tsx";
import { Button } from "../ui/button.tsx";
import { useState } from "react";

function ProjectCreator() {
  const [project, setProject] = useState(invoice_form.project);
  const clients = useSelector((state) => state.clients);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleNameChange = (e) => {
    const { name, value } = e.target;
    setProject((prevProject) => ({
      ...prevProject,
      [name]: value,
    }));
  };

  const handleClientChange = (value) => {
    setProject((prevProject) => ({
      ...prevProject,
      client_id: value,
    }));
  };

  const handleCategoryChange = (value) => {
    setProject((prevProject) => ({
      ...prevProject,
      category: value,
    }));
  };

  const createProject = (data) => {
    dispatch(addProject(data))
      .then(() => {
        toast({
          variant: "success",
          title: "Pomyślnie stworzono projekt!",
          description: `Projekt został dodany do twojej listy projektów.`,
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
            onChange={(e) => handleNameChange(e)}
            className="rounded-lg justify-center w-full xl:w-[168px] bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 h-11 text-sm border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label>Kategoria projektu:</label>
          <Select
            value={project["category"]}
            onValueChange={(value) => handleCategoryChange(value)}
          >
            <SelectTrigger className="gap-2 px-2 border w-full h-[43px] focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500">
              <SelectValue placeholder="Wybierz kategorie projektu" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="" disabled>
                Wybierz kategorie
              </SelectItem>
              <SelectSeparator />
              <SelectItem value="Design & Creative">
                Design & Creative
              </SelectItem>
              <SelectItem value="Performance Marketing">
                Performance Marketing
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <label>Dane klienta:</label>
          <div className="flex">
            <span className="inline-flex items-center justify-center px-3 w-[125px] h-[43px] text-sm whitespace-nowrap text-blue-500 hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-700 cursor-pointer bg-gray-200 border border-r-0 border-gray-300 rounded-l-md dark:bg-gray-600 dark:border-gray-600">
              <FontAwesomeIcon className="pr-1" icon="fa-solid fa-plus" />
              Nowy klient
            </span>
            <Select
              value={project["client_id"]}
              onValueChange={(value) => handleClientChange(value)}
            >
              <SelectTrigger
                name="client_id"
                className="rounded-none rounded-r-lg px-2 border w-full h-[43px] focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500"
              >
                <SelectValue placeholder="Wybierz klienta" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="" disabled>
                  Wybierz klienta
                </SelectItem>
                <SelectSeparator />
                {clients.map((client, i) => (
                  <SelectItem key={i} value={client._id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
