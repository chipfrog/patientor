import React from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Patient } from "../types";
import { apiBaseUrl } from "../constants";
import { useStateValue, updatePatient } from "../state";
import { Card, Icon } from "semantic-ui-react";
import EntryDetails from "../components/EntryDetails";

const PatientPage: React.FC = () => {
  const [{ patients }, dispatch] = useStateValue();
  const { id } = useParams<{ id: string }>();

  React.useState(() => {
    const patientToFetch = Object.values(patients).find(p => p.id === id);
    // mahdollisesti ssn-tarkistusta muutettava uusien entryjen lisäämisen takia
    if (patientToFetch !== undefined && patientToFetch.ssn === undefined) {
      const fetchPatient = async () => {
        try {        
          const { data: patientFromApi } = await axios.get<Patient>(`${apiBaseUrl}/patients/${id}`);
          dispatch(updatePatient(patientFromApi));
        } catch(error) {
          console.log(error);
        }
      };
      fetchPatient();
    }
  });

  const patient = Object.values(patients).find(p => p.id === id);

  if (patient !== undefined && patient.entries !== undefined) {
    return(
      <div>
        <h1>
          {patient.name} 
          {patient.gender === 'male' && <Icon className="mars" />}
          {patient.gender === 'female' && <Icon className="venus" />}
          {patient.gender === 'other' && <Icon className="genderless" />}
        </h1>
        <p>ssn: {patient.ssn}</p>
        <p>occupation: {patient.occupation}</p>
        <div>
         <h2>entries</h2>
         {patient.entries.map((entry) => (
           <div key={entry.id}>
             <Card.Group>
              <EntryDetails entry={entry} />
            </Card.Group>
            {/* <p>{entry.date} {entry.description}</p>
            <ul>
              {entry.diagnosisCodes?.map((code) => (
                <li key={code}>{code} {Object.values(diagnoses).find(d => d.code === code)?.name} </li>
              ))}
            </ul> */}
           </div>
         ))}
        </div>
      </div>
    );
  } 
  else {
    return (
      <div>
        <p>Patient not found</p>
      </div>
    );
  }
};

export default PatientPage;