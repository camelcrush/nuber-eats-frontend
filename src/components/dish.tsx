import React from "react";
import { DishOption, Maybe } from "../__generated__/graphql";

// Owner Side에서도 같은 컴포넌트를 쓰기 때문에 옵션값으로 타입 정의하기
interface IDishProps {
  id?: number;
  name: string;
  price: number;
  description: string;
  isCustomer?: boolean;
  options?: Maybe<Array<DishOption>>;
  orderStarted?: boolean;
  addItemToOrder?: (dishId: number) => void;
  removeFromOrder?: (dishId: number) => void;
  addOptionToItem?: (dishId: number, option: any) => void;
  isSelected?: boolean;
}
// options 타입은 codegen을 통해 받은 타입으로 기입

export const Dish: React.FC<IDishProps> = ({
  id,
  name,
  price,
  description,
  isCustomer = false,
  options,
  orderStarted,
  addItemToOrder,
  removeFromOrder,
  addOptionToItem,
  isSelected,
}) => {
  const onClick = () => {
    if (orderStarted && id) {
      if (!isSelected && addItemToOrder) {
        return addItemToOrder(id);
      }
      if (isSelected && removeFromOrder) {
        return removeFromOrder(id);
      }
    }
  };
  return (
    <div
      className={` px-8 py-4 border cursor-pointer  transition-all ${
        isSelected ? "border-gray-800" : " hover:border-gray-800"
      }`}
    >
      <div className="mb-5">
        <h3 className="text-lg font-medium">
          {name}{" "}
          {orderStarted && (
            <button onClick={onClick}>{isSelected ? "Remove" : "Add"}</button>
          )}
        </h3>
        <h4 className="font-medium">{description}</h4>
      </div>
      <span>${price}</span>
      {isCustomer && options && options?.length !== 0 && (
        <div>
          <h5 className="mt-8 mb-3 font-medium">Dish Options:</h5>
          {options.map((option, index) => (
            <span
              onClick={() =>
                addOptionToItem && id
                  ? addOptionToItem(id, { name: option.name })
                  : null
              }
              className="flex items-center"
              key={index}
            >
              <h6 className="mr-2">{option.name}</h6>
              <h6 className="text-sm opacity-75">(${option.extra})</h6>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
