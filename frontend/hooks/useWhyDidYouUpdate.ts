import { useEffect, useRef } from "react";

export type IProps = Record<string, any>;

const useWhyDidYouUpdate = (componentName: string, props: IProps) => {
  const prevProps = useRef<IProps>({});

  useEffect(() => {
    if (prevProps.current) {
      const allKeys = Object.keys({ ...prevProps.current, ...props });
      const changedProps: IProps = {};

      allKeys.forEach((key) => {
        if (prevProps.current[key] !== props[key]) {
          changedProps[key] = {
            from: prevProps.current[key],
            to: props[key],
          };
        }
      });

      if (Object.keys(changedProps).length) {
        console.log("[UPDATED]", componentName, changedProps);
      }
    }

    prevProps.current = props;
  });
};

export default useWhyDidYouUpdate;
