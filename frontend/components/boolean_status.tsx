import { Badge } from "@mantine/core";
import React, { FC } from "react";

interface Props {
  status: Boolean;
}

const BooleanStatus: FC<Props> = ({ status }) => {
  return status ? (
    <Badge color="teal" variant="outline">
      TRUE
    </Badge>
  ) : (
    <Badge color="red" variant="outline">
      FALSE
    </Badge>
  );
};

export default BooleanStatus;
