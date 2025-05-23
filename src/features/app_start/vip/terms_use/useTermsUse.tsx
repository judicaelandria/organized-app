import { useState } from 'react';
import { useSearchParams } from 'react-router';
import { useAtom, useSetAtom } from 'jotai';
import { cookiesConsentState, isAccountChooseState } from '@states/app';
import { dbAppSettingsUpdate } from '@services/dexie/settings';

const useTermsUse = () => {
  const [params, setParams] = useSearchParams();

  const [cookiesConsent, setCookiesConsent] = useAtom(cookiesConsentState);

  const setIsAccountChoose = useSetAtom(isAccountChooseState);

  const [readComplete, setReadComplete] = useState(false);

  const handleTermsUse = () => {
    const lang = params.get('locale') || 'eng';
    const font = params.get('font') || 'Inter';

    localStorage.setItem('userConsent', 'accept');
    localStorage.setItem('ui_lang', lang);
    localStorage.setItem('app_font', font);
    setCookiesConsent(true);

    setParams((params) => {
      params.delete('locale');
      params.delete('font');

      return params;
    });
  };

  const handleRejectTerms = async () => {
    setIsAccountChoose(true);
    await dbAppSettingsUpdate({ 'user_settings.account_type': '' });
  };

  return {
    cookiesConsent,
    handleTermsUse,
    readComplete,
    setReadComplete,
    handleRejectTerms,
  };
};

export default useTermsUse;
