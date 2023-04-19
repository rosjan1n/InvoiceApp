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
  reset as resetInvoice,
} from "../reducers/features/invoices/invoiceSlice";
import { getClients, reset as resetClient } from "../reducers/features/clients/clientSlice.js";

/* UI Components */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
  const { invoices, isLoadingInvoice, isErrorInvoice, messageInvoice } = useSelector(
    (state) => state.invoice
  );
  const { clients, isLoadingClient, isErrorClient, messageClient } = useSelector(
    (state) => state.client
  );
  const invoice = invoices.find((i) => i._id === id);
  const client = clients.find((c) => c._id === invoice?.details.client_id);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  moment.locale("pl");

  useEffect(() => {
    if (!user) return navigate("/login");

    if (isErrorInvoice) console.log(messageInvoice);
    if (isErrorClient) console.log(messageClient);

    dispatch(getInvoices());
    dispatch(getClients());

    return () => {
      dispatch(resetInvoice());
      dispatch(resetInvoice());
    };
  }, [navigate, user, dispatch, isErrorInvoice, isErrorClient, messageInvoice, messageClient]);

  const vatOptions = [
    { value: 5, text: "5%" },
    { value: 8, text: "8%" },
    { value: 23, text: "23%" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    invoice.editedAt = new Date().toJSON();
    invoice.details.total = calculateDiscount(invoice);

    dispatch(editInvoice(id, invoice))
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

    if (!user) return navigate("/login");

    navigate("/");
    dispatch(deleteInvoice(invoice._id))
      .then(() => {
        toast({
          variant: "success",
          title: "Usunięto fakturę!",
          description: `Faktura #${invoice._id
            .substring(invoice._id.length - 6)
            .toUpperCase()} została poprawnie usunięta`,
        });
      })
      .catch(() => {
        toast({
          variant: "destructive",
          title: "Wystąpił błąd!",
          description: messageInvoice,
        });
      });
  };

  const handleNameChange = (e) => {
    const { value } = e.target;
    invoice["client"].name = value;
  };

  const handleProjectChange = (e) => {
    const { name, value } = e.target;
    const updatedProject = { ...invoice["project"], [name]: value };
    invoice["project"] = updatedProject;
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    const updatedAddress = { ...invoice["client"].address, [name]: value };
    invoice["client"].address = updatedAddress;
  };

  const handlePrivateChange = (e) => {
    const { name, value } = e.target;
    const updatedPrivate = { ...invoice["client"].private, [name]: value };
    invoice["client"].private = updatedPrivate;
  };

  const handleProductChange = (event, index) => {
    const { name, value } = event.target;
    const newProducts = [...invoice.products];
    newProducts[index] = { ...newProducts[index], [name]: value };
    invoice["products"] = newProducts;
  };

  const handleDetailsChange = (e) => {
    const { name, value } = e.target;
    const newDetails = { ...invoice.details, [name]: value };
    invoice["details"] = newDetails;
  };

  const totalProduct = () => {
    let total = 0;
    for (let index = 0; index < invoice?.products.length; index++) {
      total += invoice.products[index].total_price_brutto;   
    }
    return total;
  }

  if (isLoadingInvoice || isLoadingClient) return <Loader title={"Trwa wczytywanie szczegółów..."} />;

  return (
    <div className="w-[90%] mt-8 m-auto">
      <div className="flex flex-col lg:flex-row xl:flex-row gap-5 xl:gap-0 justify-between">
        <div className="flex gap-5 font-light">
          <div>
            <span className="font-semibold">Data wystawienia:</span> {moment(invoice?.details.date_issue).format('LL')}
          </div> 
          <div>
            <span className="font-semibold">Data sprzedaży:</span> {moment(invoice?.details.date_sale).format('LL')}
          </div>
          <div className="uppercase">
            <span className="font-semibold normal-case">Numer faktury: </span>{invoice?._id.substring(invoice?._id.length - 6)}
          </div>
        </div>
        <div className="flex justify-center lg:justify-end xl:justify-end">
            {invoice?.__v > 0 ? (
              <span className="bg-blue-100 text-blue-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-blue-400 border border-blue-400">
                <svg aria-hidden="true" className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path></svg>
                Edytowano {moment(invoice?.editedAt).fromNow()}
              </span>
            ) : []}
        </div>
      </div>
      <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"/>
      <div className="flex flex-col xl:grid xl:grid-cols-2 xl:justify-between">
        <div className="flex flex-col gap-3">
          <h3 className="font-semibold">Nadawca</h3>
          <div className="grid grid-cols-2 w-full">
            <label>Nazwa odbiorcy</label>
            <div className="text-sm select-text">{user?.username}</div>
            <label>Email</label>
            <div className="text-sm select-text">{user?.email}</div>
            <label>Adres</label>
            <div className="text-sm select-text">{user?.address?.street}</div>
            <label>Miasto</label>
            <div className="text-sm select-text">{user?.address?.city}</div>
            <label>Kod pocztowy</label>
            <div className="text-sm select-text">{user?.address?.postal_code}</div>
            <label>Numer telefonu</label>
            <div className="text-sm select-text">{user?.private?.phone_number}</div>
            <label>Rachunek bankowy</label>
            <div className="text-sm select-text">{user?.private?.bank_account}</div>
            <label>NIP</label>
            <div className="text-sm select-text">{user?.private?.nip}</div>
          </div>
        </div>
        <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700 xl:hidden"/>
        <div className="flex flex-col gap-3">
          <h3 className="font-semibold">Odbiorca</h3>
          <div className="grid grid-cols-2 w-full">
            <label>Nazwa klienta</label>
            <div className="text-sm select-text">{client?.name}</div>
            <label>Email</label>
            <div className="text-sm select-text">{client?.email}</div>
            <label>Adres</label>
            <div className="text-sm select-text">{client?.address.street}</div>
            <label>Miasto</label>
            <div className="text-sm select-text">{client?.address.city}</div>
            <label>Kod pocztowy</label>
            <div className="text-sm select-text">{client?.address.postal_code}</div>
            <label>Numer telefonu</label>
            <div className="text-sm select-text">{client?.private.phone_number}</div>
            <label>Rachunek bankowy</label>
            <div className="text-sm select-text">{client?.private.bank_account}</div>
            <label>NIP</label>
            <div className="text-sm select-text">{client?.private.nip}</div>
          </div>
        </div>
      </div>
      <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"/>
      <div className="relative overflow-x-auto mt-10">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3 rounded-l-lg">
                Nazwa produktu/usługi
              </th>
              <th scope="col" className="px-6 py-3">
                Ilość
              </th>
              <th scope="col" className="px-6 py-3">
                Cena brutto
              </th>
              <th scope="col" className="px-6 py-3">
                Cena netto
              </th>
              <th scope="col" className="px-6 py-3 rounded-r-lg">
                VAT
              </th>
            </tr>
          </thead>
          <tbody>
            {invoice?.products.map((product, index) => (
              <tr key={index} className="bg-white dark:bg-gray-800">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {product.name}
                </th>
                <td className="px-6 py-4">
                  {product.quantity}
                </td>
                <td className="px-6 py-4">
                  {product.price_vat}
                </td>
                <td className="px-6 py-4">
                  {product.price} PLN
                </td>
                <td className="px-6 py-4">
                  {product.vat}%
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
              <tr className="font-semibold text-gray-900 dark:text-white">
                  <th scope="row" className="px-6 py-3 text-base">Łącznie</th>
                  <td className="px-6 py-3">{invoice?.products.length}</td>
                  <td className="px-6 py-3">{totalProduct().toFixed(2)} PLN</td>
              </tr>
          </tfoot>
        </table>
      </div>
      <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"/>
      <div className="flex gap-5">
        <Button variant={'outline'}><FontAwesomeIcon className="pr-2" icon="fa-solid fa-download" />Pobierz fakturę</Button>
        <Button variant={'destructive'}><FontAwesomeIcon className="pr-2" icon="fa-solid fa-trash" />Usuń fakturę</Button>
      </div>
    </div>
  );
}

export default InvoiceDetails;
