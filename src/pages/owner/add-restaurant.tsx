import { gql, useApolloClient, useMutation } from "@apollo/client";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Button } from "../../components/button";
import { FormError } from "../../components/form-error";
import { MY_RESTAURANTS_QUERY } from "./my-restaurants";
import {
  CreateRestaurantMutation,
  CreateRestaurantMutationVariables,
} from "../../__generated__/graphql";
import { useHistory } from "react-router";

const CREATE_RESTAURANT_MUTATION = gql`
  mutation createRestaurant($input: CreateRestaurantInput!) {
    createRestaurant(input: $input) {
      ok
      error
      restaurantId
    }
  }
`;

interface IFormProps {
  name: string;
  address: string;
  categoryName: string;
  file: FileList;
}

export const AddRestaurant = () => {
  const client = useApolloClient();
  const [imageUrl, setImageUrl] = useState("");
  const history = useHistory();
  const onCompleted = (data: CreateRestaurantMutation) => {
    const {
      createRestaurant: { ok, restaurantId },
    } = data;
    if (ok) {
      setUploading(false);
      const { name, address, categoryName } = getValues();
      // query 읽어오기
      const queryResult = client.readQuery({ query: MY_RESTAURANTS_QUERY });
      // fake cache 생성: writeQuery는 writeFrgment와 달리 쿼리 양식데이터를 맞춰줘야 함
      client.writeQuery({
        query: MY_RESTAURANTS_QUERY,
        data: {
          myRestaurants: {
            ...queryResult.myRestaurants,
            restaurants: [
              {
                address,
                category: {
                  name: categoryName,
                  __typename: "Category",
                },
                coverImg: imageUrl,
                id: restaurantId,
                isPromoted: false,
                name,
                __typename: "Restaurant",
              },
              ...queryResult.myRestaurants.restaurants,
            ],
          },
        },
      });
      history.push("/");
    }
  };
  const [createRestaurantMutation, { data }] = useMutation<
    CreateRestaurantMutation,
    CreateRestaurantMutationVariables
  >(CREATE_RESTAURANT_MUTATION, { onCompleted });
  const {
    register,
    formState: { isValid },
    getValues,
    handleSubmit,
  } = useForm<IFormProps>({ mode: "onChange" });
  const [uploading, setUploading] = useState(false);
  const onSubmit = async () => {
    try {
      setUploading(true);
      const { file, name, address, categoryName } = getValues();
      // file의 타입은 FileList인데 배열 중 첫 번째가 파일을 가리킴
      const actualFile = file[0];
      // FormData : FormData 인터페이스는 form 필드와 그 값을 나타내는 일련의 key/value 쌍을 쉽게 생성할 수 있는 방법을 제공
      const formBody = new FormData();
      formBody.append("file", actualFile);
      const { url: coverImg } = await (
        await fetch("http://localhost:4000/uploads", {
          method: "POST",
          body: formBody,
        })
      ).json();
      setImageUrl(coverImg);
      // S3 업로드 후 Mutation 실행
      createRestaurantMutation({
        variables: {
          input: {
            name,
            address,
            categoryName,
            coverImg,
          },
        },
      });
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div className="container flex flex-col items-center mt-52">
      <Helmet>
        <title>Add Restaurant | Nuber Eats</title>
      </Helmet>
      <h4 className="font-semibold text-2xl mb-3">Add Restaurant</h4>
      <form
        className="grid max-w-screen-sm gap-3 mt-5 w-full mb-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        <input
          className="input"
          type="text"
          placeholder="Name"
          {...register("name", { required: "Name is required" })}
        />
        <input
          className="input"
          type="text"
          placeholder="Address"
          {...register("address", { required: "Name is required" })}
        />
        <input
          className="input"
          type="text"
          placeholder="Category Name"
          {...register("categoryName", { required: "Name is required" })}
        />
        <input
          type="file"
          accept="image/*"
          {...register("file", { required: true })}
        />
        <Button
          loading={uploading}
          canClick={isValid}
          actionText="Create Restaurant"
        />
        {data?.createRestaurant.error && (
          <FormError errorMessage={data.createRestaurant.error} />
        )}
      </form>
    </div>
  );
};
