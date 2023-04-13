export const clients = (clients = [], action) => {
  switch (action.type) {
    case 'CLIENTS_FETCH_ALL':
      return action.payload;
    case 'CLIENTS_CREATE':
      return [ ...clients, action.payload ];
    default:
      return clients;
  }
}