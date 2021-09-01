import { gql, MutationHookOptions, useMutation } from '@apollo/client';

type RemoveAccountResponse = boolean;

type RemoveAccountArgs = {
  email: string;
  password: string;
};

const REMOVE_ACCOUNT = gql`
  mutation removeAccount($email: String!, $password: String!) {
    removeAccount(email: $email, password: $password)
  }
`;

export function useRemoveAccountMutation(
  baseOptions?: MutationHookOptions<RemoveAccountResponse, RemoveAccountArgs>
) {
  const options = { ...baseOptions };

  return useMutation<RemoveAccountResponse, RemoveAccountArgs>(
    REMOVE_ACCOUNT,
    options
  );
}
