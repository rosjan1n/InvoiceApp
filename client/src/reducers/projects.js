export default (projects = [], action) => {
  switch (action.type) {
    case 'PROJECTS_FETCH_ALL':
      return action.payload;;
    default:
      return projects;
  }
}