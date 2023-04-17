import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import "moment/locale/pl";

/* Utils */
import {
  calculateBrutto,
  calculateTotal,
  calculateDiscount,
  calculateVat,
} from "../lib/utils";

/* Actions */
import {
  getInvoices,
  editInvoice,
  deleteInvoice,
  reset,
} from "../reducers/features/invoices/invoiceSlice";

/* UI Components */
import { useToast } from "./ui/use-toast.tsx";
import { ToastAction } from "./ui/toast.tsx";
import { Button } from "./ui/button.tsx";
import Loader from "./ui/Loader";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog.tsx";

function InvoiceDetails() {
  const { id } = useParams();
  const { user } = useSelector((state) => state.auth);
  const { invoices, isLoading, isError, message } = useSelector(
    (state) => state.invoice
  );
  const data = invoices.find((i) => i._id === id);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  moment.locale("pl");

  useEffect(() => {
    if (!user) return navigate("/");

    if (isError) console.log(message);

    dispatch(getInvoices());

    return () => {
      dispatch(reset());
    };
  }, [navigate, user, dispatch, isError, message]);

  const vatOptions = [
    { value: 5, text: "5%" },
    { value: 8, text: "8%" },
    { value: 23, text: "23%" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    data.editedAt = new Date().toJSON();
    data.details.total = calculateDiscount(data);

    dispatch(editInvoice(id, data))
      .then(() => {
        toast({
          variant: "success",
          title: "Edytowano fakturę!",
          description: `Faktura została edytowana i zapisana.`,
        });
        navigate(-1);
      })
      .catch(() => {
        toast({
          variant: "destructive",
          title: "Wystąpił błąd!",
          description: `Wystąpił błąd podczas edycji faktury. Upewnij się czy wszystkie pola są uzupełnione.`,
        });
      });
  };

  const handleDelete = (e) => {
    e.preventDefault();

    if(!user)
      return navigate('/login');

    navigate('/');
    dispatch(deleteInvoice(data._id))
      .then(() => {
        toast({
          variant: 'success',
          title: 'Usunięto fakturę!',
          description: `Faktura #${(data._id.substring(data._id.length - 6)).toUpperCase()} została poprawnie usunięta`
        })
      })
      .catch(() => {
        toast({
          variant: 'destructive',
          title: "Wystąpił błąd!",
          description: message
        })
      })
  }

  const handleNameChange = (e) => {
    const { value } = e.target;
    data["client"].name = value;
  };

  const handleProjectChange = (e) => {
    const { name, value } = e.target;
    const updatedProject = { ...data["project"], [name]: value };
    data["project"] = updatedProject;
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    const updatedAddress = { ...data["client"].address, [name]: value };
    data["client"].address = updatedAddress;
  };

  const handlePrivateChange = (e) => {
    const { name, value } = e.target;
    const updatedPrivate = { ...data["client"].private, [name]: value };
    data["client"].private = updatedPrivate;
  };

  const handleProductChange = (event, index) => {
    const { name, value } = event.target;
    const newProducts = [...data.products];
    newProducts[index] = { ...newProducts[index], [name]: value };
    data["products"] = newProducts;
  };

  const handleDetailsChange = (e) => {
    const { name, value } = e.target;
    const newDetails = { ...data.details, [name]: value };
    data["details"] = newDetails;
  };

  if (isLoading) return <Loader title={"Trwa wczytywanie szczegółów..."} />;

  return (
    <div className="flex gap-24 flex-col mb-6">
      <div>
        <div className="flex justify-between mt-4 mb-10 w-11/12 m-auto">
          <header className="container-header">
            <h2 className="text-2xl font-bold">
              Szczegóły faktury{" "}
              <span className="italic bg-indigo-400 p-1 rounded-lg text-white decoration-indigo-400 uppercase select-all">
                <span className="font-extrabold">#</span>
                {data?._id.substring(data?._id.length - 6)}
              </span>
            </h2>
            <small className="text-sm font-medium leading-none">
              Zobaczysz tutaj szczegóły faktury
            </small>
          </header>
          <small className="font-medium">
            {data?.__v > 0
              ? "Ostatnio edytowano: " + moment(data.editedAt).fromNow()
              : ""}
          </small>
        </div>
        <form className="flex flex-col w-[90%] m-auto">
          <div className="grid md:grid-cols-3 md:gap-6">
            <div className="relative z-0 w-full mb-6 group">
              <input
                type="date"
                name="date_issue"
                id="date_issue"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-indigo-600 focus:outline-none focus:ring-0 focus:border-indigo-600 peer"
                value={moment(data["details"].date_issue).format("YYYY-MM-DD")}
                onChange={(e) => handleDetailsChange(e)}
                required
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
                value={moment(data["details"].date_sale).format("YYYY-MM-DD")}
                onChange={(e) => handleDetailsChange(e)}
                required
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
                value={data.details.status === 1 ? "Zapłacone" : "Oczekuje"}
                onChange={(e) => handleDetailsChange(e)}
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
              value={data.client.name}
              onChange={(e) => handleNameChange(e)}
              required
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
              value={data.client.private.bank_account}
              onChange={(e) => handlePrivateChange(e)}
              required
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
              value={data.client.private.nip}
              onChange={(e) => handlePrivateChange(e)}
              required
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
                value={data.client.address.street}
                onChange={(e) => handleAddressChange(e)}
                required
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
                value={data.client.address.city}
                onChange={(e) => handleAddressChange(e)}
                required
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
                onChange={(e) => handlePrivateChange(e)}
                required
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
              {/* TODO - Select with available user projects*/}
              <input
                type="text"
                name="name"
                id="name"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-indigo-600 focus:outline-none focus:ring-0 focus:border-indigo-600 peer"
                value={data.project.name}
                onChange={(e) => handleProjectChange(e)}
                required
              />
              <label
                htmlFor="name"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-indigo-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Podpięty projekt
              </label>
            </div>
            <div className="relative z-0 w-full mb-6 group">
              {/* TODO - Select with available categories*/}
              <input
                type="text"
                name="category"
                id="category"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-indigo-600 focus:outline-none focus:ring-0 focus:border-indigo-600 peer"
                value={data.project.category}
                onChange={(e) => handleProjectChange(e)}
                required
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
            <table className="text-center w-[1700px] m-auto border-separate border-spacing-y-2">
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
                        value={calculateBrutto(product).toFixed(2)}
                        disabled
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        name="price_vat"
                        className="bg-gray-50 border m-auto border-gray-300 text-gray-900 text-sm rounded-lg disabled:bg-gray-200/70 focus:ring-blue-500 focus:border-blue-500 block w-3/4 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        value={calculateVat(product).toFixed(2)}
                        disabled
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col justify-end items-end mb-4">
            <div className="font-semibold text-2xl">
              Łączna kwota: $
              <span>{calculateTotal(data).total.toFixed(2)}</span>
            </div>
            {data.details.discount > 0 ? (
              <div className="font-semibold text-2xl">
                Łączna kwota z rabatem: $
                <span>{calculateDiscount(data).toFixed(2)}</span>
              </div>
            ) : (
              ""
            )}
            <div className="font-semibold text-2xl">
              Rabat: {data.details.discount}%
            </div>
          </div>
          <div className="flex justify-end gap-5">
            <Button
              type="submit"
              id="edit_invoice"
              className="bg-green-500 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-700 dark:text-white"
              onClick={(e) => handleSubmit(e)}
            >
              Pobierz fakturę
            </Button>
            <Button
              type="submit"
              id="edit_invoice"
              className="bg-indigo-500 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-700 dark:text-white"
              onClick={(e) => handleSubmit(e)}
            >
              Edytuj
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Usuń fakturę</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Czy jesteś pewny że chcesz usunąć fakturę?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Ta akcja jest nie do cofnięcia. Spowoduje to permanentne
                    usunięcie faktury z naszy serwerów.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Anuluj</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>Usuń</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </form>
      </div>
    </div>
  );
}

export default InvoiceDetails;
