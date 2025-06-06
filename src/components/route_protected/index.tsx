import { useMemo } from 'react';
import { Navigate, Outlet } from 'react-router';
import { useAtomValue } from 'jotai';
import { featureFlagsState } from '@states/app';

const RouteProtected = ({
  allowed,
  flag,
}: {
  allowed?: boolean;
  flag?: string;
}) => {
  const FEATURE_FLAGS = useAtomValue(featureFlagsState);

  const render = useMemo(() => {
    if (!flag) return allowed;

    const flagValue = FEATURE_FLAGS[flag];

    if (allowed === undefined) return flagValue;

    return allowed ? flagValue : false;
  }, [allowed, flag, FEATURE_FLAGS]);

  return render ? <Outlet /> : <Navigate to="/" />;
};

export default RouteProtected;
