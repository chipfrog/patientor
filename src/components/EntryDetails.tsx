import React from "react";
import { Card, Icon, Feed } from "semantic-ui-react";
import { useStateValue } from "../state";
import { Entry, OccupationalHealthcareEntry, HospitalEntry, HealthCheckEntry } from "../types";
import HealthRatingBar from "./HealthRatingBar";

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled error: ${JSON.stringify(value)}`
  );
};

const EntryDetails: React.FC<{ entry: Entry }> = ({ entry }) => {
  switch (entry.type) {
    case "Hospital":
      return <Hospital entry={entry} />;
    case "OccupationalHealthcare":
      return <Occupational entry={entry} />;
    case "HealthCheck":
      return <HealthCheck entry={entry} /> ;
    default:
      return assertNever(entry);
  }
};

const DiagnoseList: React.FC<{ entry: Entry }> = ({ entry }) => {
  const [{ diagnoses }] = useStateValue();
  return (
    <Feed>
      {entry.diagnosisCodes?.map((code) => (
        <Feed.Event key={code}>
          <Feed.Summary><b>{code}</b> {Object.values(diagnoses).find(d => d.code === code)?.name} </Feed.Summary>
        </Feed.Event>
      ))}
    </Feed>
  );
};

interface HospitalProps {
  entry: HospitalEntry;
}

const Hospital: React.FC<HospitalProps> = ({ entry }) => {
  return (
    <Card>
      <Card.Content>
        <Card.Header>{entry.date} <Icon className="hospital"/></Card.Header>
      </Card.Content>
      <Card.Content>
        <Card.Description>{entry.description}</Card.Description>
      </Card.Content>
      <Card.Content>
        <Card.Description>Date of discharge: {entry.discharge.date}</Card.Description>
        <Card.Description>Criteria: {entry.discharge.criteria}</Card.Description>
      </Card.Content>
      <Card.Content>  
        <DiagnoseList entry={entry} />
      </Card.Content>  
    </Card>
  );
};

interface OccupationalProps {
  entry: OccupationalHealthcareEntry;
}

const Occupational: React.FC<OccupationalProps> = ({ entry }) => {
  return (
    <Card>
      <Card.Content>
        <Card.Header>{entry.date} <Icon className="heartbeat"/>{entry.employerName}</Card.Header>
      </Card.Content>
      <Card.Content>  
        <Card.Description>{entry.description}</Card.Description>
      </Card.Content>
      {entry.sickLeave !== undefined && 
        <Card.Content>
        <Card.Description>Sick leave: {entry.sickLeave?.startDate} - {entry.sickLeave?.endDate}</Card.Description>
      </Card.Content> 
      } 
      <Card.Content>
        <DiagnoseList entry={entry} />
      </Card.Content>  
    </Card>
  );
};

interface HealthCheckProps {
  entry: HealthCheckEntry;
}

const HealthCheck: React.FC<HealthCheckProps> = ({ entry }) => {
  return (
    <Card>
      <Card.Content>
        <Card.Header>{entry.date} <Icon className="doctor"/></Card.Header>
      </Card.Content>
      <Card.Content> 
        <Card.Description>{entry.description}</Card.Description>
      </Card.Content>
      <Card.Content>
        <HealthRatingBar rating={entry.healthCheckRating} showText={false}/>
      </Card.Content>
      <Card.Content>
        <DiagnoseList entry={entry} />
      </Card.Content>
    </Card>
  );
};

export default EntryDetails;