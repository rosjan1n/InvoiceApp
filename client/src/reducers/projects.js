export const projects =  (projects = [], action) => {
  switch (action.type) {
    case 'PROJECTS_FETCH_ALL':
      return action.payload;;
    case 'PROJECTS_CREATE':
      return [ ...projects, action.payload ];
    default:
      return projects;
  }
}