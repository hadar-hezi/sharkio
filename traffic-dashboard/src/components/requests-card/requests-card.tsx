import {
  Box,
  Button,
  Card,
  CircularProgress,
  List,
  Typography,
} from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { RequestsMetadataContext } from '../../context/requests-context';
import { FilterBar } from '../filter-bar/filter-bar';
import { RequestRow } from '../request-row/request-row';
import styles from './requests-card.module.scss';

interface IRequestCardProps {
  className?: string;
  withControls: boolean;
}
export const RequestsCard: React.FC<IRequestCardProps> = ({
  withControls = false,
}) => {
  const [filter, setFilter] = useState<string>();
  const [methodsFilter, setMethodsFilter] = useState<string[]>([]);
  const [servicesFilter, setServicesFilter] = useState<string[]>([]);
  const {
    requestsData: requests,
    servicesData: services,
    loadData,
    loading,
  } = useContext(RequestsMetadataContext);

  useEffect(() => {
    loadData?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterChanged: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (e) => {
    setFilter(e.target.value);
  };

  const filteredRequests = requests?.filter(
    (req) =>
      (filter ? req.url.includes(filter) : true) &&
      (methodsFilter.length > 0
        ? methodsFilter.find((method) => method === req.method) !== undefined
        : true) &&
      (servicesFilter.length > 0
        ? servicesFilter.find((service) => service === req.serviceId) !==
          undefined
        : true),
  );

  return (
    <>
      {withControls && (
        <FilterBar
          handleFilterChanged={handleFilterChanged}
          services={services ?? []}
          setMethodsFilter={setMethodsFilter}
          setServicesFilter={setServicesFilter}
        />
      )}
      <Card className={styles.card}>
        <div className={styles.titleContainer}>
          <Typography variant="h6">Requests</Typography>
          <Button onClick={() => loadData?.()}>refresh</Button>
        </div>
        <div className={styles.requestsSection}>
          {loading ? (
            <Box
              sx={{
                display: 'flex',
                padding: '20px',
                justifyContent: 'center',
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <>
              <List>
                {filteredRequests &&
                  filteredRequests.map((req) => (
                    <RequestRow
                      request={req}
                      key={req.id}
                      serviceId={req.serviceId}
                    />
                  ))}
              </List>
            </>
          )}
        </div>
        <div className={styles.requestCardFooter}>
          <div>items:{filteredRequests?.length}</div>
        </div>
      </Card>
    </>
  );
};
