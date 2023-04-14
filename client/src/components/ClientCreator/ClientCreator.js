import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/* Actions */
import { createClient } from '../../reducers/features/clients/clientSlice';

/* Components */
import { useToast } from "../ui/use-toast.tsx";
import { Button } from "../ui/button.tsx";

/* Utils */
import { invoice_form } from "../../lib/utils";
import BuildMap from "../ui/MapCreator";

function ClientCreator() {
  const [client, setClient] = useState(invoice_form.client);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();

  const handleClientChange = (e) => {
    const { name, value } = e.target;
    var finalFormat;
    if (name === "name")
      setClient((prevClient) => ({
        ...prevClient,
        name: value,
      }));
    else if (name === "street" || name === "city")
      setClient((prevClient) => ({
        ...prevClient,
        address: {
          ...prevClient["address"],
          [name]: value,
        },
      }));
    else if (name === "bank_account") {
      if (isNaN(value) || value.length > 26) return;
      var noLettersBank = ("" + value).replace(/\D/g, "");
      var bankFormat = noLettersBank.match(
        /^(\d{2})(\d{4})(\d{4})(\d{4})(\d{4})(\d{4})(\d{4})$/
      );
      if (bankFormat) {
        finalFormat = `${bankFormat[1]} ${bankFormat[2]} ${bankFormat[3]} ${bankFormat[4]} ${bankFormat[5]} ${bankFormat[6]} ${bankFormat[7]}`;
        return setClient((prevClient) => ({
          ...prevClient,
          private: {
            ...prevClient["private"],
            bank_account: finalFormat,
          },
        }));
      }
      setClient((prevClient) => ({
        ...prevClient,
        private: {
          ...prevClient["private"],
          bank_account: value,
        },
      }));
    } else if (name === "nip") {
      if (isNaN(value) || value.length > 10) return;
      setClient((prevClient) => ({
        ...prevClient,
        private: {
          ...prevClient["private"],
          nip: value,
        },
      }));
    } else if (name === "postal_code") {
      if (isNaN(value) || value.length > 5) return;
      var noLettersPostal = ("" + value).replace(/\D/g, "");
      var postalFormat = noLettersPostal.match(/^(\d{2})(\d{3})$/);
      if (postalFormat) {
        finalFormat = `${postalFormat[1]}-${postalFormat[2]}`;
        return setClient((prevClient) => ({
          ...prevClient,
          address: {
            ...prevClient["address"],
            postal_code: finalFormat,
          },
        }));
      }
      setClient((prevClient) => ({
        ...prevClient,
        address: {
          ...prevClient["address"],
          postal_code: value,
        },
      }));
    } else if (name === "phone_number") {
      if (isNaN(value) || value.length > 9) return;
      var noLettersPhone = ("" + value).replace(/\D/g, "");
      var phoneFormat = noLettersPhone.match(/^(\d{3})(\d{3})(\d{3})$/);
      if (phoneFormat) {
        finalFormat =
          `${phoneFormat[1]} ${phoneFormat[2]} ${phoneFormat[3]}`;
        return setClient((prevClient) => ({
          ...prevClient,
          private: {
            ...prevClient["private"],
            phone_number: finalFormat,
          },
        }));
      }
      setClient((prevClient) => ({
        ...prevClient,
        private: {
          ...prevClient["private"],
          phone_number: value,
        },
      }));
    }
  };

  const handleMapClick = (data) => {
    setClient((prevClient) => ({
      ...prevClient,
      address: {
        ...prevClient["address"],
        city: data.city,
        street: data.address,
        postal_code: data.postal_code,
      },
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    dispatch(createClient(client));
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
            Nowy klient
          </h2>
          <small className="font-semibold">
            Stworzysz tutaj nowego klienta
          </small>
        </div>
      </div>
      <div className="flex flex-col gap-5 w-[90%] m-auto">
        <div className="flex flex-col xl:flex-row gap-3 xl:gap-10">
          <div className="flex flex-col gap-2">
            <label>Nazwa klienta:</label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="Nazwa klienta"
              value={client.name}
              onChange={(e) => handleClientChange(e)}
              className="rounded-lg justify-center w-full xl:w-[168px] bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 h-11 text-sm border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label>Ulica:</label>
            <input
              id="street"
              type="text"
              name="street"
              value={client["address"].street}
              onChange={(e) => handleClientChange(e)}
              placeholder="Ulica"
              className="rounded-lg justify-center w-full xl:w-[168px] bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 h-11 text-sm border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label>Miejscowość:</label>
            <input
              id="city"
              type="text"
              name="city"
              value={client["address"].city}
              onChange={(e) => handleClientChange(e)}
              placeholder="Miejscowość"
              className="rounded-lg justify-center w-full xl:w-[168px] bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 h-11 text-sm border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label>Kod pocztowy:</label>
            <input
              id="postal_code"
              type="text"
              name="postal_code"
              placeholder="Kod pocztowy"
              value={client["address"].postal_code}
              onChange={(e) => handleClientChange(e)}
              className="rounded-lg justify-center w-full xl:w-[168px] bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 h-11 text-sm border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label>Numer telefonu:</label>
            <input
              id="phone_number"
              type="text"
              name="phone_number"
              placeholder="Numer telefonu"
              value={client["private"].phone_number}
              onChange={(e) => handleClientChange(e)}
              className="rounded-lg justify-center w-full xl:w-[168px] bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 h-11 text-sm border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label>Rachunek bankowy:</label>
            <input
              id="bank_account"
              type="text"
              name="bank_account"
              placeholder="Rachunek bankowy"
              value={client["private"].bank_account}
              onChange={(e) => handleClientChange(e)}
              className="rounded-lg justify-center w-full xl:w-[250px] bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 h-11 text-sm border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label>NIP:</label>
            <input
              id="nip"
              type="number"
              name="nip"
              placeholder="NIP"
              value={client["private"].nip}
              onChange={(e) => handleClientChange(e)}
              className="rounded-lg justify-center w-full xl:w-[168px] bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 h-11 text-sm border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>
        </div>
        <div className="buttons w-full m-auto flex justify-end">
          <Button
            className="w-full xl:w-auto dark:text-white bg-green-500 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-700"
            onClick={onSubmit}
          >
            Stwórz klienta
          </Button>
        </div>
        <div className="flex flex-col">
          <h1 className="font-medium pb-10 text-justify">
            Możesz zaznaczyć punkt na poniższej mapie, aby pola{" "}
            <span className="text-blue-500">Ulica</span>,{" "}
            <span className="text-blue-500">Miejscowość</span> oraz{" "}
            <span className="text-blue-500">Kod pocztowy</span> zostały
            uzupełnione danymi z zaznaczonego miejsca.
          </h1>
          <BuildMap onClick={handleMapClick} />
        </div>
      </div>
    </div>
  );
}

export default ClientCreator;
