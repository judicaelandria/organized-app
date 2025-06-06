import { useAppTranslation } from '@hooks/index';
import { GroupAddProps } from './index.types';
import useGroupAdd from './useGroupAdd';
import Dialog from '@components/dialog';
import GroupDetails from './group_details';
import GroupMembers from './group_members';
import Typography from '@components/typography';

const GroupAdd = (props: GroupAddProps) => {
  const { t } = useAppTranslation();

  const {
    step,
    group,
    handleGroupChange,
    handleNext,
    handleCreateGroup,
    circuit,
    handleChangeCircuit,
    handleChangeLanguage,
    language,
  } = useGroupAdd(props);

  return (
    <Dialog onClose={props.onClose} open={props.open} sx={{ gap: '16px' }}>
      <Typography className="h2">{t('tr_addNewLangGroup')}</Typography>

      {step === 'start' && (
        <GroupDetails
          onClose={props.onClose}
          group={group}
          onChange={handleGroupChange}
          onAction={handleNext}
          circuit={circuit}
          onCircuitChange={handleChangeCircuit}
          language={language}
          onLanguageChange={handleChangeLanguage}
        />
      )}

      {step === 'final' && (
        <GroupMembers
          onAction={handleCreateGroup}
          onClose={props.onClose}
          group={group}
          onChange={handleGroupChange}
        />
      )}
    </Dialog>
  );
};

export default GroupAdd;
