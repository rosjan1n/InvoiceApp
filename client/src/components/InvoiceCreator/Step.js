import { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";

/* Components */
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectSeparator,
  SelectValue,
} from "../ui/select.tsx";
import { Button } from "../ui/button.tsx";

/* Utils */
import { invoice_form, calculateBrutto, calculateVat } from "../../lib/utils";

function Step({ currentStep, clients, projects, onSubmit }) {
  const [data, setData] = useState(invoice_form);

  const handleClientChange = (value) => {
    const client = clients.find((c) => c._id === value);
    var updatedClient = { ...data["client"], name: client.name };
    var updatedDetails = { ...data["details"], client_id: value };
    updatedClient = { ...updatedClient, address: client.address };
    updatedClient = { ...updatedClient, private: client.private };
    setData((prevInvoice) => ({
      ...prevInvoice,
      client: updatedClient,
      details: updatedDetails,
    }));
  };

  const handleProjectChange = (value) => {
    const project = projects.find((p) => p._id === value);
    var updatedDetails = { ...data["details"], project_id: value };
    var updatedProject = { ...data["project"], name: project.name };
    updatedProject = { ...updatedProject, category: project.category };
    setData((prevInvoice) => ({
      ...prevInvoice,
      project: updatedProject,
      details: updatedDetails,
    }));
  };

  const handleProductChange = (event, index) => {
    const { name, value } = event.target;
    const newProducts = [...data.products];
    newProducts[index] = { ...newProducts[index], [name]: value };
    setData((prevInvoice) => ({
      ...prevInvoice,
      products: newProducts,
    }));
  };

  const handleDetailsChange = (e) => {
    const { name, value } = e.target;
    const newDetails = { ...data.details, [name]: value };
    setData((prevInvoice) => ({
      ...prevInvoice,
      details: newDetails,
    }));
  };

  const handlePaymentChange = (value) => {
    setData((prevInvoice) => ({
      ...prevInvoice,
      details: {
        ...prevInvoice["details"],
        payment_method: value,
      },
    }));
  };

  const addProduct = () => {
    setData((prevInvoice) => ({
      ...prevInvoice,
      products: [
        ...prevInvoice.products,
        {
          name: "",
          description: "",
          quantity: 1,
          price: 0,
          vat: 5,
          vat_price: 0,
          total_price_brutto: 0,
          total_price_netto: 0,
        },
      ],
    }));
  };

  const removeProduct = (index) => {
    if (data["products"].length > 1)
      setData((prevInvoice) => ({
        ...prevInvoice,
        products: prevInvoice.products.filter((_, i) => i !== index),
      }));
  };

  const vatOptions = [
    { value: 5, text: "5%" },
    { value: 8, text: "8%" },
    { value: 23, text: "23%" },
  ];

  if (currentStep === 1)
    return (
      <div className="flex flex-col xl:flex-row gap-5 w-[90%] m-auto xl:m-0">
        <div className="flex flex-col gap-2 w-full xl:w-1/4">
          <label>Dane klienta:</label>
          <div className="flex">
            <span className="inline-flex items-center justify-center px-3 w-[125px] h-[43px] text-sm whitespace-nowrap text-blue-500 hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-700 cursor-pointer bg-gray-200 border border-r-0 border-gray-300 rounded-l-md dark:bg-gray-600 dark:border-gray-600">
              <FontAwesomeIcon className="pr-1" icon="fa-solid fa-plus" />
              Nowy klient
            </span>
            <Select
              name="select-client"
              value={data["details"].client_id}
              onValueChange={(value) => handleClientChange(value)}
            >
              <SelectTrigger
                name="client_id"
                className="select-client rounded-none rounded-r-lg px-2 border w-full h-[43px] focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500"
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
                    {client.name} <span className="uppercase font-semibold">({client._id.substring(client._id.length - 6)})</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex flex-col gap-2 w-full xl:w-1/4">
          <label>Dane projektu:</label>
          <div className="flex">
            <span className="inline-flex items-center justify-center px-3 w-[125px] h-[43px] text-sm whitespace-nowrap text-blue-500 hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-700 cursor-pointer bg-gray-200 border border-r-0 border-gray-300 rounded-l-md dark:bg-gray-600 dark:border-gray-600">
              <FontAwesomeIcon className="pr-1" icon="fa-solid fa-plus" />
              <Link to={"/projects"}>Nowy projekt</Link>
            </span>
            <Select
              name="select-project"
              value={data["details"].project_id}
              onValueChange={(value) => handleProjectChange(value)}
            >
              <SelectTrigger
                name="project_id"
                className="select-project rounded-none rounded-r-lg px-2 border w-full h-[43px] focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500"
              >
                <SelectValue placeholder="Wybierz projekt" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="" disabled>
                  Wybierz projekt
                </SelectItem>
                <SelectSeparator />
                {projects.map((project, i) => (
                  <SelectItem key={i} value={project._id}>
                    {project.name} (<span className="uppercase font-semibold">{project._id.substring(project._id.length - 6)}</span>)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex lg:hidden gap-4">
          <div className="flex flex-col gap-2 w-full xl:w-1/4">
            <label>Data wystawienia:</label>
            <input
              id="date-issue"
              type="date"
              name="date_issue"
              value={moment(data["details"].date_issue).format("YYYY-MM-DD")}
              onChange={(e) => handleDetailsChange(e)}
              className="rounded-lg justify-center w-[168px] bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 h-11 text-sm border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>
          <div className="flex flex-col gap-2 w-full xl:w-1/4">
            <label>Data sprzedaży:</label>
            <input
              id="date-sale"
              type="date"
              name="date_sale"
              value={moment(data["details"].date_sale).format("YYYY-MM-DD")}
              onChange={(e) => handleDetailsChange(e)}
              className="rounded-lg justify-center w-[168px] bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 h-11 text-sm border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>
        </div>
        <div className="hidden xl:flex flex-col gap-2 w-full xl:w-1/4">
          <label>Data wystawienia:</label>
          <input
            type="date"
            name="date_issue"
            value={moment(data["details"].date_issue).format("yyyy-MM-DD")}
            onChange={(e) => handleDetailsChange(e)}
            className="rounded-lg justify-center px-2 bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 h-11 text-sm border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
        <div className="hidden xl:flex flex-col gap-2 w-full xl:w-1/4">
          <label>Data sprzedaży:</label>
          <input
            type="date"
            name="date_sale"
            value={moment(data["details"].date_sale).format("YYYY-MM-DD")}
            onChange={(e) => handleDetailsChange(e)}
            className="rounded-lg justify-center px-2 bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 h-11 text-sm border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
      </div>
    );
  if (currentStep === 2)
    return (
      <div className="flex flex-col w-full gap-10">
        <div className="flex flex-col xl:flex-row gap-5 w-[90%] m-auto xl:m-0">
          <div className="flex flex-col gap-2 w-full xl:w-1/4">
            <label>Metoda płatności:</label>
            <Select
              value={data["details"].payment_method}
              onValueChange={(value) => handlePaymentChange(value)}
            >
              <SelectTrigger className="select-payment gap-2 px-2 border w-full h-[43px] focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500">
                <SelectValue placeholder="Wybierz metodę płatności" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="" disabled>
                  Wybierz metodę płatności
                </SelectItem>
                <SelectSeparator />
                <SelectItem value="bank">Przelew bankowy</SelectItem>
                <SelectItem value="cash">Gotówka</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-center">Produkty</h1>
        <div className="overflow-x-auto">
          <table className="w-[1300px] m-auto border-separate border-spacing-y-2">
            <thead>
              <tr>
                <th className="font-extrabold">#</th>
                <th>Nazwa usługi/produktu</th>
                <th>Ilość</th>
                <th>Cena jednostkowa</th>
                <th>VAT</th>
                <th>Wartość brutto</th>
                <th>Kwota VAT</th>
                <th>Akcja</th>
              </tr>
            </thead>
            <tbody>
              {data.products.map((product, i) => (
                <tr key={i}>
                  <td>
                    <label>{i + 1}</label>
                  </td>
                  <td>
                    <input
                      type="text"
                      name="name"
                      className="bg-gray-50 border m-auto border-gray-300 text-gray-900 text-sm rounded-lg disabled:bg-gray-200/70 focus:ring-blue-500 focus:border-blue-500 block w-3/4 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      value={product.name}
                      onChange={(e) => handleProductChange(e, i)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="quantity"
                      className="bg-gray-50 border m-auto border-gray-300 text-gray-900 text-sm rounded-lg disabled:bg-gray-200/70 focus:ring-blue-500 focus:border-blue-500 block w-3/4 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      value={product.quantity}
                      onChange={(e) => handleProductChange(e, i)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="price"
                      min={0}
                      max={99999999}
                      maxLength={10}
                      className="bg-gray-50 border m-auto border-gray-300 text-gray-900 text-sm rounded-lg disabled:bg-gray-200/70 focus:ring-blue-500 focus:border-blue-500 block w-3/4 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      value={product.price}
                      onChange={(e) => handleProductChange(e, i)}
                    />
                  </td>
                  <td>
                    <select
                      value={product.vat}
                      onChange={(e) => handleProductChange(e, i)}
                      id="vat"
                      name="vat"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg disabled:bg-gray-200/70 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    >
                      {vatOptions.map((vat, i) => (
                        <option key={i} value={vat.value}>
                          {vat.text}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <input
                      type="number"
                      name="total_price_brutto"
                      className="bg-gray-50 border m-auto border-gray-300 text-gray-900 text-sm rounded-lg disabled:bg-gray-200/70 focus:ring-blue-500 focus:border-blue-500 block w-3/4 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      value={
                        (product.total_price_brutto =
                          calculateBrutto(product).toFixed(2))
                      }
                      disabled
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="price_vat"
                      className="bg-gray-50 border m-auto border-gray-300 text-gray-900 text-sm rounded-lg disabled:bg-gray-200/70 focus:ring-blue-500 focus:border-blue-500 block w-3/4 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      value={
                        (product.price_vat = calculateVat(product).toFixed(2))
                      }
                      disabled
                    />
                  </td>
                  <td className="text-center">
                    <FontAwesomeIcon
                      icon="fa-solid fa-trash"
                      className="text-red-500 hover:text-red-700 cursor-pointer"
                      onClick={() => removeProduct(i)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Button
          className="bg-green-500 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-700 w-60 m-auto xl:m-0"
          onClick={() => addProduct()}
        >
          Dodaj usługę/produkt
        </Button>
      </div>
    );
  if (currentStep === 3)
    return (
      <form className="flex flex-col w-[70%] m-auto">
        <div className="grid md:grid-cols-3 md:gap-6">
          <div className="relative z-0 w-full mb-6 group">
            <input
              type="date"
              name="date_issue"
              id="date_issue"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-indigo-600 focus:outline-none focus:ring-0 focus:border-indigo-600 peer"
              defaultValue={moment(data["details"].date_issue).format(
                "YYYY-MM-DD"
              )}
              disabled
            />
            <label
              htmlFor="date_issue"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-indigo-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Data wystawienia
            </label>
          </div>
          <div className="relative z-0 w-full mb-6 group">
            <input
              type="date"
              name="date_sale"
              id="date_sale"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-indigo-600 focus:outline-none focus:ring-0 focus:border-indigo-600 peer"
              defaultValue={moment(data["details"].date_sale).format(
                "YYYY-MM-DD"
              )}
              disabled
            />
            <label
              htmlFor="date_sale"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-indigo-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Data sprzedaży
            </label>
          </div>
          <div className="relative z-0 w-full mb-6 group">
            <input
              type="text"
              name="status"
              id="status"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-indigo-600 focus:outline-none focus:ring-0 focus:border-indigo-600 peer"
              defaultValue={
                data.details.status === 1 ? "Zapłacone" : "Oczekuje"
              }
              disabled
            />
            <label
              htmlFor="status"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-indigo-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Status faktury
            </label>
          </div>
        </div>
        <div className="relative z-0 w-full mb-6 group">
          <input
            type="text"
            name="name"
            id="name"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-indigo-600 focus:outline-none focus:ring-0 focus:border-indigo-600 peer"
            defaultValue={data.client.name}
            disabled
          />
          <label
            htmlFor="name"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-indigo-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Nazwa klienta
          </label>
        </div>
        <div className="relative z-0 w-full mb-6 group">
          <input
            type="text"
            name="bank_account"
            id="bank_account"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-indigo-600 focus:outline-none focus:ring-0 focus:border-indigo-600 peer"
            defaultValue={data.client.private.bank_account}
            disabled
          />
          <label
            htmlFor="bank_account"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-indigo-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Rachunek bankowy
          </label>
        </div>
        <div className="relative z-0 w-full mb-6 group">
          <input
            type="number"
            name="nip"
            id="nip"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-indigo-600 focus:outline-none focus:ring-0 focus:border-indigo-600 peer"
            defaultValue={data.client.private.nip}
            disabled
          />
          <label
            htmlFor="nip"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-indigo-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            NIP
          </label>
        </div>
        <div className="grid md:grid-cols-3 md:gap-6">
          <div className="relative z-0 w-full mb-6 group">
            <input
              type="text"
              name="street"
              id="street"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-indigo-600 focus:outline-none focus:ring-0 focus:border-indigo-600 peer"
              defaultValue={data.client.address.street}
              disabled
            />
            <label
              htmlFor="street"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-indigo-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Ulica
            </label>
          </div>
          <div className="relative z-0 w-full mb-6 group">
            <input
              type="text"
              name="city"
              id="city"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-indigo-600 focus:outline-none focus:ring-0 focus:border-indigo-600 peer"
              defaultValue={data.client.address.city}
              disabled
            />
            <label
              htmlFor="city"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-indigo-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Miasto
            </label>
          </div>
          <div className="relative z-0 w-full mb-6 group">
            <input
              type="tel"
              pattern="[0-9]{3}[0-9]{3}[0-9]{3}"
              name="phone_number"
              id="phone_number"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-indigo-600 focus:outline-none focus:ring-0 focus:border-indigo-600 peer"
              defaultValue={data.client.private.phone_number}
              disabled
            />
            <label
              htmlFor="phone_number"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-indigo-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Numer telefonu
            </label>
          </div>
        </div>
        <div className="grid md:grid-cols-2 md:gap-6">
          <div className="relative z-0 w-full mb-6 group">
            <input
              type="text"
              name="name"
              id="name"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-indigo-600 focus:outline-none focus:ring-0 focus:border-indigo-600 peer"
              defaultValue={data.project.name}
              disabled
            />
            <label
              htmlFor="name"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-indigo-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Podpięty projekt
            </label>
          </div>
          <div className="relative z-0 w-full mb-6 group">
            <input
              type="text"
              name="category"
              id="category"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-indigo-600 focus:outline-none focus:ring-0 focus:border-indigo-600 peer"
              defaultValue={data.project.category}
              disabled
            />
            <label
              htmlFor="category"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-indigo-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Kategoria projektu
            </label>
          </div>
        </div>
        <h1 className="text-center font-bold text-2xl">Produkty</h1>
        <div className="my-10 overflow-auto">
          <table className="text-center w-[1000px] m-auto border-separate border-spacing-y-2">
            <thead>
              <tr>
                <th className="font-extrabold">#</th>
                <th>Nazwa usługi/produktu</th>
                <th>Ilość</th>
                <th>Cena jednostkowa</th>
                <th>VAT</th>
                <th>Wartość brutto</th>
                <th>Kwota VAT</th>
              </tr>
            </thead>
            <tbody>
              {data.products.map((product, i) => (
                <tr key={i}>
                  <td className="w-[5%]">
                    <label>{i + 1}</label>
                  </td>
                  <td>
                    <input
                      type="text"
                      name="name"
                      className="bg-gray-50 border m-auto border-gray-300 text-gray-900 text-sm rounded-lg disabled:bg-gray-200 dark:disabled:bg-gray-700 focus:ring-blue-500 focus:border-blue-500 block w-3/4 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      defaultValue={product.name}
                      disabled
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="quantity"
                      className="bg-gray-50 border m-auto border-gray-300 text-gray-900 text-sm rounded-lg disabled:bg-gray-200 dark:disabled:bg-gray-700 focus:ring-blue-500 focus:border-blue-500 block w-3/4 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      defaultValue={product.quantity}
                      disabled
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="price"
                      min={0}
                      max={99999999}
                      maxLength={10}
                      className="bg-gray-50 border m-auto border-gray-300 text-gray-900 text-sm rounded-lg disabled:bg-gray-200 dark:disabled:bg-gray-700 focus:ring-blue-500 focus:border-blue-500 block w-3/4 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      defaultValue={product.price}
                      disabled
                    />
                  </td>
                  <td>
                    <select
                      defaultValue={product.vat}
                      id="vat"
                      name="vat"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg disabled:bg-gray-200 dark:disabled:bg-gray-700 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      disabled
                    >
                      {vatOptions.map((vat, i) => (
                        <option key={i} value={vat.value}>
                          {vat.text}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <input
                      type="number"
                      name="total_price_brutto"
                      className="bg-gray-50 border m-auto border-gray-300 text-gray-900 text-sm rounded-lg disabled:bg-gray-200 dark:disabled:bg-gray-700 focus:ring-blue-500 focus:border-blue-500 block w-3/4 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      value={
                        (product.total_price_brutto =
                          calculateBrutto(product).toFixed(2))
                      }
                      disabled
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="price_vat"
                      className="bg-gray-50 border m-auto border-gray-300 text-gray-900 text-sm rounded-lg disabled:bg-gray-200 dark:disabled:bg-gray-700 focus:ring-blue-500 focus:border-blue-500 block w-3/4 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      value={
                        (product.vat_price = calculateVat(product).toFixed(2))
                      }
                      disabled
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </form>
    );
  if (currentStep === 4) onSubmit({ data });
}

export default Step;
