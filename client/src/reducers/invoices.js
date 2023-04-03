export default (invoices = [], action) => {
  switch (action.type) {
    case 'INVOICES_FETCH_ALL':
      return action.payload;
    case 'INVOICES_CREATE':
      return [ ...invoices, action.payload ];
    case 'INVOICES_FETCH':
      return action.payload;
    case 'INVOICES_EDIT':
      return invoices.map((invoice) => invoice._id === action.payload._id ? action.payload : invoice);
    case 'INVOICES_DELETE':
      return invoices.filter((invoice) => invoice._id !== action.payload);
    default:
      return invoices;
  }
}