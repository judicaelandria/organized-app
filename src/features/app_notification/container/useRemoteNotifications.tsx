import { useEffect } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  NotificationDbRecordType,
  StandardNotificationType,
} from '@definition/notification';
import { notificationsDbState, notificationsState } from '@states/notification';
import {
  dbNotificationsBulkDelete,
  dbNotificationsBulkPut,
} from '@services/dexie/notifications';
import { updateObject } from '@utils/common';
import { hour24FormatState, shortDateFormatState } from '@states/settings';

const useRemoteNotifications = () => {
  const setNotifications = useSetAtom(notificationsState);

  const dbNotifications = useAtomValue(notificationsDbState);
  const shortDateFormat = useAtomValue(shortDateFormatState);
  const hour24 = useAtomValue(hour24FormatState);

  const handleRemoteNotifications = async (
    notifications: NotificationDbRecordType[]
  ) => {
    const notificationsToDelete = dbNotifications.filter(
      (record) =>
        notifications.some((remote) => remote.id === record.id) === false
    );

    const idsDelete = notificationsToDelete.map((r) => r.id);

    if (idsDelete.length > 0) {
      await dbNotificationsBulkDelete(idsDelete);
    }

    const notificationsToUpdate: NotificationDbRecordType[] = [];

    for (const remote of notifications) {
      const local = dbNotifications.find((record) => record.id === remote.id);

      if (!local) {
        notificationsToUpdate.push(remote);
      }

      if (local) {
        if (local.updatedAt < remote.updatedAt) {
          const newLocal = structuredClone(local);
          const newRemote = { ...remote, read: false };

          updateObject(newLocal, newRemote);

          notificationsToUpdate.push(newLocal);
        }
      }
    }

    if (notificationsToUpdate.length > 0) {
      await dbNotificationsBulkPut(notificationsToUpdate);
    }
  };

  useEffect(() => {
    const unreadNotifications = dbNotifications.filter(
      (record) => !record.read
    );

    if (unreadNotifications.length > 0) {
      for (const notification of unreadNotifications) {
        const remoteNotification: StandardNotificationType = {
          id: `standard-notification-${notification.id}`,
          title: notification.title,
          description: notification.desc,
          date: notification.updatedAt,
          icon: 'standard',
          enableRead: true,
          read: false,
        };

        setNotifications((prev) => {
          const newValue = prev.filter((r) => r.id !== remoteNotification.id);
          newValue.push(remoteNotification);

          return newValue;
        });
      }
    }
  }, [dbNotifications, shortDateFormat, hour24, setNotifications]);

  return { handleRemoteNotifications };
};

export default useRemoteNotifications;
