import { useState } from "react";

/* Utils */
import { invoice_form } from "../../lib/utils";

function ClientCreator() {
  const [client, setClient] = useState(invoice_form.client);

  console.log(client);
}

export default ClientCreator;