import { gql, useQuery } from "@apollo/client";
import React from "react";
import { useParams } from "react-router";
import { CATEGORY_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragments";
import {
  CategoryQuery,
  CategoryQueryVariables,
} from "../../__generated__/graphql";

// Fragment가 신규 쿼리 작성할 때는 적용이 되나, 기존 캐시에 있는 쿼리데이터들로 인해
// Fragment를 넣을 시 에러가 남, apollo client 캐시를 전체 리스토어를 해야하는데 방법을 까먹음
const CATEGORY_QUERY = gql`
  query category($input: CategoryInput!) {
    category(input: $input) {
      ok
      error
      totalPages
      totalResults
      restaurants {
        ...RestaurantParts
      }
      category {
        ...CategoryParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${CATEGORY_FRAGMENT}
`;

interface ICategoryParams {
  slug: string;
}

export const Category = () => {
  // URL에 있는 변수를 지정하여 쓸 때는 useParas, 변수없이 Search같은 경우 useLocation 사용 + useEffect도 사용
  const params = useParams<ICategoryParams>();
  const { data } = useQuery<CategoryQuery, CategoryQueryVariables>(
    CATEGORY_QUERY,
    {
      variables: {
        input: {
          page: 1,
          slug: params.slug,
        },
      },
    }
  );
  console.log(data);
  return <h1>Category</h1>;
};
