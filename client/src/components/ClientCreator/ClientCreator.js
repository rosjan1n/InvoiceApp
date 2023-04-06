import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/* Utils */
import { invoice_form } from "../../lib/utils";
import MapContainer from "../ui/MapCreator";

function ClientCreator() {
  const [client, setClient] = useState(invoice_form.client);
  const navigate = useNavigate();

  const formatPhoneNumber = (e) => {
    const { value } = e.target;
    if (isNaN(value)) return;
    if (value.length > 9) return;
    var cleaned = ("" + value).replace(/\D/g, "");
    var match = cleaned.match(/^(\d{3})(\d{3})(\d{3})$/);
    if (match) {
      var result = match[1] + " " + match[2] + " " + match[3];
      return setClient((prevClient) => ({
        ...prevClient,
        private: {
          ...prevClient["private"],
          phone_number: result,
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
  };

  const formatPostalCode = (e) => {
    const { value } = e.target;
    if (isNaN(value)) return;
    if (value.length > 5) return;
    var cleaned = ("" + value).replace(/\D/g, "");
    var match = cleaned.match(/^(\d{2})(\d{3})$/);
    if (match) {
      var result = match[1] + "-" + match[2];
      return setClient((prevClient) => ({
        ...prevClient,
        address: {
          ...prevClient["address"],
          postal_code: result,
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
  };

  const handleMapClick = (data) => {
    setClient((prevClient) => ({
      ...prevClient,
      address: {
        ...prevClient['address'],
        city: data.city || '',
        street: data.street || '',
        postal_code: data.postal_code || '',
      }
    }));
    console.log(client);
  }

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
        <div className="flex gap-10">
          <div className="flex flex-col gap-2">
            <label>Nazwa klienta:</label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="Nazwa klienta"
              className="rounded-lg justify-center w-full xl:w-[168px] bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 h-11 text-sm border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label>Ulica:</label>
            <input
              id="name"
              type="text"
              name="name"
              value={client['address'].street}
              placeholder="Ulica"
              className="rounded-lg justify-center w-full xl:w-[168px] bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 h-11 text-sm border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label>Miejscowość:</label>
            <input
              id="name"
              type="text"
              name="name"
              value={client['address'].city}
              placeholder="Miejscowość"
              className="rounded-lg justify-center w-full xl:w-[168px] bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 h-11 text-sm border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label>Kod pocztowy:</label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="Kod pocztowy"
              value={client["address"].postal_code}
              onChange={(e) => formatPostalCode(e)}
              className="rounded-lg justify-center w-full xl:w-[168px] bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 h-11 text-sm border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label>Numer telefonu:</label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="Numer telefonu"
              value={client["private"].phone_number}
              onChange={(e) => formatPhoneNumber(e)}
              className="rounded-lg justify-center w-full xl:w-[168px] bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 h-11 text-sm border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>
        </div>
        <div className="flex flex-col">
          <h1 className="font-medium pb-10">Możesz zaznaczyć punkt na poniższej mapie, aby pola <span className="text-blue-500">Ulica</span>, <span className="text-blue-500">Miejscowość</span> oraz <span className="text-blue-500">Kod pocztowy</span> zostały uzupełnione danymi z zaznaczonego miejsca.</h1>
          <MapContainer onMapClick={handleMapClick}/>
        </div>
      </div>
    </div>
  );
}

export default ClientCreator;
