import React from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Patient } from "../types";
import { apiBaseUrl } from "../constants";
import { useStateValue } from "../state";

const PatientPage: React.FC = () => {
  const [{ patients }, dispatch] = useStateValue();
  const { id } = useParams<{ id: string }>();

  React.useState(() => {
    const fetchPatient = async () => {
      try {
        const { data: patientFromApi } = await axios.get<Patient>(`${apiBaseUrl}/patients/${id}`);
        dispatch({ type: "GET_PATIENT", payload: patientFromApi });
      } catch(error) {
        console.log(error);
      }
    };
    fetchPatient();
  });

  const patient = Object.values(patients).find(p => p.id === id);

  if (patient !== undefined) {
    return(
      <div>
        <h1>{patient.name}</h1>
        <p>ssn: {patient.ssn}</p>
        <p>occupation: {patient.occupation}</p>
      </div>
    );
  } 
  else {
    return (
      <div>
        <p>Not found</p>
      </div>
    );
  }
};

export default PatientPage;