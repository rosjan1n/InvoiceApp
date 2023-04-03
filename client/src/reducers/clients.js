export default (clients = [], action) => {
  switch (action.type) {
    case 'CLIENTS_FETCH_ALL':
      return action.payload;;
    default:
      return clients;
  }
}