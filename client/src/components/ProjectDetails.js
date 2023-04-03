import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from 'axios';

function ProjectDetails() {
  const { id } = useParams();
  const [ project, setProject ] = useState({});

  useEffect(() => {
    fetchProject();
    // eslint-disable-next-line
  }, []);

  const fetchProject = async () => {
    const res = await axios.get('http://localhost:5001/api/projects/' + id);
    const data = res.data;
    setProject(data);
  }

  console.log("Projekt: ", project);
}

export default ProjectDetails;