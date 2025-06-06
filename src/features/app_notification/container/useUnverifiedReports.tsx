import { useCallback, useMemo } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { useAppTranslation } from '@hooks/index';
import { congFieldServiceReportsState } from '@states/field_service_reports';
import { notificationsState } from '@states/notification';
import { UnverifiedReportNotificationType } from '@definition/notification';
import { secretaryRoleState } from '@states/settings';

const useUnverifiedReports = () => {
  const { t } = useAppTranslation();

  const setNotifications = useSetAtom(notificationsState);

  const reports = useAtomValue(congFieldServiceReportsState);
  const secretary = useAtomValue(secretaryRoleState);

  const unverified_reports = useMemo(() => {
    return reports.filter((record) => record.report_data.status === 'received');
  }, [reports]);

  const count = useMemo(() => {
    return unverified_reports.length;
  }, [unverified_reports]);

  const checkUnverifiedReports = useCallback(() => {
    if (!secretary) return;

    setNotifications((prev) => {
      const newValue = prev.filter(
        (record) => record.id !== 'reports-unverified'
      );

      return newValue;
    });

    if (count === 0) {
      return;
    }

    const lastUpdated = unverified_reports.sort((a, b) =>
      a.report_data.updatedAt.localeCompare(b.report_data.updatedAt)
    )[0].report_data.updatedAt;

    const reportNotification: UnverifiedReportNotificationType = {
      id: 'reports-unverified',
      title: t('tr_unverifiedReportTitle'),
      description: t('tr_unverifiedReportDesc'),
      date: lastUpdated,
      icon: 'reports',
      count,
      enableRead: false,
    };

    setNotifications((prev) => {
      const newValue = structuredClone(prev);
      newValue.push(reportNotification);

      return newValue;
    });
  }, [secretary, count, unverified_reports, t, setNotifications]);

  return { checkUnverifiedReports };
};

export default useUnverifiedReports;
