import { gql, useMutation } from "@apollo/client";
import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "../../components/button";
import { useMe } from "../../hooks/useMe";
import {
  EditProfileMutation,
  EditProfileMutationVariables,
} from "../../__generated__/graphql";

interface IFormProps {
  email?: string;
  password?: string;
}

const EDIT_PROFILE_MUTATION = gql`
  mutation editProfile($input: EditProfileInput!) {
    editProfile(input: $input) {
      ok
      error
    }
  }
`;

export const EditProfile = () => {
  const { data: userData } = useMe();
  const onCompleted = (data: EditProfileMutation) => {
    const {
      editProfile: { ok },
    } = data;
    if (ok) {
      // update the cache
    }
  };
  const [editProfileMutation, { loading }] = useMutation<
    EditProfileMutation,
    EditProfileMutationVariables
  >(EDIT_PROFILE_MUTATION, {
    onCompleted,
  });
  const {
    register,
    handleSubmit,
    getValues,
    formState: { isValid },
  } = useForm<IFormProps>({
    mode: "onChange",
    defaultValues: {
      email: userData?.me.email,
    },
  });
  const onSubmit = () => {
    const { email, password } = getValues();
    editProfileMutation({
      variables: {
        input: {
          email,
          ...(password !== "" && { password }),
        },
      },
    });
  };
  return (
    <div className="mt-52 flex flex-col justify-center items-center">
      <h4 className=" font-semibold text-2xl mb-3">Edit Profile</h4>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid max-w-screen-sm gap-3 mt-5 w-full mb-5"
      >
        <input
          {...register("email", {
            pattern:
              /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          })}
          name="email"
          className="input"
          type="email"
          placeholder="Email"
        />
        <input
          {...register("password")}
          name="password"
          className="input"
          type="password"
          placeholder="Password"
        />
        <Button
          loading={loading}
          canClick={isValid}
          actionText="Save Profile"
        />
      </form>
    </div>
  );
};
