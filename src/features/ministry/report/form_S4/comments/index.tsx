import { useAppTranslation } from '@hooks/index';
import { FormS4Props } from '../index.types';
import useComments from './useComments';
import TextField from '@components/textfield';

const Comments = (props: FormS4Props) => {
  const { t } = useAppTranslation();

  const { value, handleCommentsChange, locked } = useComments(props);

  return (
    <TextField
      placeholder={t('tr_comments')}
      multiline
      rows={2}
      slotProps={{ input: { readOnly: locked } }}
      value={value}
      onChange={(e) => handleCommentsChange(e.target.value)}
    />
  );
};

export default Comments;
