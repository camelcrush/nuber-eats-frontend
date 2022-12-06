import { gql, useMutation } from "@apollo/client";
import React, { useEffect } from "react";
import {
  VerifyEmailMutation,
  VerifyEmailMutationVariables,
} from "../../__generated__/graphql";

const VERIFY_EMAIL_MUTATION = gql`
  mutation verifyEmail($input: VerifyEmailInput!) {
    verifyEmail(input: $input) {
      ok
      error
    }
  }
`;

export const ConfirmEmail = () => {
  const [verifyEmailMutation, { loading: verifyingEmail }] = useMutation<
    VerifyEmailMutation,
    VerifyEmailMutationVariables
  >(VERIFY_EMAIL_MUTATION);
  useEffect(() => {
    const [_, code] = window.location.href.split("code=");
    console.log(code);
    //   verifyEmailMutation({
    //       variables:{
    //           input:{
    //               code
    //           }
    //       }
    //   })
  }, []);
  return (
    <div>
      <h2>Confirming email...</h2>
      <h4>Please wait, don't close this page...</h4>
    </div>
  );
};
