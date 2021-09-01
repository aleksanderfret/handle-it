import { gql, MutationHookOptions, useMutation } from '@apollo/client';

type RemoveAccountConfirmationResponse = boolean;

interface RemoveAccountConfirmationArgs {
  tokenId: string;
}

const REMOVE_ACCOUNT_CONFIRMATION = gql`
  mutation removeAccountConfirmation($tokenId: String!) {
    removeAccountConfirmation(tokenId: $tokenId)
  }
`;

export function useRemoveAccountConfirmationMutation(
  baseOptions?: MutationHookOptions<
    RemoveAccountConfirmationResponse,
    RemoveAccountConfirmationArgs
  >
) {
  const options = { ...baseOptions };

  return useMutation<
    RemoveAccountConfirmationResponse,
    RemoveAccountConfirmationArgs
  >(REMOVE_ACCOUNT_CONFIRMATION, options);
}
